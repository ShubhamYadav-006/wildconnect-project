import { Router } from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import {
  getBusinessReviews,
  createBusinessReview,
  moderateReview,
} from '../controllers/businessReview.controller.js';

const router = Router();

// Public: Get reviews of an approved business
router.get('/business/:businessId', getBusinessReviews);

// Tourist: Create review
router.post('/', protect, createBusinessReview);

// Admin: Moderate review
router.patch('/:id/moderate', protect, restrictTo('ADMIN'), moderateReview);

export default router;
