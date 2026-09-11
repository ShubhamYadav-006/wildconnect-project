import { Router } from 'express';
import {
  getAllDestinations,
  getDestinationBySlug,
  createDestination,
  updateDestination,
  deleteDestination,
} from '../controllers/destination.controller.js';
import { getResortsByDestinationId } from '../controllers/resort.controller.js';
import { validate } from '../middleware/validate.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { createDestinationSchema, updateDestinationSchema } from '../validators/destination.validator.js';

const router = Router();

// Public routes
router.get('/', getAllDestinations);
router.get('/:slug', getDestinationBySlug);
router.get('/:destinationId/resorts', getResortsByDestinationId);

// Admin-only protected routes
router.use(protect);
router.use(restrictTo('ADMIN'));

router.post('/', validate(createDestinationSchema), createDestination);
router.patch('/:id', validate(updateDestinationSchema), updateDestination);
router.delete('/:id', deleteDestination);

export default router;
