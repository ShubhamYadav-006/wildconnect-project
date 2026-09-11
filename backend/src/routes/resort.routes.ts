import { Router } from 'express';
import {
  getAllResorts,
  getResortById,
  createResort,
  updateResort,
  deleteResort,
} from '../controllers/resort.controller.js';
import { validate } from '../middleware/validate.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { createResortSchema, updateResortSchema } from '../validators/resort.validator.js';

const router = Router();

// Public routes
router.get('/', getAllResorts);
router.get('/:id', getResortById);

// Admin-only protected routes
router.use(protect);
router.use(restrictTo('ADMIN'));

router.post('/', validate(createResortSchema), createResort);
router.patch('/:id', validate(updateResortSchema), updateResort);
router.delete('/:id', deleteResort);

export default router;
