import { Request, Response } from 'express';
import { resortService } from '../services/resort.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAllResorts = asyncHandler(async (req: Request, res: Response) => {
  const result = await resortService.getAllResorts();
  res.status(200).json(ApiResponse.success('Resorts retrieved successfully', result));
});

export const getResortById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await resortService.getResortById(id);
  res.status(200).json(ApiResponse.success('Resort retrieved successfully', result));
});

export const getResortsByDestinationId = asyncHandler(async (req: Request, res: Response) => {
  const destinationId = req.params.destinationId as string;
  const result = await resortService.getResortsByDestinationId(destinationId);
  res.status(200).json(ApiResponse.success('Resorts retrieved successfully', result));
});

export const createResort = asyncHandler(async (req: Request, res: Response) => {
  const result = await resortService.createResort(req.body);
  res.status(201).json(ApiResponse.success('Resort created successfully', result));
});

export const updateResort = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await resortService.updateResort(id, req.body);
  res.status(200).json(ApiResponse.success('Resort updated successfully', result));
});

export const deleteResort = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await resortService.deleteResort(id);
  res.status(200).json(ApiResponse.success(result.message));
});
