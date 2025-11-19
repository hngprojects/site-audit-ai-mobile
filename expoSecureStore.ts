import * as SecureStore from 'expo-secure-store';



async function saveToSecureStore(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

async function getFromSecureStore(key: string) {
  return await SecureStore.getItemAsync(key);
}

async function removeFromSecureStore(key: string) {
  await SecureStore.deleteItemAsync(key);
}
export { getFromSecureStore, removeFromSecureStore, saveToSecureStore };
