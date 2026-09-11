import { z } from 'zod';

export const createResortSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(150),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  address: z.string().min(5, 'Address is required'),
  destinationId: z.string().uuid('Destination ID must be a valid UUID'),
  starRating: z.number().int().min(1).max(5).optional(),
  amenities: z.array(z.string()).optional(),
  coverImage: z.string().optional().or(z.literal('')),
  images: z.array(z.string()).optional(),
});

export const updateResortSchema = z.object({
  name: z.string().min(2).max(150).optional(),
  description: z.string().min(10).optional(),
  address: z.string().min(5).optional(),
  starRating: z.number().int().min(1).max(5).optional(),
  amenities: z.array(z.string()).optional(),
  coverImage: z.string().optional().or(z.literal('')),
  images: z.array(z.string()).optional(),
});
