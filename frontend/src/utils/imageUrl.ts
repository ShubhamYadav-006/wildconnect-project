import nilawar1 from '../assets/NilawarFarmsImages/NilawarFarms1 (1).png';
import nilawar2 from '../assets/NilawarFarmsImages/NilawarFarms1 (2).png';
import nilawar3 from '../assets/NilawarFarmsImages/NilawarFarms1 (3).png';
import nilawar4 from '../assets/NilawarFarmsImages/NilawarFarms1 (4).png';
import nilawar5 from '../assets/NilawarFarmsImages/NilawarFarms1 (5).png';
import nilawar6 from '../assets/NilawarFarmsImages/NilawarFarms1 (6).png';

export const DEFAULT_RESORT_IMAGE = nilawar1 ||
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';

export const DEFAULT_DESTINATION_IMAGE =
  'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?auto=format&fit=crop&w=800&q=80';

const NILAWAR_ASSET_MAP: Record<string, string> = {
  'nilawar-farms-1.png': nilawar1,
  'nilawar-farms-2.png': nilawar2,
  'nilawar-farms-3.png': nilawar3,
  'nilawar-farms-4.png': nilawar4,
  'nilawar-farms-5.png': nilawar5,
  'nilawar-farms-6.png': nilawar6,
  'nilawar-farms-1': nilawar1,
  'nilawar-farms-2': nilawar2,
  'nilawar-farms-3': nilawar3,
  'nilawar-farms-4': nilawar4,
  'nilawar-farms-5': nilawar5,
  'nilawar-farms-6': nilawar6,
};

/**
 * Normalizes image URLs:
 * If an image has a relative path or refers to local assets,
 * it returns the direct bundled asset or formatted URL.
 */
export const getImageUrl = (url?: string | null, fallback = DEFAULT_RESORT_IMAGE): string => {
  if (!url || typeof url !== 'string') return fallback;

  // Check direct local asset mappings (Nilawar Farms, etc.)
  for (const [key, asset] of Object.entries(NILAWAR_ASSET_MAP)) {
    if (url.includes(key)) {
      return asset;
    }
  }

  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }

  const cleanPath = url.startsWith('/') ? url : `/${url}`;

  // In local Vite dev environment, /uploads is served directly from frontend/public/uploads
  if (cleanPath.startsWith('/uploads')) {
    return cleanPath;
  }

  return cleanPath;
};

/**
 * Fallback image error event handler to prevent broken image UI
 */
export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallback = DEFAULT_RESORT_IMAGE
) => {
  const target = e.currentTarget;
  const isNilawar = (target.alt || '').toLowerCase().includes('nilawar') || (target.src || '').includes('nilawar');
  const safeFallback = isNilawar ? nilawar1 : fallback;

  if (target.src !== safeFallback) {
    target.src = safeFallback;
  }
};


