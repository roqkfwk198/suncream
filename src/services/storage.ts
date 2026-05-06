import AsyncStorage from '@react-native-async-storage/async-storage';

import { PersistedTimer, SkinTypeDetail, SkinTypeId, SkinTypeProfile } from '../types';
import { getSkinTypeDetail, selectionsFromSkinTypeCode } from '../data/skinTypeData';

export const STORAGE_KEYS = {
  SKIN_TYPE_CODE: 'skinTypeCode',
  SKIN_TYPE_DETAIL: 'skinTypeDetail',
};

const SKIN_TYPES_KEY = 'sunCareTimer.skinTypes';
const TIMER_KEY = 'sunCareTimer.timer';

export const saveSkinTypes = async (skinTypeIds: SkinTypeId[]) => {
  await AsyncStorage.setItem(SKIN_TYPES_KEY, JSON.stringify(skinTypeIds));
};

export const loadSkinTypes = async (): Promise<SkinTypeId[]> => {
  const value = await AsyncStorage.getItem(SKIN_TYPES_KEY);
  return value ? (JSON.parse(value) as SkinTypeId[]) : [];
};

export const saveSkinTypeProfile = async (profile: SkinTypeProfile) => {
  await AsyncStorage.setItem(STORAGE_KEYS.SKIN_TYPE_CODE, profile.skinTypeCode);
  await AsyncStorage.setItem(STORAGE_KEYS.SKIN_TYPE_DETAIL, JSON.stringify(profile.skinTypeDetail));
};

export const loadSkinTypeProfile = async (): Promise<SkinTypeProfile | null> => {
  const skinTypeCode = await AsyncStorage.getItem(STORAGE_KEYS.SKIN_TYPE_CODE);
  const detailValue = await AsyncStorage.getItem(STORAGE_KEYS.SKIN_TYPE_DETAIL);
  const detail = detailValue ? (JSON.parse(detailValue) as Partial<SkinTypeDetail>) : null;

  console.log('Loaded skinTypeCode:', skinTypeCode);
  console.log('Loaded skinTypeDetail:', detail);

  if (!skinTypeCode || !detail) return null;

  const selections = profileSelectionsFromCode(skinTypeCode);
  if (!selections) return null;
  const fallbackDetail = getSkinTypeDetail(skinTypeCode);
  const skinTypeDetail = hasCompleteSkinTypeDetail(detail)
    ? detail
    : fallbackDetail;
  if (!skinTypeDetail) return null;

  return {
    skinTypeCode,
    skinTypeDetail,
    selections,
  };
};

const profileSelectionsFromCode = (skinTypeCode: string) => selectionsFromSkinTypeCode(skinTypeCode);

const hasCompleteSkinTypeDetail = (detail: Partial<SkinTypeDetail>): detail is SkinTypeDetail =>
  Boolean(
    detail.code &&
      detail.summary &&
      detail.sunscreenRecommendation &&
      detail.avoidOrCaution &&
      detail.carePoint &&
      detail.cleansingMethod,
  );

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
