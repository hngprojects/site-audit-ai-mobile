import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const STORAGE_KEYS = {
  AUTH_STATE: '@auth_state',
  ONBOARDING_COMPLETED: '@onboarding_completed',
  EMAIL_REPORTS_PREFERENCES: '@email_reports_preferences',
  LANGUAGE_PREFERENCES: '@language_preferences',
  REDIRECT_URL: '@redirect_url',
} as const;

const SECURE_STORE_KEYS = [STORAGE_KEYS.AUTH_STATE];

const getSecureStoreKey = (key: string): string => {
  return key.startsWith('@') ? key.substring(1) : key;
};

export const storage = {
  async getItem<T>(key: string): Promise<T | null> {
    try {
      if (SECURE_STORE_KEYS.includes(key as any)) {
        const secureKey = getSecureStoreKey(key);
        let item = await SecureStore.getItemAsync(secureKey);
        if (item) {
          try {
            return JSON.parse(item) as T;
          } catch (parseError) {
            console.error(`Error parsing SecureStore item for key: ${key}`, parseError);
            return null;
          }
        }
        const oldItem = await AsyncStorage.getItem(key);
        if (oldItem) {
          try {
            await SecureStore.setItemAsync(secureKey, oldItem);
            await AsyncStorage.removeItem(key);
            return JSON.parse(oldItem) as T;
          } catch (migrationError) {
            console.error(`Error migrating item from AsyncStorage to SecureStore for key: ${key}`, migrationError);
            return JSON.parse(oldItem) as T;
          }
        }
        return null;
      }
      const item = await AsyncStorage.getItem(key);
      if (item) {
        try {
          return JSON.parse(item) as T;
        } catch (parseError) {
          console.error(`Error parsing AsyncStorage item for key: ${key}`, parseError);
          return null;
        }
      }
      return null;
    } catch (error) {
      console.error(`Error getting item from storage: ${key}`, error);
      return null;
    }
  },

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      if (SECURE_STORE_KEYS.includes(key as any)) {
        const secureKey = getSecureStoreKey(key);
        await SecureStore.setItemAsync(secureKey, serialized);
      } else {
        await AsyncStorage.setItem(key, serialized);
      }
    } catch (error) {
      console.error(`Error setting item to storage: ${key}`, error);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      if (SECURE_STORE_KEYS.includes(key as any)) {
        const secureKey = getSecureStoreKey(key);
        await SecureStore.deleteItemAsync(secureKey);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing item from storage: ${key}`, error);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
      for (const key of SECURE_STORE_KEYS) {
        try {
          const secureKey = getSecureStoreKey(key);
          await SecureStore.deleteItemAsync(secureKey);
        } catch (error) {
          console.error(`Error clearing secure store key: ${key}`, error);
        }
      }
    } catch (error) {
      console.error('Error clearing storage', error);
    }
  },
};

export { STORAGE_KEYS };

