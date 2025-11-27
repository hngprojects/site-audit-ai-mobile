import {
  getFromSecureStore,
  removeFromSecureStore,
  saveToSecureStore,
} from "@/expoSecureStore";

import * as Application from "expo-application";
import * as Crypto from "expo-crypto";
import { Platform } from "react-native";

const DEVICE_ID_KEY = "DEVICE_ID"; 
const DEVICE_PLATFORM_KEY = "DEVICE_PLATFORM";


export const getPersistentDeviceInfo = async (): Promise<{
  deviceId: string;
  device: "ios" | "android";
}> => {
  
  let deviceId = await getFromSecureStore(DEVICE_ID_KEY);
  let devicePlatform = (await getFromSecureStore(DEVICE_PLATFORM_KEY)) as
    | "ios"
    | "android"
    | null;

  
  if (deviceId && devicePlatform) {
    return { deviceId, device: devicePlatform };
  }


  let baseId: string | null = null;

  try {
    if (Platform.OS === "android") {
      baseId = await Application.getAndroidId(); 
    } else if (Platform.OS === "ios") {
      baseId = await Application.getIosIdForVendorAsync(); 
    }
  } catch {
    baseId = null;
  }

  
  if (!baseId) {
    baseId = Crypto.randomUUID();
  }


  deviceId = `sitelytics-${baseId}`;
  devicePlatform = Platform.OS === "ios" ? "ios" : "android";


  await saveToSecureStore(DEVICE_ID_KEY, deviceId);
  await saveToSecureStore(DEVICE_PLATFORM_KEY, devicePlatform);

  return { deviceId, device: devicePlatform };
};



// For debugging or reset purposes
export const clearPersistentDeviceInfo = async () => {
  await removeFromSecureStore(DEVICE_ID_KEY);
  await removeFromSecureStore(DEVICE_PLATFORM_KEY);
};




