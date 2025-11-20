import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="otp-verification" options={{ headerShown: false }} />
      <Stack.Screen name="new-password" options={{ headerShown: false }} />
      <Stack.Screen name="password-reset-success" options={{ headerShown: false }} />
    </Stack>
  );
}

