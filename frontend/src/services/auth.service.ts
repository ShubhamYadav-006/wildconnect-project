import api from './api';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  phoneNumber?: string;
  role: 'TOURIST' | 'ADMIN' | 'BUSINESS_PARTNER';
  createdAt?: string;
  partnerKyc?: {
    id: string;
    status: string;
    createdAt: string;
  };
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
    isPendingPartnerApproval?: boolean;
  };
}

export const authService = {
  login: async (data: { email: string; password: string; role?: 'TOURIST' | 'BUSINESS_PARTNER' }) => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  googleLogin: async (credential: string, role?: 'TOURIST' | 'BUSINESS_PARTNER') => {
    const response = await api.post<AuthResponse>('/auth/google', { credential, role });
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  register: async (data: { firstName: string; lastName: string; email: string; password: string; role?: 'TOURIST' | 'BUSINESS_PARTNER'; phone?: string; phoneNumber?: string }) => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get<{ success: boolean; data: User }>('/auth/me');
    if (response.data.success && response.data.data) {
      localStorage.setItem('user', JSON.stringify(response.data.data));
      return response.data.data;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        return JSON.parse(userStr) as User;
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return null;
      }
    }
    // If either token or user is missing, ensure clean state
    if (!token || !userStr) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return null;
  },

  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  updateUserRole: async (userId: string, role: 'TOURIST' | 'BUSINESS_PARTNER' | 'ADMIN') => {
    const response = await api.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
  }
};
