import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/AppError.js';

export class CalendarBlockController {
  // Get calendar blocks for a business
  getBlocksByBusiness = asyncHandler(async (req: Request, res: Response) => {
    const businessId = req.params.businessId as string;
    const { startDate, endDate } = req.query;

    const where: any = { businessId };

    if (startDate && endDate) {
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);
      where.AND = [
        { startDate: { lt: end } },
        { endDate: { gt: start } },
      ];
    }

    const blocks = await prisma.businessInventoryBlock.findMany({
      where,
      include: {
        room: { select: { id: true, name: true } },
        vehicle: { select: { id: true, modelName: true, registrationNumber: true } },
        equipment: { select: { id: true, brandAndModel: true } },
      },
      orderBy: { startDate: 'asc' },
    });

    res.status(200).json(ApiResponse.success('Calendar blocks fetched successfully', blocks));
  });

  // Partner: Create manual calendar blackout block
  createBlock = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { businessId, startDate, endDate, roomId, vehicleId, equipmentId, slot, unitsBlocked, reason, notes } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      throw new BadRequestError('End date must be after start date');
    }

    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business || business.deletedAt !== null) throw new NotFoundError('Business not found');
    if (business.userId !== userId) throw new ForbiddenError('Not authorized for this business');

    const block = await prisma.businessInventoryBlock.create({
      data: {
        businessId,
        roomId: roomId || null,
        vehicleId: vehicleId || null,
        equipmentId: equipmentId || null,
        startDate: start,
        endDate: end,
        slot: slot || null,
        unitsBlocked: Number(unitsBlocked) || 1,
        reason,
        notes: notes || null,
      },
    });

    res.status(201).json(ApiResponse.success('Inventory block created successfully', block));
  });

  // Partner: Delete/Unblock
  deleteBlock = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const block = await prisma.businessInventoryBlock.findUnique({
      where: { id },
      include: { business: true },
    });

    if (!block) throw new NotFoundError('Inventory block not found');
    if (block.business.userId !== userId) throw new ForbiddenError('Not authorized to delete this block');

    await prisma.businessInventoryBlock.delete({
      where: { id },
    });

    res.status(200).json(ApiResponse.success('Inventory block deleted successfully'));
  });
}

export const calendarBlockController = new CalendarBlockController();
