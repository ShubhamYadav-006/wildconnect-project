import api from './api';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'PROPOSAL_CREATED' | 'PROPOSAL_ACCEPTED' | 'PROPOSAL_REJECTED' | 'BOOKING_CONFIRMED' | 'BOOKING_COMPLETED' | 'SYSTEM_ANNOUNCEMENT';
  isRead: boolean;
  referenceId?: string;
  createdAt: string;
}

export const notificationService = {
  getMyNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  getUnreadNotifications: async () => {
    const response = await api.get('/notifications/unread');
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get('/notifications/count');
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  },

  markAsRead: async (id: string) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },

  // Admin Method
  create: async (data: any) => {
    const response = await api.post('/notifications', data);
    return response.data;
  }
};

export default notificationService;
