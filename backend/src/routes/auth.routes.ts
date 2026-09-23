import { Router } from 'express';
import {
  register,
  login,
  googleLogin,
  getProfile,
  updateProfile,
  changePassword,
} from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/auth.middleware.js';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
} from '../validators/auth.validator.js';

import { authLimiter, registerLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Public routes with rate limiting
router.post('/register', registerLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/google', authLimiter, googleLogin);

// Protected routes (require valid JWT)
router.use(protect);

router.get('/me', getProfile);
router.patch('/profile', validate(updateProfileSchema), updateProfile);
router.patch('/change-password', validate(changePasswordSchema), changePassword);

export default router;
