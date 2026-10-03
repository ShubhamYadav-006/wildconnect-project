import nilawar1 from '../assets/NilawarFarmsImages/Nilawarfarms (1).png';
import nilawar2 from '../assets/NilawarFarmsImages/Nilawarfarms (2).png';
import nilawar3 from '../assets/NilawarFarmsImages/Nilawarfarms (3).png';
import nilawar4 from '../assets/NilawarFarmsImages/Nilawarfarms (4).png';
import nilawar5 from '../assets/NilawarFarmsImages/Nilawarfarms (5).png';
import nilawar6 from '../assets/NilawarFarmsImages/Nilawarfarms (6).png';

export const DEFAULT_RESORT_IMAGE =
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';

export const DEFAULT_DESTINATION_IMAGE =
  'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?auto=format&fit=crop&w=1200&q=80';

const NILAWAR_ASSET_MAP: Record<string, string> = {
  'nilawar-farms-1.png': nilawar1,
  'nilawar-farms-2.png': nilawar2,
  'nilawar-farms-3.png': nilawar3,
  'nilawar-farms-4.png': nilawar4,
  'nilawar-farms-5.png': nilawar5,
  'nilawar-farms-6.png': nilawar6,
};

/**
 * Normalizes and converts external image URLs (Google Photos, Google Drive, Dropbox, etc.)
 * into direct, high-resolution embeddable image CDN streams.
 */
export const normalizeImageUrl = (url?: string | null): string => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();

  // 1. Google Drive Share Links:
  // Convert https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  // or https://drive.google.com/open?id=FILE_ID
  // to Google CDN direct stream: https://lh3.googleusercontent.com/d/FILE_ID
  const gDriveMatch1 = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (gDriveMatch1 && gDriveMatch1[1]) {
    return `https://lh3.googleusercontent.com/d/${gDriveMatch1[1]}`;
  }

  const gDriveMatch2 = trimmed.match(/drive\.google\.com\/(?:open|uc)\?(?:[a-zA-Z0-9_=&-]*&)?id=([a-zA-Z0-9_-]+)/);
  if (gDriveMatch2 && gDriveMatch2[1]) {
    return `https://lh3.googleusercontent.com/d/${gDriveMatch2[1]}`;
  }

  // 2. Google Photos Direct / Google User Content (lh3.googleusercontent.com, photos.fife.usercontent.google.com, etc.)
  // Upgrade small dimension params like =w200-h200 or =s200 to crisp high-res =w1600-h1200
  if (trimmed.includes('googleusercontent.com')) {
    if (/=w\d+(-h\d+)?(-[a-z]+)?$/i.test(trimmed)) {
      return trimmed.replace(/=w\d+(-h\d+)?(-[a-z]+)?$/i, '=w1600-h1200');
    }
    if (/=s\d+(-[a-z]+)?$/i.test(trimmed)) {
      return trimmed.replace(/=s\d+(-[a-z]+)?$/i, '=s1600');
    }
    return trimmed;
  }

  // 3. Dropbox Direct Links
  // Convert https://www.dropbox.com/s/XYZ/image.jpg?dl=0 to https://dl.dropboxusercontent.com/s/XYZ/image.jpg
  if (trimmed.includes('dropbox.com')) {
    let directDropbox = trimmed.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
    directDropbox = directDropbox.replace(/[?&]dl=[01]/, '');
    return directDropbox;
  }

  return trimmed;
};

/**
 * Normalizes image URLs:
 * If an image has a relative path, refers to local assets, or is a cloud link (Google Photos/Drive),
 * it returns the direct bundled asset or formatted URL.
 */
export const getImageUrl = (url?: string | null, fallback = DEFAULT_RESORT_IMAGE): string => {
  if (!url || typeof url !== 'string' || !url.trim()) return fallback;

  const normalized = normalizeImageUrl(url);

  // Check direct local asset mappings (Only if explicitly referring to Nilawar Farms assets)
  if (normalized.toLowerCase().includes('nilawar')) {
    for (const [key, asset] of Object.entries(NILAWAR_ASSET_MAP)) {
      if (normalized.includes(key)) {
        return asset;
      }
    }
  }

  // Direct external URLs
  if (
    normalized.startsWith('http://') ||
    normalized.startsWith('https://') ||
    normalized.startsWith('data:') ||
    normalized.startsWith('blob:')
  ) {
    return normalized;
  }

  const cleanPath = normalized.startsWith('/') ? normalized : `/${normalized}`;

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
  const isNilawar = (target.alt || '').toLowerCase().includes('nilawar');
  const safeFallback = isNilawar ? nilawar1 : fallback;

  if (target.src !== safeFallback) {
    target.src = safeFallback;
  }
};


