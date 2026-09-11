import { z } from 'zod';
import { ExperienceStatus } from '../generated/prisma/index.js';

export const createExperienceSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  featuredImage: z.string().optional().or(z.literal('')),
  isFeatured: z.boolean().optional(),
});

export const updateExperienceSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long').optional(),
  description: z.string().min(10, 'Description must be at least 10 characters long').optional(),
  featuredImage: z.string().optional().or(z.literal('')),
  isFeatured: z.boolean().optional(),
});

export const getExperiencesSchema = z.object({
  page: z.string().optional().transform(val => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform(val => (val ? parseInt(val, 10) : 10)),
  status: z.nativeEnum(ExperienceStatus).optional(),
  search: z.string().optional(),
});
