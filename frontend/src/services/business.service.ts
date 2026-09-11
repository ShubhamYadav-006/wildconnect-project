import api from './api';

export interface Business {
  id: string;
  name: string;
  slug: string;
  type: string;
  description: string;
  coverImage?: string;
  images: string[];
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  starRating?: number;
  amenities?: string[];
  metadata?: any;
  destinationId?: string;
  destination?: {
    id: string;
    name: string;
    slug: string;
    state?: string;
    coverImage?: string;
  };
  rooms?: Array<{
    id: string;
    name: string;
    description?: string;
    capacity: number;
    basePrice: number;
    amenities: string[];
    images: string[];
  }>;
  status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  rejectionReason?: string;
  userId: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

class BusinessService {
  // Public
  async getPublicBusinesses(filters?: { 
    type?: string; 
    category?: string; 
    destinationId?: string; 
    destinationSlug?: string; 
  }) {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.destinationId) params.append('destinationId', filters.destinationId);
    if (filters?.destinationSlug) params.append('destinationSlug', filters.destinationSlug);
    
    const response = await api.get(`/businesses?${params.toString()}`);
    return response.data.data;
  }

  async getPublicBusinessBySlug(slug: string) {
    const response = await api.get(`/businesses/${slug}`);
    return response.data.data;
  }

  // Protected (User)
  async getMyBusinesses() {
    const response = await api.get('/businesses/user/my');
    return response.data.data;
  }

  async createBusiness(data: Partial<Business>) {
    const response = await api.post('/businesses', data);
    return response.data.data;
  }

  async updateBusiness(id: string, data: Partial<Business>) {
    const response = await api.put(`/businesses/${id}`, data);
    return response.data.data;
  }

  async submitForReview(id: string) {
    const response = await api.post(`/businesses/${id}/submit`);
    return response.data.data;
  }

  // Admin
  async getAdminBusinesses() {
    const response = await api.get('/businesses/admin/all');
    return response.data.data;
  }

  async getAdminBusinessById(id: string) {
    const response = await api.get(`/businesses/admin/${id}`);
    return response.data.data;
  }

  async updateBusinessStatus(id: string, status: 'APPROVED' | 'REJECTED' | 'SUSPENDED', rejectionReason?: string) {
    const response = await api.patch(`/businesses/${id}/status`, { status, rejectionReason });
    return response.data.data;
  }
}

export const businessService = new BusinessService();
