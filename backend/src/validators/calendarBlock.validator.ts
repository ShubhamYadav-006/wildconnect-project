import { z } from 'zod';

export const createCalendarBlockSchema = z.object({
  businessId: z.string().uuid('Valid business ID is required'),
  roomId: z.string().uuid().optional().nullable().or(z.literal('')),
  vehicleId: z.string().uuid().optional().nullable().or(z.literal('')),
  equipmentId: z.string().uuid().optional().nullable().or(z.literal('')),
  startDate: z.string().datetime('Valid start date required'),
  endDate: z.string().datetime('Valid end date required'),
  slot: z.enum(['MORNING_SAFARI', 'AFTERNOON_SAFARI', 'FULL_DAY_TRANSFER']).optional().nullable().or(z.literal('')),
  unitsBlocked: z.number().int().min(1).default(1),
  reason: z.enum(['PROPERTY_MAINTENANCE', 'WALK_IN_OFFLINE_BOOKING', 'MONSOON_CLOSURE', 'PERSONAL_USE']).default('PROPERTY_MAINTENANCE'),
  notes: z.string().optional().nullable().or(z.literal('')),
});
