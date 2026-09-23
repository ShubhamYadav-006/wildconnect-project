/**
 * Normalizes image URLs:
 * If an image has a relative path starting with `/uploads/`,
 * it prefixes it with the backend base URL.
 */
export const getImageUrl = (url?: string | null): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  if (url.startsWith('/uploads')) {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const backendOrigin = apiUrl.replace(/\/api(\/v1)?\/?$/, '');
    return `${backendOrigin}${url}`;
  }
  return url;
};
