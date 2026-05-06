import { useCallback, useState } from 'react';
import * as Location from 'expo-location';
import { useFocusEffect } from '@react-navigation/native';

import { UvHomeDashboard } from '../components/UvHomeDashboard';
import { getMockUvInfo, getSimpleCityName } from '../services/uvService';
import { UvInfo } from '../types';

export function HomeScreen() {
  const [city, setCity] = useState('서울');
  const [uvInfo, setUvInfo] = useState<UvInfo | null>(null);
  const [notice, setNotice] = useState('위치 권한을 확인하고 있어요.');
  const [loading, setLoading] = useState(true);

  const loadHomeData = useCallback(async () => {
    setLoading(true);

    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      let nextCity = '서울';

      if (permission.status === Location.PermissionStatus.GRANTED) {
        const position = await Location.getCurrentPositionAsync({});
        const [place] = await Location.reverseGeocodeAsync(position.coords);
        nextCity = getSimpleCityName(place);
        setNotice('현재 위치를 도시 단위로만 표시하고 있어요.');
      } else {
        setNotice('위치 권한이 없어 기본 지역 서울의 mock 자외선 지수를 보여드려요.');
      }

      const nextUvInfo = await getMockUvInfo(nextCity);
      setCity(nextCity);
      setUvInfo(nextUvInfo);
    } catch {
      const fallbackUvInfo = await getMockUvInfo('서울');
      setCity('서울');
      setUvInfo(fallbackUvInfo);
      setNotice('위치 정보를 불러오지 못해 기본 지역 서울로 표시했어요.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => {
    loadHomeData();
  }, [loadHomeData]));

  return <UvHomeDashboard city={city} loading={loading} notice={notice} uvInfo={uvInfo} />;
}
