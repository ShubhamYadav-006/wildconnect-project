import api from './api';
import { User } from './auth.service';

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  authorId: string;
  author?: User;
  tags: string[];
  image: string;
  featuredImage?: string;
  createdAt: string;
}

export const articleService = {
  getAll: async () => {
    const response = await api.get('/articles');
    return response.data;
  },
  
  getBySlug: async (slug: string) => {
    const response = await api.get(`/articles/${slug}`);
    return response.data;
  }
};
