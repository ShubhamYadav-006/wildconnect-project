import { Router } from 'express';
import {
  createTripRequest,
  getMyTripRequests,
  getTripRequestById,
  cancelTripRequest,
} from '../controllers/triprequest.controller.js';
import { validate } from '../middleware/validate.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { createTripRequestSchema } from '../validators/triprequest.validator.js';

const router = Router();

// All trip request routes require authentication
router.use(protect);

// --- Tourist Routes ---
router.post('/', restrictTo('TOURIST'), validate(createTripRequestSchema), createTripRequest);
router.get('/my', restrictTo('TOURIST'), getMyTripRequests);
router.patch('/:id/cancel', restrictTo('TOURIST'), cancelTripRequest);

// Accessible by both TOURIST and ADMIN
router.get('/:id', restrictTo('TOURIST', 'ADMIN'), getTripRequestById);

export default router;
