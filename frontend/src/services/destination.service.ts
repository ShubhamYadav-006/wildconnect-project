import api from './api';

export interface Destination {
  id: string;
  name: string;
  slug: string;
  state: string;
  country?: string;
  description: string;
  images?: string[];
  coverImage?: string;
  establishedYear?: number;
  totalArea?: number;
  coreArea?: number;
  coreGates?: number;
  bufferArea?: number;
  bufferGates?: number;
}

export const destinationService = {
  getAll: async () => {
    const response = await api.get('/destinations');
    return response.data;
  },
  
  getBySlug: async (slug: string) => {
    const response = await api.get(`/destinations/${slug}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/destinations', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.patch(`/destinations/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/destinations/${id}`);
    return response.data;
  }
};

