import api from './api';

export interface BusinessQuickStat {
  label: string;
  value: string;
}

export interface BusinessMetadata {
  experienceType?: string;
  quickStats?: BusinessQuickStat[];
  highlights?: string[];
  badgeLabel?: string;
  badgeIcon?: string;
  fallbackDescription?: string;
  farmType?: string;
  nearestGate?: string;
  nearbyGates?: Array<{ name: string; distance: string }>;
  services?: string[];
  roomFeatures?: string[];
  foodAndDining?: string;
  wildlifeAndNature?: string;
  bestSuitedFor?: string[];
  policies?: {
    checkIn?: string;
    checkOut?: string;
    pets?: string;
    cancellation?: string;
  };
  gettingThere?: {
    railwayStation?: string;
    airport?: string;
  };
  social?: {
    phoneSecondary?: string;
    whatsapp?: string;
    website?: string;
    instagram?: string;
  };
  pricing?: {
    pricePerNight?: number;
  };
  pricingNote?: string;
  [key: string]: any;
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  type: string;
  category?: string;
  description: string;
  coverImage?: string;
  images: string[];
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  starRating?: number;
  amenities?: string[];
  experienceType?: string;
  shortDescription?: string;
  quickStats?: BusinessQuickStat[];
  highlights?: string[];
  experiences?: string[];
  hasRooms?: boolean;
  nearestGate?: string;
  distanceFromGate?: string;
  verified?: boolean;
  badgeLabel?: string;
  badgeIcon?: string;
  fallbackDescription?: string;
  metadata?: BusinessMetadata;
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
  deletedAt?: string | null;
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
    destination?: string;
    destinationId?: string; 
    destinationSlug?: string; 
  }) {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.destination) params.append('destination', filters.destination);
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

  async getMyBusinessById(id: string) {
    const response = await api.get(`/businesses/user/my/${id}`);
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

  async deleteBusiness(id: string) {
    const response = await api.delete(`/businesses/${id}`);
    return response.data.data;
  }
}

export const businessService = new BusinessService();
