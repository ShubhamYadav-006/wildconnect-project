import { Router } from 'express';
import { payoutController } from '../controllers/payout.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = Router();

// Partner Routes
router.get('/my', protect, restrictTo('BUSINESS_PARTNER'), payoutController.getMyFinances);

// Admin Routes
router.patch('/admin/:id/process', protect, restrictTo('ADMIN'), payoutController.processPayout);

export default router;
