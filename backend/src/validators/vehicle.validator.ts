import { z } from 'zod';

export const createVehicleSchema = z.object({
  businessId: z.string().uuid('Valid business ID is required'),
  vehicleType: z.enum(['SAFARI_GYPSY_4X4', 'INNOVA_TRANSFER', 'CANTER_SAFARI']),
  modelName: z.string().min(2, 'Vehicle model name is required'),
  registrationNumber: z.string().min(3, 'Registration plate number is required'),
  driverName: z.string().optional().nullable().or(z.literal('')),
  driverPhone: z.string().optional().nullable().or(z.literal('')),
  maxPassengers: z.number().int().min(1).default(6),
  supportedSlots: z.array(z.enum(['MORNING_SAFARI', 'AFTERNOON_SAFARI', 'FULL_DAY_TRANSFER'])).min(1, 'At least one safari slot required'),
  basePricePerSlot: z.number().positive('Price per slot must be a positive number'),
  images: z.array(z.string()).default([]),
});

export const updateVehicleSchema = z.object({
  vehicleType: z.enum(['SAFARI_GYPSY_4X4', 'INNOVA_TRANSFER', 'CANTER_SAFARI']).optional(),
  modelName: z.string().min(2).optional(),
  registrationNumber: z.string().min(3).optional(),
  driverName: z.string().optional().nullable().or(z.literal('')),
  driverPhone: z.string().optional().nullable().or(z.literal('')),
  maxPassengers: z.number().int().min(1).optional(),
  supportedSlots: z.array(z.enum(['MORNING_SAFARI', 'AFTERNOON_SAFARI', 'FULL_DAY_TRANSFER'])).optional(),
  basePricePerSlot: z.number().positive().optional(),
  images: z.array(z.string()).optional(),
});
