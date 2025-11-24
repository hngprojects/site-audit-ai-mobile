import axios, { isAxiosError } from 'axios';

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || '';

if (!BASE_URL) {
  console.warn('EXPO_PUBLIC_BASE_URL is not set. Please add it to your .env file.');
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const formatErrorMessage = (errorData: any): string => {
  if (errorData.data?.errors && Array.isArray(errorData.data.errors)) {
    const flattenErrors = (arr: any[]): string[] => {
      const result: string[] = [];
      for (const item of arr) {
        if (typeof item === 'string') {
          result.push(item);
        } else if (Array.isArray(item)) {
          result.push(...flattenErrors(item));
        } else if (item && typeof item === 'object') {
          if (item.message) {
            result.push(item.message);
          } else if (item.error) {
            result.push(item.error);
          } else {
            Object.values(item).forEach((val) => {
              if (typeof val === 'string') {
                result.push(val);
              } else if (Array.isArray(val)) {
                result.push(...flattenErrors(val));
              }
            });
          }
        }
      }
      return result;
    };
    
    const errorMessages = flattenErrors(errorData.data.errors);
    
    if (errorMessages.length > 0) {
      return errorMessages.join('. ');
    }
  }
  
  return errorData.message || errorData.error || 'An error occurred';
};

export { isAxiosError };

