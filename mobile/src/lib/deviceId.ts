import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomUUID } from "expo-crypto";

const STORAGE_KEY = "alltidy_device_id";

export async function getDeviceId(): Promise<string> {
  let id = await AsyncStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = randomUUID();
    await AsyncStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}
