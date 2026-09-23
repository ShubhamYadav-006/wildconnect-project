import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { NotFoundError, ForbiddenError } from '../utils/AppError.js';

export class EquipmentController {
  // Public: Get equipment for a business
  getEquipmentByBusiness = asyncHandler(async (req: Request, res: Response) => {
    const businessId = req.params.businessId as string;
    const equipment = await prisma.businessEquipment.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(ApiResponse.success('Equipment fetched successfully', equipment));
  });

  // Partner: Create equipment
  createEquipment = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { businessId, ...data } = req.body;

    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business || business.deletedAt !== null) throw new NotFoundError('Business not found');
    if (business.userId !== userId) throw new ForbiddenError('Not authorized for this business');

    const item = await prisma.businessEquipment.create({
      data: {
        ...data,
        businessId,
      },
    });

    res.status(201).json(ApiResponse.success('Equipment created successfully', item));
  });

  // Partner: Update equipment
  updateEquipment = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const item = await prisma.businessEquipment.findUnique({
      where: { id },
      include: { business: true },
    });

    if (!item) throw new NotFoundError('Equipment item not found');
    if (item.business.userId !== userId) throw new ForbiddenError('Not authorized to update this equipment');

    const updated = await prisma.businessEquipment.update({
      where: { id },
      data: req.body,
    });

    res.status(200).json(ApiResponse.success('Equipment updated successfully', updated));
  });

  // Partner: Delete equipment
  deleteEquipment = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const item = await prisma.businessEquipment.findUnique({
      where: { id },
      include: { business: true },
    });

    if (!item) throw new NotFoundError('Equipment item not found');
    if (item.business.userId !== userId) throw new ForbiddenError('Not authorized to delete this equipment');

    await prisma.businessEquipment.delete({
      where: { id },
    });

    res.status(200).json(ApiResponse.success('Equipment deleted successfully'));
  });
}

export const equipmentController = new EquipmentController();
