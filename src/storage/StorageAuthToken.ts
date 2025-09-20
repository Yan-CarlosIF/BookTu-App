import AsyncStorage from "@react-native-async-storage/async-storage";
import { TOKEN_STORAGE } from "./StorageConfig";

async function storageSetAuthToken(token: string) {
  await AsyncStorage.setItem(TOKEN_STORAGE, token);
}

async function storageGetAuthToken() {
  return await AsyncStorage.getItem(TOKEN_STORAGE);
}

async function storageRemoveAuthToken() {
  await AsyncStorage.removeItem(TOKEN_STORAGE);
}

export { storageSetAuthToken, storageRemoveAuthToken, storageGetAuthToken };
