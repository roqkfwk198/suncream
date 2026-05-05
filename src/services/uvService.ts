import * as Location from 'expo-location';

import { UvInfo, UvRiskLevel } from '../types';

const cityUvMock: Record<string, number> = {
  서울: 7,
  부산: 8,
  광주: 9,
  대구: 8,
  대전: 6,
  인천: 6,
  울산: 7,
  제주: 10,
  세종: 6,
  수원: 7,
};

export const getRiskLevel = (index: number): UvRiskLevel => {
  if (index <= 2) return '낮음';
  if (index <= 5) return '보통';
  if (index <= 7) return '높음';
  if (index <= 10) return '매우 높음';
  return '위험';
};

export const getUvMessage = (index: number) => {
  const risk = getRiskLevel(index);

  if (risk === '낮음') return '오늘은 자외선이 낮은 편이에요. 그래도 외출 전 선크림은 챙겨주세요.';
  if (risk === '보통') return '자외선이 보통 수준이에요. 장시간 외출하면 2~3시간마다 덧발라주세요.';
  if (risk === '높음') return '오늘은 자외선이 강해요. 외출 시 2시간마다 선크림을 다시 발라주세요.';
  if (risk === '매우 높음') return '자외선이 매우 강해요. 모자와 선글라스도 함께 챙기고 자주 덧발라주세요.';
  return '자외선 위험 단계예요. 한낮 외출은 줄이고 노출 부위를 꼼꼼히 보호해주세요.';
};

export const getMockUvInfo = async (city: string): Promise<UvInfo> => {
  const normalizedCity = city.replace(/특별시|광역시|특별자치시|특별자치도|시|도/g, '');
  const index = cityUvMock[normalizedCity] ?? 7;

  return {
    index,
    risk: getRiskLevel(index),
    message: getUvMessage(index),
  };
};

export const getSimpleCityName = (place?: Location.LocationGeocodedAddress) => {
  const raw =
    place?.city ||
    place?.subregion ||
    place?.region ||
    place?.district ||
    '서울';

  return raw
    .replace('특별시', '')
    .replace('광역시', '')
    .replace('특별자치시', '')
    .replace('특별자치도', '')
    .replace('시', '')
    .trim();
};
