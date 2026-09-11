import { Request, Response } from 'express';
import { bookingService } from '../services/booking.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAllBookings = asyncHandler(async (req: Request, res: Response) => {
  const result = await bookingService.getAllBookings();
  res.status(200).json(ApiResponse.success('Bookings retrieved successfully', result));
});

export const getMyBookings = asyncHandler(async (req: Request, res: Response) => {
  const result = await bookingService.getMyBookings(req.user!.id);
  res.status(200).json(ApiResponse.success('Bookings retrieved successfully', result));
});

export const getBookingById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await bookingService.getBookingById(id, req.user!.id, req.user!.role);
  res.status(200).json(ApiResponse.success('Booking retrieved successfully', result));
});

export const cancelBooking = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await bookingService.cancelBooking(id, req.user!.id);
  res.status(200).json(ApiResponse.success('Booking cancelled successfully', result));
});

export const updateBookingStatus = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { status } = req.body;
  const result = await bookingService.updateBookingStatus(id, status);
  res.status(200).json(ApiResponse.success('Booking status updated successfully', result));
});
