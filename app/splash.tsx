import { storage, STORAGE_KEYS } from '@/lib/storage';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Image, ImageBackground, View } from 'react-native';

const Splash = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const onboardingCompleted = await storage.getItem<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETED);

        if (onboardingCompleted === true) {
          router.replace('/(tabs)');
        } else {
          router.replace('/(onboarding)');
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        router.replace('/(onboarding)');
      }
    }, 2500);

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
