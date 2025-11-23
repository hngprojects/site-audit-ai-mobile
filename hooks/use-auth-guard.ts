import { useAuthStore } from '@/store/auth-store';
import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

export const useAuthGuard = () => {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';

    if (isAuthenticated && (inAuthGroup || inOnboardingGroup)) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isInitialized, segments, router]);
};

