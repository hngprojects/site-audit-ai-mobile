import { getFromSecureStore } from '@/expoSecureStore';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, ImageBackground, View } from 'react-native';

const Splash = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(async () => {

      const token = await getFromSecureStore("jwt");

      if (token) {
         router.replace("./(tabs)/"); 
      }

      router.replace("./onboarding"); 

    }, 3000);

    return () => clearTimeout(timer); 
  }, []);

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
