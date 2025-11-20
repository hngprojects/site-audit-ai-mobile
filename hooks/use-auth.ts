import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

/**
 * Custom hook for authentication
 * Provides auth state and methods, with automatic initialization
 */
export const useAuth = () => {
  const router = useRouter();
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    isInitialized,
    error,
    signIn,
    signUp,
    signOut,
    initialize,
    clearError,
  } = useAuthStore();

  // Initialize auth on mount
  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  // Navigate based on auth state
  useEffect(() => {
    if (!isInitialized) return;

    if (isAuthenticated) {
      // User is authenticated, can navigate to main app
      // Navigation is handled by the app's routing logic
    } else {
      // User is not authenticated
      // Navigation is handled by the app's routing logic
    }
  }, [isAuthenticated, isInitialized]);

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    isInitialized,
    error,

    // Actions
    signIn,
    signUp: (email: string, password: string) => signUp(email, password),
    signOut,
    clearError,
  };
};

