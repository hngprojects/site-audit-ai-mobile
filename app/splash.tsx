import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ImageBackground, View } from 'react-native';

const Splash = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/'); 

       return () => clearTimeout(timer);
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
        source={require('../assets/images/Site-AI-Splash.png')}
        resizeMode="cover"
      />
    </View>
  );
};

export default Splash;
