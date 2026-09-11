import { z } from 'zod';
import { NotificationType } from '../generated/prisma/index.js';

export const createNotificationSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  message: z.string().min(5, 'Message must be at least 5 characters long'),
  type: z.nativeEnum(NotificationType).default(NotificationType.SYSTEM_ANNOUNCEMENT),
  referenceId: z.string().optional(),
});
