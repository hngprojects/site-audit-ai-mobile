import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

// Prevent the splash screen from auto-hiding before fonts are loaded
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded, fontError] = useFonts({
    'RethinkSans-Regular': require('../assets/font/rethink_sans/RethinkSans-Regular.ttf'),
    'RethinkSans-Medium': require('../assets/font/rethink_sans/RethinkSans-Medium.ttf'),
    'RethinkSans-SemiBold': require('../assets/font/rethink_sans/RethinkSans-SemiBold.ttf'),
    'RethinkSans-Bold': require('../assets/font/rethink_sans/RethinkSans-Bold.ttf'),
    'RethinkSans-ExtraBold': require('../assets/font/rethink_sans/RethinkSans-ExtraBold.ttf'),
    'RethinkSans-Italic': require('../assets/font/rethink_sans/RethinkSans-Italic.ttf'),
    'RethinkSans-MediumItalic': require('../assets/font/rethink_sans/RethinkSans-MediumItalic.ttf'),
    'RethinkSans-SemiBoldItalic': require('../assets/font/rethink_sans/RethinkSans-SemiBoldItalic.ttf'),
    'RethinkSans-BoldItalic': require('../assets/font/rethink_sans/RethinkSans-BoldItalic.ttf'),
    'RethinkSans-ExtraBoldItalic': require('../assets/font/rethink_sans/RethinkSans-ExtraBoldItalic.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

 
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName='splash'>
        <Stack.Screen name="splash" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="forgotPassword" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="signUp" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
