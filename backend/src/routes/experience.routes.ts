import { Router } from 'express';
import { protect, restrictTo, optionalProtect } from '../middleware/auth.middleware.js';
import { validate, validateQuery } from '../middleware/validate.js';
import { Role } from '../generated/prisma/index.js';
import {
  createExperience,
  updateExperience,
  publishExperience,
  archiveExperience,
  deleteExperience,
  getExperiences,
  getFeaturedExperiences,
  getExperienceById,
  featureExperience,
} from '../controllers/experience.controller.js';
import {
  createExperienceSchema,
  updateExperienceSchema,
  getExperiencesSchema,
} from '../validators/experience.validator.js';

const router = Router();

// Public Routes (with optional protect so admins can see drafts in the same route)
router.get('/', optionalProtect, validateQuery(getExperiencesSchema), getExperiences);
router.get('/featured', getFeaturedExperiences);
router.get('/:id', optionalProtect, getExperienceById);

// Admin Routes
router.use(protect, restrictTo(Role.ADMIN));

router.post('/', validate(createExperienceSchema), createExperience);
router.patch('/:id', validate(updateExperienceSchema), updateExperience);
router.delete('/:id', deleteExperience);

router.patch('/:id/publish', publishExperience);
router.patch('/:id/archive', archiveExperience);
router.patch('/:id/feature', featureExperience);

export default router;
