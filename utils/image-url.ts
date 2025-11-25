const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || '';

export const getFullImageUrl = (imagePath: string | null | undefined): string | null => {
  if (!imagePath || !imagePath.trim()) {
    return null;
  }

  // If the image path is already a full URL (starts with http:// or https://), return it as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // If BASE_URL is not set, return the path as is (might be a local path)
  if (!BASE_URL) {
    return imagePath;
  }

  // Remove leading slash from imagePath if present to avoid double slashes
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  
  // Remove trailing slash from BASE_URL if present
  const cleanBaseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;

  return `${cleanBaseUrl}/${cleanPath}`;
};

