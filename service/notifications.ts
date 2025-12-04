
import axios from 'axios';

// TODO: Replace with actual API base URL
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.sitelytics.com';

type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  logoThumbnail: any;
};

type NotificationSettings = {
  push_enabled: boolean;
  email_enabled: boolean;
};

export const getNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/notifications`);
    return response.data.map((n: any) => ({
      ...n,
      logoThumbnail: require('@/assets/images/logo_thumbnail.png'), // Add default thumbnail
    }));
  } catch (error) {
    console.warn('Failed to fetch notifications from API:', error);
    // Return empty array to show empty state
    return [];
  }
};

export const getUnreadCount = async (): Promise<number> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/notifications/unread-count`);
    return response.data.count || 0;
  } catch (error) {
    console.warn('Failed to fetch unread count:', error);
    return 0;
  }
};

export const markAsRead = async (ids: string[]): Promise<boolean> => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/api/v1/notifications/mark-as-read`, {
      notification_ids: ids
    });
    return response.status === 200;
  } catch (error) {
    console.error('Failed to mark notifications as read:', error);
    return false;
  }
};

export const markAllAsRead = async (): Promise<boolean> => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/api/v1/notifications/mark-all-as-read`);
    return response.status === 200;
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
    return false;
  }
};

export const deleteNotification = async (id: string): Promise<boolean> => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/v1/notifications/${id}`);
    return response.status === 200;
  } catch (error) {
    console.error('Failed to delete notification:', error);
    return false;
  }
};

export const deleteAllNotifications = async (): Promise<boolean> => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/v1/notifications`);
    return response.status === 200;
  } catch (error) {
    console.error('Failed to delete all notifications:', error);
    return false;
  }
};

export const getNotificationSettings = async (): Promise<NotificationSettings> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/notifications/settings`);
    return response.data;
  } catch (error) {
    console.warn('Failed to fetch notification settings:', error);
    return { push_enabled: true, email_enabled: false };
  }
};

export const updateNotificationSettings = async (settings: NotificationSettings): Promise<boolean> => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/api/v1/notifications/settings`, settings);
    return response.status === 200;
  } catch (error) {
    console.error('Failed to update notification settings:', error);
    return false;
  }
};

export type { Notification };

