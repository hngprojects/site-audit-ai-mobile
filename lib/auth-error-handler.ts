import { isAxiosError } from 'axios';
import { useAuthStore } from '@/store/auth-store';

/**
 * Checks if an error is an authentication error
 */
export const isAuthError = (error: unknown): boolean => {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    const errorMessage = error.response?.data?.message || error.response?.data?.error || '';
    
    // Check for 401 status
    if (status === 401) {
      return true;
    }
    
    // Check for authentication-related error messages
    if (typeof errorMessage === 'string') {
      const errorText = errorMessage.toLowerCase();
      return errorText.includes('invalid authentication credentials') ||
             errorText.includes('unauthenticated') ||
             errorText.includes('authentication failed') ||
             errorText.includes('token expired') ||
             errorText.includes('invalid token');
    }
  }
  
  if (error instanceof Error) {
    const errorText = error.message.toLowerCase();
    return errorText.includes('invalid authentication credentials') ||
           errorText.includes('unauthenticated') ||
           errorText.includes('authentication failed') ||
           errorText.includes('token expired') ||
           errorText.includes('invalid token');
  }
  
  return false;
};

/**
 * Handles authentication errors by logging out the user
 */
export const handleAuthError = async (error: unknown): Promise<boolean> => {
  if (isAuthError(error)) {
    try {
      const { signOut } = useAuthStore.getState();
      await signOut();
      return true; // Indicates logout was performed
    } catch (logoutError) {
      console.error('Error during logout:', logoutError);
      return false;
    }
  }
  return false; // Not an auth error
};

