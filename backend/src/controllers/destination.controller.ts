import { Request, Response } from 'express';
import { destinationService } from '../services/destination.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAllDestinations = asyncHandler(async (req: Request, res: Response) => {
  const result = await destinationService.getAllDestinations();
  res.status(200).json(ApiResponse.success('Destinations retrieved successfully', result));
});

export const getDestinationBySlug = asyncHandler(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const result = await destinationService.getDestinationBySlug(slug);
  res.status(200).json(ApiResponse.success('Destination retrieved successfully', result));
});

export const createDestination = asyncHandler(async (req: Request, res: Response) => {
  const result = await destinationService.createDestination(req.body);
  res.status(201).json(ApiResponse.success('Destination created successfully', result));
});

export const updateDestination = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await destinationService.updateDestination(id, req.body);
  res.status(200).json(ApiResponse.success('Destination updated successfully', result));
});

export const deleteDestination = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await destinationService.deleteDestination(id);
  res.status(200).json(ApiResponse.success(result.message));
});
