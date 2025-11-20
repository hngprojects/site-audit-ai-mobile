import { Stack } from 'expo-router';

export default function MainLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auditing-screen" />
      <Stack.Screen name="notifications-screen" />
    </Stack>
  );
}

