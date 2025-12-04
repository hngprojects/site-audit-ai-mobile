import { useAuthStore } from '@/store/auth-store';
import { usePathname, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

export const useAuthGuard = () => {
  const router = useRouter();
  const segments = useSegments();
  const pathname = usePathname();
  const { isAuthenticated, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) return;

    // Don't interfere with splash screen - let it handle onboarding check
    const isSplashScreen = pathname === '/splash' || pathname === 'splash';
    if (isSplashScreen) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';

    if (isAuthenticated && (inAuthGroup || inOnboardingGroup)) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isInitialized, segments, pathname, router]);
};

