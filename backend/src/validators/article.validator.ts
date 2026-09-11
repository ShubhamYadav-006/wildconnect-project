import { z } from 'zod';
import { ArticleStatus } from '../generated/prisma/index.js';

export const createArticleSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters long'),
  content: z.string()
    .min(10, 'Content must be at least 10 characters long'),
  featuredImage: z.string().optional().or(z.literal('')),
  tags: z.array(z.string()).optional(),
  destinationId: z.string().uuid('Invalid destination ID').optional().nullable(),
});

export const updateArticleSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long').optional(),
  content: z.string().min(10, 'Content must be at least 10 characters long').optional(),
  featuredImage: z.string().optional().or(z.literal('')),
  tags: z.array(z.string()).optional(),
  destinationId: z.string().uuid('Invalid destination ID').optional().nullable(),
});

export const getArticlesSchema = z.object({
  page: z.string().optional().transform(val => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform(val => (val ? parseInt(val, 10) : 10)),
  status: z.nativeEnum(ArticleStatus).optional(),
  search: z.string().optional(),
  tag: z.string().optional(),
});
