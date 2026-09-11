import { notificationRepository } from '../repositories/notification.repository.js';
import { NotFoundError, ForbiddenError } from '../utils/AppError.js';
import { NotificationType } from '../generated/prisma/index.js';

export class NotificationService {
  async createNotification(data: {
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    referenceId?: string;
  }) {
    return notificationRepository.create(data);
  }

  async create(data: {
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    referenceId?: string;
  }) {
    return this.createNotification(data);
  }

  async getUserNotifications(userId: string, options: { page?: number; limit?: number; unreadOnly?: boolean }) {
    return notificationRepository.findByUserId(userId, options);
  }

  async getUnreadCount(userId: string) {
    const count = await notificationRepository.countUnread(userId);
    return { count };
  }

  async markAsRead(id: string, userId: string) {
    const notification = await notificationRepository.findById(id);

    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new ForbiddenError('You do not have permission to access this notification');
    }

    return notificationRepository.markAsRead(id);
  }

  async markAllAsRead(userId: string) {
    await notificationRepository.markAllAsRead(userId);
    return { message: 'All notifications marked as read' };
  }

  async deleteNotification(id: string, userId: string) {
    const notification = await notificationRepository.findById(id);

    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new ForbiddenError('You do not have permission to access this notification');
    }

    await notificationRepository.delete(id);
    return { message: 'Notification deleted successfully' };
  }
}

export const notificationService = new NotificationService();
