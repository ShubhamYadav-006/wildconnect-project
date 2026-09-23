import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import { uploadImages } from '../controllers/upload.controller.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Only authenticated users can upload images (rate limited)
router.post('/', protect, uploadLimiter, upload.array('images', 10), uploadImages);

export default router;