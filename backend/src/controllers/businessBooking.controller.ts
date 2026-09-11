import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/AppError.js';
import { notificationService } from '../services/notification.service.js';
import { emailService } from '../services/email.service.js';
import { NotificationType } from '../generated/prisma/index.js';

// Public/Tourist: Check availability for dates
export const checkRoomAvailability = asyncHandler(async (req: Request, res: Response) => {
  const { roomId, startDate, endDate } = req.query;

  if (!roomId || !startDate || !endDate) {
    throw new BadRequestError('Missing roomId, startDate, or endDate');
  }

  const start = new Date(startDate as string);
  const end = new Date(endDate as string);

  if (start >= end) {
    throw new BadRequestError('End date must be after start date');
  }

  const room = await prisma.businessRoom.findUnique({
    where: { id: roomId as string },
    include: { business: true },
  });

  if (!room || room.business.status !== 'APPROVED') {
    throw new NotFoundError('Room not found or business is not approved');
  }

  // Count overlapping confirmed bookings
  const overlappingBookings = await prisma.businessBooking.count({
    where: {
      roomId: room.id,
      status: 'CONFIRMED',
      OR: [
        {
          startDate: { lte: start },
          endDate: { gt: start },
        },
        {
          startDate: { lt: end },
          endDate: { gte: end },
        },
        {
          startDate: { gte: start },
          endDate: { lte: end },
        },
      ],
    },
  });

  const availableUnits = Math.max(0, room.totalInventory - overlappingBookings);

  res.status(200).json(
    ApiResponse.success('Availability checked', {
      isAvailable: availableUnits > 0,
      availableUnits,
      totalInventory: room.totalInventory,
    })
  );
});

// Tourist: Create a Direct Business Booking (Atomic Transaction)
export const createBusinessBooking = asyncHandler(async (req: Request, res: Response) => {
  const { businessId, roomId, startDate, endDate, travelerCount, guestName, guestEmail, guestPhone, specialRequests } = req.body;
  const userId = req.user.id;

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start >= end) {
    throw new BadRequestError('Check-out date must be after check-in date');
  }

  // Calculate nights
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Run atomic booking transaction
  const result = await prisma.$transaction(async (tx) => {
    // 1. Fetch Room & Business with lock-like query
    const room = await tx.businessRoom.findUnique({
      where: { id: roomId },
      include: { business: true },
    });

    if (!room || room.business.id !== businessId || room.business.status !== 'APPROVED') {
      throw new NotFoundError('Invalid room selection or business is not approved');
    }

    if (travelerCount > room.capacity) {
      throw new BadRequestError(`Traveler count exceeds room capacity of ${room.capacity}`);
    }

    // 2. Check Overlapping Bookings atomically
    const overlappingBookingsCount = await tx.businessBooking.count({
      where: {
        roomId: room.id,
        status: 'CONFIRMED',
        OR: [
          {
            startDate: { lte: start },
            endDate: { gt: start },
          },
          {
            startDate: { lt: end },
            endDate: { gte: end },
          },
          {
            startDate: { gte: start },
            endDate: { lte: end },
          },
        ],
      },
    });

    if (overlappingBookingsCount >= room.totalInventory) {
      throw new BadRequestError('Sorry, this room is completely booked for the selected dates.');
    }

    const totalAmount = room.basePrice * nights;

    // 3. Create Booking
    const booking = await tx.businessBooking.create({
      data: {
        businessId,
        roomId,
        userId,
        guestName,
        guestEmail,
        guestPhone,
        specialRequests,
        startDate: start,
        endDate: end,
        travelerCount: Number(travelerCount),
        totalAmount,
        status: 'CONFIRMED',
      },
      include: {
        business: true,
        room: true,
      },
    });

    return booking;
  });

  // 4. Send In-App Notifications
  // Notify Tourist
  await notificationService.createNotification({
    userId,
    title: 'Booking Confirmed!',
    message: `Your booking at ${result.business.name} for ${result.room.name} has been confirmed.`,
    type: NotificationType.BUSINESS_BOOKING_CONFIRMED,
    referenceId: result.id,
  });

  // Notify Business Partner
  await notificationService.createNotification({
    userId: result.business.userId,
    title: 'New Booking Received!',
    message: `New booking received from ${guestName} for ${result.room.name} (${nights} nights).`,
    type: NotificationType.BUSINESS_NEW_BOOKING_PARTNER,
    referenceId: result.id,
  });

  // 5. Send Transactional Confirmation Emails (Asynchronously)
  emailService.sendEmail({
    to: guestEmail,
    subject: `Booking Confirmed: ${result.business.name}`,
    html: `
      <h2>Booking Confirmation</h2>
      <p>Dear ${guestName},</p>
      <p>Thank you for booking with <strong>${result.business.name}</strong> on WildConnect!</p>
      <p><strong>Room:</strong> ${result.room.name}</p>
      <p><strong>Check-in:</strong> ${start.toLocaleDateString()}</p>
      <p><strong>Check-out:</strong> ${end.toLocaleDateString()}</p>
      <p><strong>Nights:</strong> ${nights}</p>
      <p><strong>Total Amount Paid/Due:</strong> $${result.totalAmount}</p>
      <hr />
      <p>Need support? Reply directly to this email.</p>
    `,
  });

  res.status(201).json(ApiResponse.success('Booking placed successfully', result));
});

// Tourist: Get My Bookings
export const getMyBookings = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user.id;

  const bookings = await prisma.businessBooking.findMany({
    where: { userId },
    include: {
      business: { select: { id: true, name: true, coverImage: true, type: true, destination: true } },
      room: true,
      review: true,
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
    },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json(ApiResponse.success('Partner bookings fetched', bookings));
});

// Partner/Tourist: Cancel a Booking
export const cancelBooking = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user.id;

  const booking = await prisma.businessBooking.findUnique({
    where: { id },
    include: { business: true, room: true },
  });

  if (!booking) throw new NotFoundError('Booking not found');

  // Allow either the booking user or the business owner to cancel
  const isCustomer = booking.userId === userId;
  const isOwner = booking.business.userId === userId;

  if (!isCustomer && !isOwner) {
    throw new ForbiddenError('You do not have permission to cancel this booking');
  }

  const updatedBooking = await prisma.businessBooking.update({
    where: { id },
    data: { status: 'CANCELLED' },
  });

  // Notify partner or tourist accordingly
  const notifyRecipient = isCustomer ? booking.business.userId : booking.userId;
  await notificationService.createNotification({
    userId: notifyRecipient,
    title: 'Booking Cancelled',
    message: `Booking #${booking.id.slice(0, 8)} for ${booking.room.name} has been cancelled.`,
    type: NotificationType.BUSINESS_BOOKING_CANCELLED,
    referenceId: booking.id,
  });

  // Send cancellation email
  emailService.sendEmail({
    to: booking.guestEmail,
    subject: `Booking Cancelled: ${booking.business.name}`,
    html: `<p>Your booking for ${booking.room.name} at ${booking.business.name} has been cancelled.</p>`,
  });

  res.status(200).json(ApiResponse.success('Booking cancelled successfully', updatedBooking));
});
