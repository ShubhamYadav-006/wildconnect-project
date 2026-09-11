import { Router } from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import {
  checkRoomAvailability,
  createBusinessBooking,
  getMyBookings,
  getPartnerBookings,
  cancelBooking,
} from '../controllers/businessBooking.controller.js';

const router = Router();

// Public: Check room availability for dates
router.get('/availability', checkRoomAvailability);

// Authenticated Routes
router.use(protect);

// Tourist routes
router.post('/', createBusinessBooking);
router.get('/my', getMyBookings);
router.patch('/:id/cancel', cancelBooking);

// Partner routes
router.get('/partner', restrictTo('BUSINESS_PARTNER'), getPartnerBookings);

export default router;
