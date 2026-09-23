import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { NotFoundError, ForbiddenError } from '../utils/AppError.js';

export class VehicleController {
  // Public: Get vehicles for a business
  getVehiclesByBusiness = asyncHandler(async (req: Request, res: Response) => {
    const businessId = req.params.businessId as string;
    const vehicles = await prisma.businessVehicle.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(ApiResponse.success('Vehicles fetched successfully', vehicles));
  });

  // Partner: Create vehicle
  createVehicle = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { businessId, ...data } = req.body;

    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business || business.deletedAt !== null) throw new NotFoundError('Business not found');
    if (business.userId !== userId) throw new ForbiddenError('Not authorized for this business');

    const vehicle = await prisma.businessVehicle.create({
      data: {
        ...data,
        businessId,
      },
    });

    res.status(201).json(ApiResponse.success('Vehicle created successfully', vehicle));
  });

  // Partner: Update vehicle
  updateVehicle = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const vehicle = await prisma.businessVehicle.findUnique({
      where: { id },
      include: { business: true },
    });

    if (!vehicle) throw new NotFoundError('Vehicle not found');
    if (vehicle.business.userId !== userId) throw new ForbiddenError('Not authorized to update this vehicle');

    const updated = await prisma.businessVehicle.update({
      where: { id },
      data: req.body,
    });

    res.status(200).json(ApiResponse.success('Vehicle updated successfully', updated));
  });

  // Partner: Delete vehicle
  deleteVehicle = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const vehicle = await prisma.businessVehicle.findUnique({
      where: { id },
      include: { business: true },
    });

    if (!vehicle) throw new NotFoundError('Vehicle not found');
    if (vehicle.business.userId !== userId) throw new ForbiddenError('Not authorized to delete this vehicle');

    await prisma.businessVehicle.delete({
      where: { id },
    });

    res.status(200).json(ApiResponse.success('Vehicle deleted successfully'));
  });
}

export const vehicleController = new VehicleController();
