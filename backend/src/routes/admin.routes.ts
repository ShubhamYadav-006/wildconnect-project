import { Router } from 'express';
import { getAllTripRequests, updateTripRequestStatus } from '../controllers/triprequest.controller.js';
import { getAllUsers, updateUserRole } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { updateTripStatusSchema } from '../validators/triprequest.validator.js';
import { updateUserRoleSchema } from '../validators/auth.validator.js';

const router = Router();

// Admin routes require authentication and ADMIN role
router.use(protect);
router.use(restrictTo('ADMIN'));

import { businessController } from '../controllers/business.controller.js';
import { createBusinessSchema, updateBusinessStatusSchema } from '../validators/business.validator.js';

router.get('/trip-requests', getAllTripRequests);
router.patch('/trip-requests/:id/status', validate(updateTripStatusSchema), updateTripRequestStatus);
router.get('/users', getAllUsers);
router.patch('/users/:id/role', validate(updateUserRoleSchema), updateUserRole);

// Business Partner Admin Routes
router.get('/businesses', businessController.getAdminBusinesses);
router.post('/businesses', validate(createBusinessSchema), businessController.createBusiness);
router.patch('/businesses/:id/status', validate(updateBusinessStatusSchema), businessController.updateBusinessStatus);
router.delete('/businesses/:id', businessController.deleteBusiness);

export default router;
