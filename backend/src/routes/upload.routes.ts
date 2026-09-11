import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import { uploadImages } from '../controllers/upload.controller.js';

const router = Router();

// Only authenticated users can upload images
router.post('/', protect, upload.array('images', 10), uploadImages);

export default router;