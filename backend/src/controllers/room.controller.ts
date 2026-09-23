import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/AppError.js';

// Get all rooms for an approved business (Public)
export const getPublicRoomsByBusiness = asyncHandler(async (req: Request, res: Response) => {
  const businessId = req.params.businessId as string;

  const business = await prisma.business.findUnique({
    where: { id: businessId },
  });

  if (!business || business.status !== 'APPROVED' || business.deletedAt !== null) {
    throw new NotFoundError('Business not found or not approved');
  }

  const rooms = await prisma.businessRoom.findMany({
    where: { businessId },
    orderBy: { createdAt: 'asc' },
  });

  res.status(200).json(ApiResponse.success('Rooms fetched successfully', rooms));
});

// Partner: Get rooms for partner's business
export const getMyBusinessRooms = asyncHandler(async (req: Request, res: Response) => {
  const businessId = req.params.businessId as string;
  const userId = req.user.id;

  const business = await prisma.business.findFirst({
    where: { id: businessId, userId, deletedAt: null },
  });

  if (!business) {
    throw new ForbiddenError('You do not own this business');
  }

  const rooms = await prisma.businessRoom.findMany({
    where: { businessId },
    orderBy: { createdAt: 'asc' },
  });

  res.status(200).json(ApiResponse.success('Rooms fetched successfully', rooms));
});

// Partner: Create a room
export const createRoom = asyncHandler(async (req: Request, res: Response) => {
  const { businessId, name, description, capacity, basePrice, totalInventory, amenities, images } = req.body;
  const userId = req.user.id;

  const business = await prisma.business.findFirst({
    where: { id: businessId, userId, deletedAt: null },
  });

  if (!business) {
    throw new ForbiddenError('You do not own this business');
  }

  if (totalInventory < 0 || basePrice < 0 || capacity < 1) {
    throw new BadRequestError('Invalid room capacity, price, or inventory count');
  }

  const room = await prisma.businessRoom.create({
    data: {
      businessId,
      name,
      description: description || '',
      capacity: Number(capacity),
      basePrice: Number(basePrice),
      totalInventory: Number(totalInventory),
      amenities: amenities || [],
      images: images || [],
    },
  });

  res.status(201).json(ApiResponse.success('Room created successfully', room));
});

// Partner: Update a room
export const updateRoom = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { name, description, capacity, basePrice, totalInventory, amenities, images } = req.body;
  const userId = req.user.id;

  const room = await prisma.businessRoom.findUnique({
    where: { id },
    include: { business: true },
  });

  if (!room || room.business.userId !== userId) {
    throw new ForbiddenError('You do not have permission to update this room');
  }

  if (totalInventory !== undefined && totalInventory < 0) {
    throw new BadRequestError('Inventory count cannot be negative');
  }

  const updatedRoom = await prisma.businessRoom.update({
    where: { id },
    data: {
      name,
      description,
      capacity: capacity !== undefined ? Number(capacity) : undefined,
      basePrice: basePrice !== undefined ? Number(basePrice) : undefined,
      totalInventory: totalInventory !== undefined ? Number(totalInventory) : undefined,
      amenities,
      images,
    },
  });

  res.status(200).json(ApiResponse.success('Room updated successfully', updatedRoom));
});

// Partner: Delete a room
export const deleteRoom = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user.id;

  const room = await prisma.businessRoom.findUnique({
    where: { id },
    include: { business: true },
  });

  if (!room || room.business.userId !== userId) {
    throw new ForbiddenError('You do not have permission to delete this room');
  }

  await prisma.businessRoom.delete({
    where: { id },
  });

  res.status(200).json(ApiResponse.success('Room deleted successfully'));
});
