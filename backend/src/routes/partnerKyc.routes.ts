import { Router } from 'express';
import { partnerKycController } from '../controllers/partnerKyc.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import { submitKycSchema, reviewKycSchema } from '../validators/kyc.validator.js';

const router = Router();

// Partner Routes
router.get('/my', protect, restrictTo('BUSINESS_PARTNER'), partnerKycController.getMyKyc);
router.post('/submit', protect, restrictTo('BUSINESS_PARTNER'), validate(submitKycSchema), partnerKycController.submitMyKyc);

// Protected document viewing (Admin or Document Owner only)
router.get('/document/:filename', protect, partnerKycController.getDocument);

// Admin Routes
router.get('/admin/all', protect, restrictTo('ADMIN'), partnerKycController.getAllKyc);
router.patch('/admin/:id/review', protect, restrictTo('ADMIN'), validate(reviewKycSchema), partnerKycController.reviewKyc);

export default router;
