import { Stack } from 'expo-router';

export default function SupportLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="faq" />
      <Stack.Screen name="contact-support" />
      <Stack.Screen name="email-support" />
      <Stack.Screen name="live-chat-support" />
      <Stack.Screen name="message-sent-confirmation" />
    </Stack>
  );
}

