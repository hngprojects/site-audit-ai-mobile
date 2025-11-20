import { Stack } from 'expo-router';

export default function AccountLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="delete-account-screen" />
      <Stack.Screen name="delete-account-verification" />
      <Stack.Screen name="delete-account-choice-selection" />
      <Stack.Screen name="deletion-confirmation-screen" />
    </Stack>
  );
}

