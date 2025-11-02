/**
 * Utility functions for handling image URLs from backend
 */

/**
 * Gets the full image URL from a relative or absolute path
 * Handles both local uploads and external URLs (S3, etc.)
 */
export const getImageUrl = (url: string | undefined | null): string => {
  if (!url) return '/images/login.jpeg'; // Fallback to default
  
  // If it's already a full URL (http/https), use as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it starts with /uploads, prepend server URL
  if (url.startsWith('/uploads')) {
    const apiUrl = import.meta.env.VITE_API_URL || 'https://campus-connect-server-yqbh.onrender.com/api';
    const baseUrl = apiUrl.replace('/api', '');
    return `${baseUrl}${url}`;
  }
  
  // Otherwise assume it's already complete or return as is
  return url;
};

/**
 * Gets profile image with fallback chain: profileImage -> photos[0] -> default
 */
export const getProfileImage = (
  profileImage?: string | null,
  photos?: string[] | null
): string => {
  if (profileImage) return getImageUrl(profileImage);
  if (photos && photos.length > 0 && photos[0]) return getImageUrl(photos[0]);
  return '/images/login.jpeg';
};

/**
 * Gets first photo from array with fallback
 */
export const getFirstPhoto = (photos?: string[] | null): string => {
  if (photos && photos.length > 0 && photos[0]) return getImageUrl(photos[0]);
  return '/images/login.jpeg';
};

