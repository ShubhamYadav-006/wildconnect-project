import api from './api';

export const uploadService = {
  async uploadImages(files: File[]) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Handle standard backend ApiResponse { success: true, data: string[] }
      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data as string[];
      }
      if (Array.isArray(response.data)) {
        return response.data as string[];
      }
      return [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to upload images');
    }
  }
};
