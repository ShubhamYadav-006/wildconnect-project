import { z } from 'zod';
import { BookingStatus } from '../generated/prisma/index.js';

export const updateBookingStatusSchema = z.object({
  status: z.nativeEnum(BookingStatus, { message: 'Invalid status' }),
});
