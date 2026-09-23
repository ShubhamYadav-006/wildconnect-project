import api from './api';
import { User } from './auth.service';

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  authorId: string;
  author?: User;
  tags: string[];
  image?: string;
  featuredImage?: string;
  destinationId?: string | null;
  destination?: { id: string; name: string; slug: string } | null;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: string;
  updatedAt?: string;
}

export interface CreateArticleData {
  title: string;
  content: string;
  featuredImage?: string;
  tags?: string[];
  destinationId?: string | null;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export interface UpdateArticleData {
  title?: string;
  content?: string;
  featuredImage?: string;
  tags?: string[];
  destinationId?: string | null;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export const articleService = {
  getAll: async (params?: { page?: number; limit?: number; status?: string; search?: string; tag?: string }) => {
    const response = await api.get('/articles', { params });
    return response.data;
  },
  
  getBySlug: async (slug: string) => {
    const response = await api.get(`/articles/${slug}`);
    return response.data;
  },

  create: async (data: CreateArticleData) => {
    const response = await api.post('/articles', data);
    return response.data;
  },

  update: async (id: string, data: UpdateArticleData) => {
    const response = await api.patch(`/articles/${id}`, data);
    return response.data;
  },

  publish: async (id: string) => {
    const response = await api.patch(`/articles/${id}/publish`);
    return response.data;
  },

  archive: async (id: string) => {
    const response = await api.patch(`/articles/${id}/archive`);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/articles/${id}`);
    return response.data;
  }
};

