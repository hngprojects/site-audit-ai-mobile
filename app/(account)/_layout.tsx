import { Stack } from 'expo-router';

export default function AccountLayout() {
  return (
    <Stack>
      <Stack.Screen name="delete-account-screen" options={{ headerShown: false }} />
      <Stack.Screen name="delete-account-verification" options={{ headerShown: false }} />
      <Stack.Screen name="delete-account-choice-selection" options={{ headerShown: false }} />
      <Stack.Screen name="deletion-confirmation-screen" options={{ headerShown: false }} />
    </Stack>
  );
}
