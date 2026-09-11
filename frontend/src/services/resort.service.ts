import api from './api';
import { Destination } from './destination.service';

export interface Resort {
  id: string;
  name: string;
  slug: string;
  destinationId: string;
  destination?: Destination;
  pricePerNight: number;
  starRating: number;
  amenities: string[];
  description: string;
  images: string[];
  coverImage?: string;
  address?: string;
}

export const resortService = {
  getAll: async () => {
    const response = await api.get('/resorts');
    return response.data;
  },
  
  getBySlug: async (slug: string) => {
    const response = await api.get(`/resorts/${slug}`);
    return response.data;
  },
  
  getByDestination: async (destinationId: string) => {
    const response = await api.get(`/destinations/${destinationId}/resorts`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/resorts', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.patch(`/resorts/${id}`, data);
    return response.data;
  },

  updateBy: async (id: string, data: any) => {
    const response = await api.patch(`/resorts/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/resorts/${id}`);
    return response.data;
  },

  softDelete: async (id: string) => {
    const response = await api.delete(`/resorts/${id}`);
    return response.data;
  }
};
