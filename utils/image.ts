const BASE_URL = process.env.EXPO_PUBLIC_AWS_IMAGE_URL || '';

export const getMediaUrl = (path?: string | null): string | null => {
  if (!path) return null;

  const cleanPath = path.trim();

  if (!cleanPath) return null;

  if (cleanPath.startsWith('http')) return cleanPath;

  return `${BASE_URL}/${cleanPath}`;
};