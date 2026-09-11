import { Router } from 'express';
import type { Request, Response } from 'express';

import authRoutes from './auth.routes.js';
import destinationRoutes from './destination.routes.js';
import resortRoutes from './resort.routes.js';
import tripRequestRoutes from './triprequest.routes.js';
import adminRoutes from './admin.routes.js';
import proposalRoutes from './proposal.routes.js';
import myRoutes from './my.routes.js';
import bookingRoutes from './booking.routes.js';
import articleRoutes from './article.routes.js';
import experienceRoutes from './experience.routes.js';
import notificationRoutes from './notification.routes.js';
import businessRoutes from './business.routes.js';
import uploadRoutes from './upload.routes.js';
import businessInquiryRoutes from './businessInquiry.routes.js';
import partnerInquiryRoutes from './partnerInquiry.routes.js';
import roomRoutes from './room.routes.js';
import businessBookingRoutes from './businessBooking.routes.js';
import businessReviewRoutes from './businessReview.routes.js';
const router = Router();

// Health check endpoint
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
router.use('/auth', authRoutes);
router.use('/my', myRoutes);
router.use('/admin', adminRoutes);
router.use('/destinations', destinationRoutes);
router.use('/resorts', resortRoutes);
router.use('/experiences', experienceRoutes);
router.use('/articles', articleRoutes);
router.use('/proposals', proposalRoutes);
router.use('/triprequests', tripRequestRoutes);
router.use('/trip-requests', tripRequestRoutes);
router.use('/bookings', bookingRoutes);
router.use('/notifications', notificationRoutes);
router.use('/businesses', businessRoutes);
router.use('/upload', uploadRoutes);
router.use('/inquiries', businessInquiryRoutes);
router.use('/partner/inquiries', partnerInquiryRoutes);
router.use('/rooms', roomRoutes);
router.use('/business-bookings', businessBookingRoutes);
router.use('/business-reviews', businessReviewRoutes);

export default router;
