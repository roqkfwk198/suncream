import AsyncStorage from '@react-native-async-storage/async-storage';

import { PersistedTimer, SkinTypeId } from '../types';

const SKIN_TYPES_KEY = 'sunCareTimer.skinTypes';
const TIMER_KEY = 'sunCareTimer.timer';

export const saveSkinTypes = async (skinTypeIds: SkinTypeId[]) => {
  await AsyncStorage.setItem(SKIN_TYPES_KEY, JSON.stringify(skinTypeIds));
};

export const loadSkinTypes = async (): Promise<SkinTypeId[]> => {
  const value = await AsyncStorage.getItem(SKIN_TYPES_KEY);
  return value ? (JSON.parse(value) as SkinTypeId[]) : [];
};

export const saveTimer = async (timer: PersistedTimer) => {
  await AsyncStorage.setItem(TIMER_KEY, JSON.stringify(timer));
};

export const loadTimer = async (): Promise<PersistedTimer | null> => {
  const value = await AsyncStorage.getItem(TIMER_KEY);
  return value ? (JSON.parse(value) as PersistedTimer) : null;
};

export const clearTimer = async () => {
  await AsyncStorage.removeItem(TIMER_KEY);
};
