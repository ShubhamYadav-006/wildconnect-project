import { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { NotFoundError, BadRequestError } from '../utils/AppError.js';
import { notificationService } from '../services/notification.service.js';
import { NotificationType } from '../generated/prisma/index.js';

// Public endpoint to submit an inquiry
export const submitInquiry = asyncHandler(async (req: Request, res: Response) => {
  const { businessId, customerName, customerEmail, customerPhone, message, dateRequested } = req.body;
  const userId = req.user?.id; // Optional

  if (!businessId || !customerName || !customerEmail || !message) {
    throw new BadRequestError('Missing required fields: businessId, customerName, customerEmail, message');
  }

  // Ensure business exists and is APPROVED
  const business = await prisma.business.findUnique({
    where: { id: businessId }
  });

  if (!business || business.status !== 'APPROVED' || business.deletedAt !== null) {
    throw new NotFoundError('Business not found or not available for inquiries');
  }

  const slaDeadlineAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24-hour response clock

  const inquiry = await prisma.businessInquiry.create({
    data: {
      businessId,
      userId,
      customerName,
      customerEmail,
      customerPhone,
      message,
      dateRequested: dateRequested ? new Date(dateRequested) : null,
      status: 'PENDING',
      slaDeadlineAt,
    }
  });

  // Notify the business partner
  await notificationService.createNotification({
    userId: business.userId,
    title: 'New Business Inquiry (24h SLA)',
    message: `You have received a new inquiry from ${customerName} for ${business.name}. Please respond within 24 hours.`,
    type: NotificationType.BUSINESS_INQUIRY_RECEIVED,
    referenceId: inquiry.id
  });

  res.status(201).json(ApiResponse.success('Inquiry submitted successfully', inquiry));
});

// Partner endpoint to list inquiries for their businesses
export const getMyBusinessInquiries = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const status = req.query.status as string | undefined;
  const businessId = req.query.businessId as string | undefined;

  const whereClause: any = {
    business: { userId }
  };

  if (status) {
    whereClause.status = status;
  }
  if (businessId) {
    whereClause.businessId = businessId;
  }

  const inquiries = await prisma.businessInquiry.findMany({
    where: whereClause,
    include: {
      business: {
        select: { id: true, name: true, type: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.status(200).json(ApiResponse.success('Inquiries fetched successfully', inquiries));
});

// Partner endpoint to get inquiry details
export const getInquiryDetails = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user?.id;

  const inquiry = await prisma.businessInquiry.findFirst({
    where: {
      id,
      business: { userId }
    },
    include: {
      business: {
        select: { id: true, name: true, type: true, coverImage: true }
      }
    }
  });

  if (!inquiry) {
    throw new NotFoundError('Inquiry not found');
  }

  res.status(200).json(ApiResponse.success('Inquiry details fetched', inquiry));
});

// Partner endpoint to update inquiry status
export const updateInquiryStatus = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { status } = req.body;
  const userId = req.user?.id;

  if (!['PENDING', 'RESPONDED', 'CLOSED', 'ESCALATED', 'EXPIRED'].includes(status)) {
    throw new BadRequestError('Invalid status');
  }

  const existing = await prisma.businessInquiry.findFirst({
    where: {
      id,
      business: { userId }
    }
  });

  if (!existing) {
    throw new NotFoundError('Inquiry not found');
  }

  const inquiry = await prisma.businessInquiry.update({
    where: { id },
    data: { status }
  });

  res.status(200).json(ApiResponse.success('Inquiry status updated', inquiry));
});

// Admin: Get all escalated inquiries
export const getEscalatedInquiries = asyncHandler(async (req: Request, res: Response) => {
  const inquiries = await prisma.businessInquiry.findMany({
    where: {
      status: 'ESCALATED',
    },
    include: {
      business: {
        select: { id: true, name: true, contactPhone: true, contactEmail: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.status(200).json(ApiResponse.success('Escalated inquiries fetched', inquiries));
});
