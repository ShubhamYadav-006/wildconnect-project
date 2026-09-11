import { Router } from 'express';
import { protect, restrictTo, optionalProtect } from '../middleware/auth.middleware.js';
import { validate, validateQuery } from '../middleware/validate.js';
import { Role } from '../generated/prisma/index.js';
import {
  createArticle,
  updateArticle,
  publishArticle,
  archiveArticle,
  deleteArticle,
  getArticles,
  getArticleBySlug,
} from '../controllers/article.controller.js';
import {
  createArticleSchema,
  updateArticleSchema,
  getArticlesSchema,
} from '../validators/article.validator.js';

const router = Router();

// Public Routes (with optional protect so admins can see drafts in the same route if requested)
router.get('/', optionalProtect, validateQuery(getArticlesSchema), getArticles);
router.get('/:slug', optionalProtect, getArticleBySlug);

// Admin Routes
router.use(protect, restrictTo(Role.ADMIN));

router.post('/', validate(createArticleSchema), createArticle);
router.patch('/:id', validate(updateArticleSchema), updateArticle);
router.delete('/:id', deleteArticle);

router.patch('/:id/publish', publishArticle);
router.patch('/:id/archive', archiveArticle);

export default router;
