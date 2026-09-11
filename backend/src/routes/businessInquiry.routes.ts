import { Router } from 'express';
import { submitInquiry } from '../controllers/businessInquiry.controller.js';
import { optionalProtect } from '../middleware/auth.middleware.js';

const router = Router();

// Public endpoint (optionalProtect to get user info if logged in)
router.post('/', optionalProtect, submitInquiry);

export default router;
