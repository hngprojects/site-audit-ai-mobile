import {
    getFromSecureStore,
    removeFromSecureStore,
    saveToSecureStore
} from '@/expoSecureStore';
import * as Application from 'expo-application';
import * as Crypto from "expo-crypto";



const DEVICE_ID_KEY = 'DEVICE_ID';


export const getPersistentDeviceId = async (): Promise<string> => {
  
  let deviceId = await getFromSecureStore(DEVICE_ID_KEY);
  if (deviceId) return deviceId;

  
  let baseId: string | null = null;

  try {
    
    baseId = await Application.getAndroidId();
  } catch {
    baseId = null;
  }

  
  if (!baseId) {
    baseId = Crypto.randomUUID();
  }

  deviceId = `sitelytics-${baseId}`;

  
  await saveToSecureStore(DEVICE_ID_KEY, deviceId);

  return deviceId;
};

// For debugging or reset purposes
export const clearPersistentDeviceId = async () => {
  await removeFromSecureStore(DEVICE_ID_KEY);
};


