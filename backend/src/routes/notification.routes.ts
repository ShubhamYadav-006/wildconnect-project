import { Router } from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import { Role } from '../generated/prisma/index.js';
import {
  createNotification,
  getMyNotifications,
  getUnreadNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../controllers/notification.controller.js';
import { createNotificationSchema } from '../validators/notification.validator.js';

const router = Router();

// All notification routes require authentication
router.use(protect);

// Authenticated User Routes
router.get('/', getMyNotifications);
router.get('/unread', getUnreadNotifications);
router.get('/count', getUnreadCount);
router.patch('/read-all', markAllAsRead); // Place before /:id/read to avoid route conflict
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

// Admin Routes
router.post('/', restrictTo(Role.ADMIN), validate(createNotificationSchema), createNotification);

export default router;
