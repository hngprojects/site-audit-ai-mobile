import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Types
export interface PushToken {
  token: string;
  platform: 'ios' | 'android';
}

// Notification permission status
export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

// Get push token
export const getPushToken = async (): Promise<PushToken | null> => {
  try {
    const token = await Notifications.getExpoPushTokenAsync();
    return {
      token: token.data,
      platform: Platform.OS as 'ios' | 'android',
    };
  } catch (error) {
    console.error('Error getting push token:', error);
    return null;
  }
};

// Register push token with backend
export const registerPushToken = async (token: PushToken): Promise<boolean> => {
  try {
    // TODO: Replace with actual API call
    console.log('Registering push token:', token);
    // const response = await api.post('/api/notifications/push-token', token);
    // return response.status === 200;
    return true; // Mock success
  } catch (error) {
    console.error('Error registering push token:', error);
    return false;
  }
};

// Initialize notifications
export const initializeNotifications = async (): Promise<() => void> => {
  const hasPermission = await requestNotificationPermissions();

  if (hasPermission) {
    const pushToken = await getPushToken();
    if (pushToken) {
      await registerPushToken(pushToken);
    }
  }

  // Set up notification listeners
  Notifications.addNotificationReceivedListener((notification: any) => {
    console.log('Notification received:', notification);
    // Handle notification received while app is foreground
  });

  Notifications.addNotificationResponseReceivedListener((response: any) => {
    console.log('Notification response:', response);
    // Handle notification tapped
    // Could navigate to specific screen based on notification data
  });

  // Return cleanup function
  return () => {
    // Note: removeNotificationSubscription was removed in newer versions of expo-notifications
    // Subscriptions are automatically cleaned up when the app unmounts
  };
};

// Send local notification (for testing)
export const sendLocalNotification = async (title: string, body: string, data?: any) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: data || {},
    },
    trigger: null, // Send immediately
  });
};

// Get notification badge count
export const getBadgeCount = async (): Promise<number> => {
  try {
    const badge = await Notifications.getBadgeCountAsync();
    return badge;
  } catch (error) {
    console.error('Error getting badge count:', error);
    return 0;
  }
};

// Set notification badge count
export const setBadgeCount = async (count: number): Promise<void> => {
  try {
    await Notifications.setBadgeCountAsync(count);
  } catch (error) {
    console.error('Error setting badge count:', error);
  }
};