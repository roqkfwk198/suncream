import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { Card } from '../components/Card';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { activities } from '../data/activities';
import { skinTypes } from '../data/skinTypes';
import { loadSkinTypes } from '../services/storage';
import { getMockUvInfo, getSimpleCityName } from '../services/uvService';
import { RootTabParamList, SkinTypeId, UvInfo } from '../types';

type HomeScreenProps = BottomTabScreenProps<RootTabParamList, '홈'>;

export function HomeScreen({ navigation }: HomeScreenProps) {
  const [city, setCity] = useState('서울');
  const [uvInfo, setUvInfo] = useState<UvInfo | null>(null);
  const [notice, setNotice] = useState('위치 권한을 확인하고 있어요.');
  const [loading, setLoading] = useState(true);
  const [selectedSkinTypes, setSelectedSkinTypes] = useState<SkinTypeId[]>([]);

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
      const savedSkinTypes = await loadSkinTypes();
      setCity(nextCity);
      setUvInfo(nextUvInfo);
      setSelectedSkinTypes(savedSkinTypes);
    } catch {
      const fallbackUvInfo = await getMockUvInfo('서울');
      setCity('서울');
      setUvInfo(fallbackUvInfo);
      setNotice('위치 정보를 불러오지 못해 기본 지역 서울로 표시했어요.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadHomeData);
    return unsubscribe;
  }, [loadHomeData, navigation]);

  const selectedLabels = skinTypes
    .filter((type) => selectedSkinTypes.includes(type.id))
    .map((type) => type.label);

  return (
    <ScreenContainer>
      <View>
        <Text style={styles.eyebrow}>SunCare Timer</Text>
        <Text style={styles.title}>오늘 피부를 햇빛에서 편하게 지켜요</Text>
      </View>

      <Card style={styles.uvCard}>
        <Text style={styles.cardLabel}>현재 지역</Text>
        <Text style={styles.city}>{city}</Text>
        <Text style={styles.notice}>{notice}</Text>

        {loading || !uvInfo ? (
          <ActivityIndicator color="#3EA7C8" style={styles.loader} />
        ) : (
          <View style={styles.uvRow}>
            <View style={styles.uvCircle}>
              <Text style={styles.uvNumber}>{uvInfo.index}</Text>
              <Text style={styles.uvCaption}>UV</Text>
            </View>
            <View style={styles.uvTextBox}>
              <Text style={styles.risk}>{uvInfo.risk}</Text>
              <Text style={styles.message}>{uvInfo.message}</Text>
            </View>
          </View>
        )}
      </Card>

      <Card>
        <Text style={styles.cardTitle}>활동 타이머</Text>
        <Text style={styles.body}>활동을 고르면 권장 재도포 시간이 자동으로 설정돼요.</Text>
        <Text style={styles.smallList}>{activities.map((activity) => activity.name).join(' · ')}</Text>
        <PrimaryButton label="타이머 설정하기" onPress={() => navigation.navigate('타이머')} />
      </Card>

      <Card>
        <Text style={styles.cardTitle}>피부 타입</Text>
        <Text style={styles.body}>
          {selectedLabels.length > 0 ? selectedLabels.join(', ') : '아직 선택된 피부 타입이 없어요.'}
        </Text>
        <PrimaryButton label="피부 타입 고르기" onPress={() => navigation.navigate('피부 설정')} variant="secondary" />
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    color: '#3EA7C8',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 6,
  },
  title: {
    color: '#213B45',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 36,
  },
  uvCard: {
    backgroundColor: '#FFF8D9',
  },
  cardLabel: {
    color: '#5C7A7F',
    fontSize: 14,
    fontWeight: '700',
  },
  city: {
    color: '#213B45',
    fontSize: 30,
    fontWeight: '900',
    marginTop: 4,
  },
  notice: {
    color: '#5C7A7F',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
  loader: {
    marginTop: 24,
  },
  uvRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    marginTop: 20,
  },
  uvCircle: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#F3CA45',
    borderRadius: 8,
    borderWidth: 1,
    height: 104,
    justifyContent: 'center',
    width: 104,
  },
  uvNumber: {
    color: '#F0A000',
    fontSize: 42,
    fontWeight: '900',
  },
  uvCaption: {
    color: '#8B7300',
    fontSize: 13,
    fontWeight: '800',
  },
  uvTextBox: {
    flex: 1,
    gap: 6,
  },
  risk: {
    color: '#236476',
    fontSize: 24,
    fontWeight: '900',
  },
  message: {
    color: '#385A63',
    fontSize: 15,
    lineHeight: 22,
  },
  cardTitle: {
    color: '#213B45',
    fontSize: 21,
    fontWeight: '800',
    marginBottom: 8,
  },
  body: {
    color: '#45666E',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  smallList: {
    color: '#5C7A7F',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
  },
});
