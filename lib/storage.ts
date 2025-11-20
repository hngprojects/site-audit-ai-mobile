import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  AUTH_STATE: '@auth_state',
} as const;

export const storage = {
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const item = await AsyncStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error(`Error getting item from storage: ${key}`, error);
      return null;
    }
  },

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item to storage: ${key}`, error);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item from storage: ${key}`, error);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage', error);
    }
  },
};

export { STORAGE_KEYS };

