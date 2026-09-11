import { z } from 'zod';
import { TripStatus } from '../generated/prisma/index.js';

export const createTripRequestSchema = z.object({
  destinationId: z.string().uuid('Destination ID must be a valid UUID'),
  travelerCount: z.number().int().min(1, 'At least 1 traveler is required'),
  startDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Start date must be a valid date'),
  endDate: z.string().refine(val => !isNaN(Date.parse(val)), 'End date must be a valid date'),
  budget: z.string().max(100).optional(),
  preferences: z.string().max(1000).optional(),
  notes: z.string().max(1000).optional(),
}).refine(data => {
  const start = new Date(data.startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return start >= today;
}, {
  message: 'Start date must be today or in the future',
  path: ['startDate'],
}).refine(data => new Date(data.startDate) < new Date(data.endDate), {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export const updateTripStatusSchema = z.object({
  status: z.nativeEnum(TripStatus, { message: 'Invalid status' }),
});
