import { Router } from 'express';
import { submitInquiry } from '../controllers/businessInquiry.controller.js';
import { optionalProtect } from '../middleware/auth.middleware.js';
import { inquiryLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Public endpoint with rate limiting (optionalProtect to get user info if logged in)
router.post('/', inquiryLimiter, optionalProtect, submitInquiry);

export default router;
