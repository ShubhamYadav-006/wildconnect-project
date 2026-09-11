import { z } from 'zod';

export const createProposalSchema = z.object({
  tripRequestId: z.string().uuid('Trip Request ID must be a valid UUID'),
  content: z.string().min(1, 'Proposal content is required'),
});

export const updateProposalSchema = z.object({
  content: z.string().min(1, 'Proposal content is required').optional(),
});

export const changeRequestSchema = z.object({
  changeRequest: z.string().min(10, 'Change request must be at least 10 characters long').max(1000, 'Change request cannot exceed 1000 characters'),
});

