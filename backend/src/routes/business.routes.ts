import { Router } from 'express';
import { businessController } from '../controllers/business.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import { createBusinessSchema, updateBusinessSchema, updateBusinessStatusSchema } from '../validators/business.validator.js';

const router = Router();

// Business Partner and Admin Routes
router.get('/user/my', protect, restrictTo('BUSINESS_PARTNER'), businessController.getMyBusinesses);
router.get('/my/all', protect, restrictTo('BUSINESS_PARTNER'), businessController.getMyBusinesses);
router.get('/my', protect, restrictTo('BUSINESS_PARTNER'), businessController.getMyBusinesses);
router.get('/user/my/:id', protect, restrictTo('BUSINESS_PARTNER'), businessController.getMyBusinessById);
router.post('/', protect, restrictTo('BUSINESS_PARTNER', 'ADMIN'), validate(createBusinessSchema), businessController.createBusiness);
router.put('/:id', protect, restrictTo('BUSINESS_PARTNER', 'ADMIN'), validate(updateBusinessSchema), businessController.updateBusiness);
router.post('/:id/submit', protect, restrictTo('BUSINESS_PARTNER'), businessController.submitForReview);

// Admin Only Routes
router.get('/admin/all', protect, restrictTo('ADMIN'), businessController.getAdminBusinesses);
router.get('/admin/:id', protect, restrictTo('ADMIN'), businessController.getAdminBusinessById);
router.patch('/:id/status', protect, restrictTo('ADMIN'), validate(updateBusinessStatusSchema), businessController.updateBusinessStatus);
router.post('/admin/:id/approve-updates', protect, restrictTo('ADMIN'), businessController.approvePendingUpdates);
router.post('/admin/:id/reject-updates', protect, restrictTo('ADMIN'), businessController.rejectPendingUpdates);
router.delete('/:id', protect, restrictTo('ADMIN'), businessController.deleteBusiness);

// Public Routes
router.get('/', businessController.getPublicBusinesses);
router.get('/:slug', businessController.getPublicBusinessBySlug);

export default router;
