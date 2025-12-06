import { storage, STORAGE_KEYS } from '@/lib/storage';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from "react";
import { Animated, Easing, Image, View } from "react-native";




const Splash = () => {
  const router = useRouter();
  const translateY = useRef(new Animated.Value(1000)).current;
  const opacity = useRef(new Animated.Value(0)).current;





  useEffect(() => {
    Animated.parallel([
      // Slide up animation
      Animated.timing(translateY, {
        toValue: 0,
        duration: 2000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      // Fade-in animation
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);


  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const onboardingCompleted = await storage.getItem<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETED);

        if (onboardingCompleted === true) {
          // Onboarding already completed, go directly to homepage
          console.log(' Onboarding completed, navigating to tabs');
          router.replace('/(tabs)');
        } else {
          // First time, show onboarding
          console.log(' Onboarding not completed, showing onboarding screen');
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
    <View style={{ flex: 1, backgroundColor: "#fff" }}>

      <Animated.View
        style={{
          transform: [{ translateY }],
          alignSelf: "center",
          marginTop: "75%",
        }}
      >
        <Image
          source={require("../assets/images/icon.png")}
          style={{
            width: 150,
            height: 150,
            resizeMode: "contain",
          }}
        />
      </Animated.View>

      <Image
        source={require("../assets/images/Wave.png")}
        style={{
          position: "absolute",
          zIndex: 999,
          top: 617,
          left: 0,
          width: "100%",
          height: 185,
          resizeMode: "contain",
        }}

      />
    </View>
  );
};

export default Splash;
