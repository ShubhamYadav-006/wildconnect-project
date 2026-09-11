import { z } from 'zod';
import { BusinessType, ApprovalStatus } from '../generated/prisma/index.js';

export const createBusinessSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  type: z.nativeEnum(BusinessType),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  coverImage: z.string().optional().or(z.literal('')),
  images: z.array(z.string()).optional(),
  contactEmail: z.string().email('Must be a valid email').optional().or(z.literal('')),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  starRating: z.number().int().min(1).max(5).optional(),
  amenities: z.array(z.string()).optional(),
  metadata: z.any().optional(),
  destinationId: z.string().uuid('Invalid destination ID').optional().nullable().or(z.literal('')),
});

export const updateBusinessSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  type: z.nativeEnum(BusinessType).optional(),
  description: z.string().min(10, 'Description must be at least 10 characters').optional(),
  coverImage: z.string().optional().or(z.literal('')),
  images: z.array(z.string()).optional(),
  contactEmail: z.string().email('Must be a valid email').optional().or(z.literal('')),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  starRating: z.number().int().min(1).max(5).optional(),
  amenities: z.array(z.string()).optional(),
  metadata: z.any().optional(),
  destinationId: z.string().uuid('Invalid destination ID').optional().nullable().or(z.literal('')),
});

export const updateBusinessStatusSchema = z.object({
  status: z.nativeEnum(ApprovalStatus),
  rejectionReason: z.string().optional(),
});
