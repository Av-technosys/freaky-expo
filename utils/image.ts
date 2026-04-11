const BASE_URL = process.env.EXPO_PUBLIC_AWS_IMAGE_URL || '';

export const getImageUrl = (path?: string | null): string | undefined => {
  if (!path) return undefined;

  if (path.startsWith('http')) return path;

  return `${BASE_URL}/${path}`;
};