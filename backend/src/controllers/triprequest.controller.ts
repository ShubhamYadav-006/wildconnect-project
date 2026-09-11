import { Request, Response } from 'express';
import { tripRequestService } from '../services/triprequest.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createTripRequest = asyncHandler(async (req: Request, res: Response) => {
  const result = await tripRequestService.createRequest(req.user!.id, req.body);
  res.status(201).json(ApiResponse.success('Trip request created successfully', result));
});

export const getMyTripRequests = asyncHandler(async (req: Request, res: Response) => {
  const result = await tripRequestService.getMyRequests(req.user!.id);
  res.status(200).json(ApiResponse.success('Trip requests retrieved successfully', result));
});

export const getTripRequestById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await tripRequestService.getRequestById(id, req.user!.id, req.user!.role);
  res.status(200).json(ApiResponse.success('Trip request retrieved successfully', result));
});

export const cancelTripRequest = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await tripRequestService.cancelRequest(id, req.user!.id);
  res.status(200).json(ApiResponse.success('Trip request cancelled successfully', result));
});

export const getAllTripRequests = asyncHandler(async (req: Request, res: Response) => {
  const status = req.query.status as string | undefined;
  const result = await tripRequestService.getAllRequests(status);
  res.status(200).json(ApiResponse.success('Trip requests retrieved successfully', result));
});

export const updateTripRequestStatus = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { status } = req.body;
  const result = await tripRequestService.updateStatus(id, status);
  res.status(200).json(ApiResponse.success('Trip request status updated successfully', result));
});
