import api from './api';
import { User } from './auth.service';

export interface Experience {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author?: User;
  destinationId?: string;
  destination?: { id: string; name: string; slug: string };
  rating: number;
  images: string[];
  featuredImage?: string;
  createdAt: string;
}

export const experienceService = {
  getAll: async () => {
    const response = await api.get('/experiences');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/experiences/${id}`);
    return response.data;
  }
};
