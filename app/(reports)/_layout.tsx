import { Stack } from 'expo-router';

export default function ReportsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="report-screen" />
      <Stack.Screen name="website-review-request-screen" />
      <Stack.Screen name="report-dashboard" />
    </Stack>
  );
}

