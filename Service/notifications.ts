
type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  logoThumbnail: any;
};

const DUMMY_NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'Welcome to Sitelytics', message: 'Welcome to Sitelytics, get started with your first audit today', time: '2 hours ago', unread: true, logoThumbnail: require('@/assets/images/logo_thumbnail.png') },
  { id: '2', title: 'Report Received', message: 'Your website audit is ready. 3 issues found! 2 are critical.', time: '2 hours ago', unread: true, logoThumbnail: require('@/assets/images/logo_thumbnail.png') },
  { id: '3', title: 'Fix Started', message: 'Your assigned fix is now in progress', time: '2 hours ago', unread: false, logoThumbnail: require('@/assets/images/logo_thumbnail.png') },
];

// Simulate network latency
const delay = (ms = 600) => new Promise((res) => setTimeout(res, ms));

export const getNotifications = async (): Promise<Notification[]> => {
  await delay(800);
  
  return JSON.parse(JSON.stringify(DUMMY_NOTIFICATIONS));
};

export const markAsRead = async (id: string): Promise<boolean> => {
  await delay(400);
  const idx = DUMMY_NOTIFICATIONS.findIndex((n) => n.id === id);
  if (idx === -1) return false;
  DUMMY_NOTIFICATIONS[idx].unread = false;
  return true;
};

export const deleteNotification = async (id: string): Promise<boolean> => {
  await delay(400);
  const idx = DUMMY_NOTIFICATIONS.findIndex((n) => n.id === id);
  if (idx === -1) return false;
  DUMMY_NOTIFICATIONS.splice(idx, 1);
  return true;
};

export type { Notification };
