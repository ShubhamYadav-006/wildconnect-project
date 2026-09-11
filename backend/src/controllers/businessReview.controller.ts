import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/AppError.js';
import { notificationService } from '../services/notification.service.js';
import { NotificationType } from '../generated/prisma/index.js';

// Public: Get reviews for an approved business
export const getBusinessReviews = asyncHandler(async (req: Request, res: Response) => {
  const businessId = req.params.businessId as string;

  const reviews = await prisma.businessReview.findMany({
    where: {
      businessId,
      status: 'PUBLISHED',
    },
    include: {
      user: { select: { firstName: true, lastName: true, avatar: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json(ApiResponse.success('Reviews fetched', reviews));
});

// Tourist: Create a Review for a verified booking
export const createBusinessReview = asyncHandler(async (req: Request, res: Response) => {
  const { businessBookingId, rating, comment } = req.body;
  const userId = req.user.id;

  if (!rating || rating < 1 || rating > 5) {
    throw new BadRequestError('Rating must be between 1 and 5');
  }

  // Ensure booking belongs to user and is completed/confirmed
  const booking = await prisma.businessBooking.findUnique({
    where: { id: businessBookingId },
    include: { business: true },
  });

  if (!booking || booking.userId !== userId) {
    throw new ForbiddenError('You can only review your own verified bookings');
  }

  // Check if review already exists
  const existingReview = await prisma.businessReview.findUnique({
    where: { businessBookingId },
  });

  if (existingReview) {
    throw new BadRequestError('You have already submitted a review for this booking');
  }

  const review = await prisma.businessReview.create({
    data: {
      businessId: booking.businessId,
      userId,
      businessBookingId,
      rating: Number(rating),
      comment,
      status: 'PUBLISHED',
    },
    include: {
      user: { select: { firstName: true, lastName: true } },
    },
  });

  // Notify business partner
  await notificationService.createNotification({
    userId: booking.business.userId,
    title: 'New Review Received!',
    message: `${req.user.firstName} left a ${rating}-star review for ${booking.business.name}.`,
    type: NotificationType.BUSINESS_REVIEW_SUBMITTED,
    referenceId: review.id,
  });

  res.status(201).json(ApiResponse.success('Review submitted successfully', review));
});

// Admin: Moderate/Hide Review
export const moderateReview = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { status } = req.body; // PUBLISHED or HIDDEN

  if (!['PUBLISHED', 'HIDDEN'].includes(status)) {
    throw new BadRequestError('Invalid review status');
  }

  const updated = await prisma.businessReview.update({
    where: { id },
    data: { status },
  });

  res.status(200).json(ApiResponse.success('Review status updated', updated));
});
