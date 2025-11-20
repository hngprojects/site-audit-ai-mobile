import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';

/**
 * Hook to protect routes based on authentication state
 * Redirects unauthenticated users to sign-in
 */
export const useAuthGuard = () => {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';
    const inTabsGroup = segments[0] === '(tabs)';

    if (!isAuthenticated && !inAuthGroup && !inOnboardingGroup) {
      // User is not authenticated and trying to access protected route
      router.replace('/(auth)/sign-in');
    } else if (isAuthenticated && (inAuthGroup || inOnboardingGroup)) {
      // User is authenticated but on auth/onboarding screens
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isInitialized, segments, router]);
};

