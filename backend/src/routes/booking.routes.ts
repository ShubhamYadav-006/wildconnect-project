import { Router } from 'express';
import {
  getAllBookings,
  getMyBookings,
  getBookingById,
  cancelBooking,
  updateBookingStatus,
} from '../controllers/booking.controller.js';
import { validate } from '../middleware/validate.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { updateBookingStatusSchema } from '../validators/booking.validator.js';

const router = Router();

router.use(protect);

// Tourist routes
router.get('/my', restrictTo('TOURIST'), getMyBookings);
router.patch('/:id/cancel', restrictTo('TOURIST'), cancelBooking);

// Both Admin and Tourist can view by ID
router.get('/:id', getBookingById);

// Admin routes
router.get('/', restrictTo('ADMIN'), getAllBookings);
router.patch('/:id/status', restrictTo('ADMIN'), validate(updateBookingStatusSchema), updateBookingStatus);

export default router;
