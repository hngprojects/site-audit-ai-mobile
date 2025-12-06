import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="profile" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="change-password" />
      <Stack.Screen name="terms-conditions" />
      <Stack.Screen name="privacy-policy" />
    </Stack>
  );
}

