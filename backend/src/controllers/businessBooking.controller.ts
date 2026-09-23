import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/AppError.js';
import { notificationService } from '../services/notification.service.js';
import { emailService } from '../services/email.service.js';
import { NotificationType } from '../generated/prisma/index.js';

// Public/Tourist: Check availability for dates across all categories
export const checkAvailability = asyncHandler(async (req: Request, res: Response) => {
  const { businessId, roomId, vehicleId, equipmentId, slot, startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    throw new BadRequestError('Missing startDate or endDate');
  }

  const start = new Date(startDate as string);
  const end = new Date(endDate as string);

  if (start >= end) {
    throw new BadRequestError('End date must be after start date');
  }

  // 1. ACCOMMODATION / ROOM
  if (roomId) {
    const room = await prisma.businessRoom.findUnique({
      where: { id: roomId as string },
      include: { business: true },
    });

    if (!room || room.business.status !== 'APPROVED' || room.business.deletedAt !== null) {
      throw new NotFoundError('Room not found or business is not approved');
    }

    const overlappingBookings = await prisma.businessBooking.count({
      where: {
        roomId: room.id,
        status: { in: ['CONFIRMED'] },
        AND: [
          { startDate: { lt: end } },
          { endDate: { gt: start } },
        ],
      },
    });

    const manualBlocks = await prisma.businessInventoryBlock.aggregate({
      where: {
        roomId: room.id,
        AND: [
          { startDate: { lt: end } },
          { endDate: { gt: start } },
        ],
      },
      _sum: { unitsBlocked: true },
    });

    const totalUnavailable = overlappingBookings + (manualBlocks._sum.unitsBlocked || 0);
    const availableUnits = Math.max(0, room.totalInventory - totalUnavailable);

    return res.status(200).json(
      ApiResponse.success('Availability checked', {
        isAvailable: availableUnits > 0,
        availableUnits,
        totalInventory: room.totalInventory,
      })
    );
  }

  // 2. TAXI / VEHICLE
  if (vehicleId) {
    const vehicle = await prisma.businessVehicle.findUnique({
      where: { id: vehicleId as string },
      include: { business: true },
    });

    if (!vehicle || vehicle.business.status !== 'APPROVED' || vehicle.business.deletedAt !== null) {
      throw new NotFoundError('Vehicle not found or business is not approved');
    }

    const bookingWhere: any = {
      vehicleId: vehicle.id,
      status: { in: ['CONFIRMED'] },
      AND: [
        { startDate: { lt: end } },
        { endDate: { gt: start } },
      ],
    };

    if (slot) bookingWhere.slot = slot as any;

    const overlappingBookings = await prisma.businessBooking.count({ where: bookingWhere });

    const blockWhere: any = {
      vehicleId: vehicle.id,
      AND: [
        { startDate: { lt: end } },
        { endDate: { gt: start } },
      ],
    };
    if (slot) blockWhere.slot = slot as any;

    const manualBlocks = await prisma.businessInventoryBlock.count({ where: blockWhere });

    const isAvailable = overlappingBookings === 0 && manualBlocks === 0;

    return res.status(200).json(
      ApiResponse.success('Availability checked', {
        isAvailable,
        availableUnits: isAvailable ? 1 : 0,
        totalInventory: 1,
      })
    );
  }

  // 3. CAMERA / EQUIPMENT
  if (equipmentId) {
    const item = await prisma.businessEquipment.findUnique({
      where: { id: equipmentId as string },
      include: { business: true },
    });

    if (!item || item.business.status !== 'APPROVED' || item.business.deletedAt !== null) {
      throw new NotFoundError('Equipment not found or business is not approved');
    }

    const overlappingBookings = await prisma.businessBooking.count({
      where: {
        equipmentId: item.id,
        status: { in: ['CONFIRMED'] },
        AND: [
          { startDate: { lt: end } },
          { endDate: { gt: start } },
        ],
      },
    });

    const manualBlocks = await prisma.businessInventoryBlock.count({
      where: {
        equipmentId: item.id,
        AND: [
          { startDate: { lt: end } },
          { endDate: { gt: start } },
        ],
      },
    });

    const isAvailable = overlappingBookings === 0 && manualBlocks === 0;

    return res.status(200).json(
      ApiResponse.success('Availability checked', {
        isAvailable,
        availableUnits: isAvailable ? 1 : 0,
        totalInventory: 1,
      })
    );
  }

  throw new BadRequestError('Must specify roomId, vehicleId, or equipmentId');
});

// Tourist: Create a Direct Business Booking (Atomic Transaction with Escrow Payout)
export const createBusinessBooking = asyncHandler(async (req: Request, res: Response) => {
  const { businessId, roomId, vehicleId, equipmentId, slot, startDate, endDate, travelerCount, guestName, guestEmail, guestPhone, specialRequests } = req.body;
  const userId = req.user.id;

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start >= end) {
    throw new BadRequestError('Check-out/End date must be after check-in/Start date');
  }

  // Calculate days / nights
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const unitsCount = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Run atomic booking transaction
  const result = await prisma.$transaction(async (tx) => {
    let totalAmount = 0;
    let itemName = '';

    // A. ROOM BOOKING
    if (roomId) {
      const room = await tx.businessRoom.findUnique({
        where: { id: roomId },
        include: { business: true },
      });

      if (!room || room.business.id !== businessId || room.business.status !== 'APPROVED' || room.business.deletedAt !== null) {
        throw new NotFoundError('Invalid room selection or business is not approved');
      }

      if (travelerCount > room.capacity) {
        throw new BadRequestError(`Traveler count exceeds room capacity of ${room.capacity}`);
      }

      const overlappingCount = await tx.businessBooking.count({
        where: {
          roomId: room.id,
          status: 'CONFIRMED',
          AND: [
            { startDate: { lt: end } },
            { endDate: { gt: start } },
          ],
        },
      });

      const blocks = await tx.businessInventoryBlock.aggregate({
        where: {
          roomId: room.id,
          AND: [
            { startDate: { lt: end } },
            { endDate: { gt: start } },
          ],
        },
        _sum: { unitsBlocked: true },
      });

      const totalUnavailable = overlappingCount + (blocks._sum.unitsBlocked || 0);
      if (totalUnavailable >= room.totalInventory) {
        throw new BadRequestError('Sorry, this room is completely booked or blocked for the selected dates.');
      }

      totalAmount = room.basePrice * unitsCount;
      itemName = room.name;
    } 
    // B. VEHICLE / TAXI BOOKING
    else if (vehicleId) {
      const vehicle = await tx.businessVehicle.findUnique({
        where: { id: vehicleId },
        include: { business: true },
      });

      if (!vehicle || vehicle.business.id !== businessId || vehicle.business.status !== 'APPROVED' || vehicle.business.deletedAt !== null) {
        throw new NotFoundError('Invalid vehicle selection or business is not approved');
      }

      const conflictCount = await tx.businessBooking.count({
        where: {
          vehicleId: vehicle.id,
          slot: slot || undefined,
          status: 'CONFIRMED',
          AND: [
            { startDate: { lt: end } },
            { endDate: { gt: start } },
          ],
        },
      });

      if (conflictCount > 0) {
        throw new BadRequestError('Sorry, this vehicle is already booked for the selected slot.');
      }

      totalAmount = vehicle.basePricePerSlot * unitsCount;
      itemName = `${vehicle.modelName} (${vehicle.vehicleType})`;
    }
    // C. CAMERA / EQUIPMENT BOOKING
    else if (equipmentId) {
      const equip = await tx.businessEquipment.findUnique({
        where: { id: equipmentId },
        include: { business: true },
      });

      if (!equip || equip.business.id !== businessId || equip.business.status !== 'APPROVED' || equip.business.deletedAt !== null) {
        throw new NotFoundError('Invalid equipment selection or business is not approved');
      }

      const conflictCount = await tx.businessBooking.count({
        where: {
          equipmentId: equip.id,
          status: 'CONFIRMED',
          AND: [
            { startDate: { lt: end } },
            { endDate: { gt: start } },
          ],
        },
      });

      if (conflictCount > 0) {
        throw new BadRequestError('Sorry, this equipment is already rented for the selected dates.');
      }

      totalAmount = (equip.dailyRate * unitsCount) + equip.securityDeposit;
      itemName = equip.brandAndModel;
    } else {
      throw new BadRequestError('Booking must target a roomId, vehicleId, or equipmentId');
    }

    const platformFee = Math.round(totalAmount * 0.10); // 10% platform fee
    const netPayout = totalAmount - platformFee;

    // Create Booking
    const booking = await tx.businessBooking.create({
      data: {
        businessId,
        roomId: roomId || null,
        vehicleId: vehicleId || null,
        equipmentId: equipmentId || null,
        slot: slot || null,
        userId,
        guestName,
        guestEmail,
        guestPhone,
        specialRequests,
        startDate: start,
        endDate: end,
        travelerCount: Number(travelerCount) || 1,
        totalAmount,
        platformFee,
        status: 'CONFIRMED',
        payoutStatus: 'HELD_IN_ESCROW',
      },
      include: {
        business: true,
        room: true,
        vehicle: true,
        equipment: true,
      },
    });

    // Create Escrow Payout Transaction
    await tx.payoutTransaction.create({
      data: {
        businessId,
        bookingId: booking.id,
        grossAmount: totalAmount,
        platformFee,
        netPayout,
        status: 'HELD_IN_ESCROW',
      },
    });

    return { booking, itemName };
  });

  const { booking, itemName } = result;

  // Notify Tourist
  await notificationService.createNotification({
    userId,
    title: 'Booking Confirmed!',
    message: `Your booking at ${booking.business.name} for ${itemName} has been confirmed.`,
    type: NotificationType.BUSINESS_BOOKING_CONFIRMED,
    referenceId: booking.id,
  });

  // Notify Partner
  await notificationService.createNotification({
    userId: booking.business.userId,
    title: 'New Booking Received!',
    message: `New booking received from ${guestName} for ${itemName} (${unitsCount} days).`,
    type: NotificationType.BUSINESS_NEW_BOOKING_PARTNER,
    referenceId: booking.id,
  });

  // Send Confirmation Email
  emailService.sendEmail({
    to: guestEmail,
    subject: `Booking Confirmed: ${booking.business.name}`,
    html: `
      <h2>Booking Confirmation</h2>
      <p>Dear ${guestName},</p>
      <p>Thank you for booking with <strong>${booking.business.name}</strong> on WildConnect!</p>
      <p><strong>Item / Service:</strong> ${itemName}</p>
      <p><strong>From:</strong> ${start.toLocaleDateString()}</p>
      <p><strong>To:</strong> ${end.toLocaleDateString()}</p>
      <p><strong>Total Amount:</strong> ₹${booking.totalAmount.toLocaleString('en-IN')}</p>
    `,
  });

  res.status(201).json(ApiResponse.success('Booking placed successfully', booking));
});

// Tourist: Get My Bookings
export const getMyBookings = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user.id;

  const bookings = await prisma.businessBooking.findMany({
    where: { userId },
    include: {
      business: { select: { id: true, name: true, coverImage: true, type: true, destination: true } },
      room: true,
      vehicle: true,
      equipment: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json(ApiResponse.success('Bookings fetched', bookings));
});

// Partner: Get Bookings for owned businesses
export const getPartnerBookings = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const status = req.query.status as any;
  const businessId = req.query.businessId as string | undefined;

  const whereClause: any = {
    business: { userId },
  };

  if (status) whereClause.status = status;
  if (businessId) whereClause.businessId = businessId;

  const bookings = await prisma.businessBooking.findMany({
    where: whereClause,
    include: {
      business: { select: { id: true, name: true } },
      room: true,
      vehicle: true,
      equipment: true,
      payout: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json(ApiResponse.success('Partner bookings fetched', bookings));
});

// Cancel a Booking (Tiered Tourist Refund or Partner Emergency Cancellation)
export const cancelBooking = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user.id;
  const { cancellationReason } = req.body;

  const booking = await prisma.businessBooking.findUnique({
    where: { id },
    include: { business: true, room: true, vehicle: true, equipment: true },
  });

  if (!booking) throw new NotFoundError('Booking not found');
  if (booking.status !== 'CONFIRMED') {
    throw new BadRequestError(`Cannot cancel a booking with status ${booking.status}`);
  }

  const isCustomer = booking.userId === userId;
  const isOwner = booking.business.userId === userId;

  if (!isCustomer && !isOwner) {
    throw new ForbiddenError('You do not have permission to cancel this booking');
  }

  const now = new Date();
  const startDate = new Date(booking.startDate);
  const hoursUntilCheckIn = (startDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  let newStatus: any = isCustomer ? 'CANCELLED_BY_GUEST' : 'CANCELLED_BY_PARTNER';
  let refundAmount = 0;
  let refundStatus = 'NO_REFUND';

  if (isCustomer) {
    if (hoursUntilCheckIn >= 168) {
      // > 7 days prior: 100% refund minus 3% payment gateway fee
      refundAmount = Math.round(booking.totalAmount * 0.97);
      refundStatus = 'FULL_REFUND_PROCESSED';
    } else if (hoursUntilCheckIn >= 72) {
      // 3 to 7 days prior: 50% refund
      refundAmount = Math.round(booking.totalAmount * 0.50);
      refundStatus = 'PARTIAL_50_REFUND_PROCESSED';
    } else {
      // < 72 hours prior: Non-refundable (partner paid in full)
      refundAmount = 0;
      refundStatus = 'NON_REFUNDABLE_WINDOW';
    }
  } else {
    // Partner cancelled: 100% full refund to guest
    refundAmount = booking.totalAmount;
    refundStatus = 'FULL_REFUND_PARTNER_CANCELLED';
  }

  const updatedBooking = await prisma.businessBooking.update({
    where: { id },
    data: {
      status: newStatus,
      cancellationReason: cancellationReason || (isCustomer ? 'Cancelled by traveler' : 'Emergency partner cancellation'),
      cancelledAt: new Date(),
      refundAmount,
      refundStatus,
      payoutStatus: refundAmount === booking.totalAmount ? 'ON_HOLD' : booking.payoutStatus,
    },
  });

  // Notify recipient
  const notifyRecipient = isCustomer ? booking.business.userId : booking.userId;
  const notifType = isCustomer ? NotificationType.BOOKING_CANCELLED_GUEST : NotificationType.BOOKING_CANCELLED_PARTNER;

  await notificationService.createNotification({
    userId: notifyRecipient,
    title: isCustomer ? 'Booking Cancelled by Guest' : 'Booking Cancelled by Partner',
    message: `Booking #${booking.id.slice(0, 8)} has been cancelled. Refund status: ${refundStatus} (₹${refundAmount}).`,
    type: notifType,
    referenceId: booking.id,
  });

  res.status(200).json(ApiResponse.success('Booking cancelled and inventory released', updatedBooking));
});
