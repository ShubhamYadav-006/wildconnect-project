import { z } from 'zod';

export const createEquipmentSchema = z.object({
  body: z.object({
    businessId: z.string().uuid('Valid business ID is required'),
    equipmentType: z.enum(['CAMERA_BODY', 'TELEPHOTO_LENS', 'ACCESSORY_KIT']),
    brandAndModel: z.string().min(2, 'Brand and model name is required'),
    serialNumber: z.string().optional().nullable(),
    dailyRate: z.number().positive('Daily rental rate must be positive'),
    securityDeposit: z.number().nonnegative().default(0),
    condition: z.string().default('EXCELLENT'),
    kitIncludes: z.array(z.string()).default([]),
    images: z.array(z.string()).default([]),
  }),
});

export const updateEquipmentSchema = z.object({
  body: z.object({
    equipmentType: z.enum(['CAMERA_BODY', 'TELEPHOTO_LENS', 'ACCESSORY_KIT']).optional(),
    brandAndModel: z.string().min(2).optional(),
    serialNumber: z.string().optional().nullable(),
    dailyRate: z.number().positive().optional(),
    securityDeposit: z.number().nonnegative().optional(),
    condition: z.string().optional(),
    kitIncludes: z.array(z.string()).optional(),
    images: z.array(z.string()).optional(),
  }),
});
