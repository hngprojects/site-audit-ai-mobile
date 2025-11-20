import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName='privacy'>
      <Stack.Screen name="privacy" />
      <Stack.Screen name="language" />
    </Stack>
  );
}

