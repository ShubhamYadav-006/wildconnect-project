import { Router } from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { getMyBusinessInquiries, getInquiryDetails, updateInquiryStatus } from '../controllers/businessInquiry.controller.js';

const router = Router();

// Partner inquiries - strictly for BUSINESS_PARTNER
router.use(protect, restrictTo('BUSINESS_PARTNER'));

router.get('/', getMyBusinessInquiries);
router.get('/:id', getInquiryDetails);
router.patch('/:id/status', updateInquiryStatus);

export default router;
