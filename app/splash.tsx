import { storage, STORAGE_KEYS } from '@/lib/storage';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Image, ImageBackground, View } from 'react-native';

const Splash = () => {
  const router = useRouter();


  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        // Check if onboarding has been completed
        const onboardingCompleted = await storage.getItem<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETED);

        console.log('🔍 Splash Screen - Onboarding check:', {
          key: STORAGE_KEYS.ONBOARDING_COMPLETED,
          value: onboardingCompleted,
          type: typeof onboardingCompleted,
          isTrue: onboardingCompleted === true,
        });

        // Explicitly check for true value
        if (onboardingCompleted === true) {
          // Onboarding already completed, go directly to homepage
          console.log('✅ Onboarding completed, navigating to tabs');
          router.replace('/(tabs)');
        } else {
          // First time, show onboarding
          console.log('❌ Onboarding not completed, showing onboarding screen');
          router.replace('/(onboarding)');
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        // On error, show onboarding to be safe
        router.replace('/(onboarding)');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        style={{
          flex: 1,
          height: "100%",
          width: "100%",
        }}
        source={require('../assets/images/android-icon-background.png')}
        resizeMode="cover"
      >
        <Image
          source={require('../assets/images/icon.png')}
          style={{
            width: 150,
            height: 150,
            resizeMode: 'contain',
            alignSelf: 'center',
            marginTop: '75%',
          }}
        />
      </ImageBackground>
    </View>
  );
};

export default Splash;
