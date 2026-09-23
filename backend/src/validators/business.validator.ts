import { z } from 'zod';
import { BusinessType, ApprovalStatus } from '../generated/prisma/index.js';

export const createBusinessSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  type: z.nativeEnum(BusinessType),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  coverImage: z.string().optional().nullable().or(z.literal('')),
  images: z.array(z.string()).optional().nullable(),
  contactEmail: z.string().email('Must be a valid email').optional().nullable().or(z.literal('')),
  contactPhone: z.string().optional().nullable().or(z.literal('')),
  address: z.string().optional().nullable().or(z.literal('')),
  starRating: z.number().int().min(1).max(5).optional().nullable(),
  amenities: z.array(z.string()).optional().nullable(),
  metadata: z.any().optional().nullable(),
  destinationId: z.string().uuid('Invalid destination ID').optional().nullable().or(z.literal('')),
  userId: z.string().uuid('Invalid User ID').optional().nullable().or(z.literal('')),
  status: z.nativeEnum(ApprovalStatus).optional().nullable(),
});

export const updateBusinessSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  type: z.nativeEnum(BusinessType).optional(),
  description: z.string().min(10, 'Description must be at least 10 characters').optional(),
  coverImage: z.string().optional().nullable().or(z.literal('')),
  images: z.array(z.string()).optional().nullable(),
  contactEmail: z.string().email('Must be a valid email').optional().nullable().or(z.literal('')),
  contactPhone: z.string().optional().nullable().or(z.literal('')),
  address: z.string().optional().nullable().or(z.literal('')),
  starRating: z.number().int().min(1).max(5).optional().nullable(),
  amenities: z.array(z.string()).optional().nullable(),
  metadata: z.any().optional().nullable(),
  destinationId: z.string().uuid('Invalid destination ID').optional().nullable().or(z.literal('')),
  userId: z.string().uuid('Invalid User ID').optional().nullable().or(z.literal('')),
  status: z.nativeEnum(ApprovalStatus).optional().nullable(),
});

export const updateBusinessStatusSchema = z.object({
  status: z.nativeEnum(ApprovalStatus),
  rejectionReason: z.string().optional().nullable().or(z.literal('')),
});
