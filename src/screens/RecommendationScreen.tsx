import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { Card } from '../components/Card';
import { ScreenContainer } from '../components/ScreenContainer';
import { loadSkinTypeProfile } from '../services/storage';
import { SkinTypeProfile } from '../types';

export function RecommendationScreen() {
  const [profile, setProfile] = useState<SkinTypeProfile | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadSkinTypeProfile().then(setProfile);
    }, []),
  );

  return (
    <ScreenContainer>
      <View>
        <Text style={styles.title}>선크림 추천</Text>
        <Text style={styles.subtitle}>저장된 피부 타입을 기준으로 성분과 제형 중심의 조건을 정리했어요.</Text>
      </View>

      <Card style={styles.summaryCard}>
        <Text style={styles.cardTitle}>선택된 피부 타입</Text>
        {profile ? (
          <>
            <Text style={styles.typeCode}>{profile.skinTypeCode}</Text>
            <Text style={styles.body}>{profile.skinTypeDetail.summary}</Text>
          </>
        ) : (
          <Text style={styles.body}>피부 설정 탭에서 피부 타입을 먼저 선택해주세요.</Text>
        )}
      </Card>

      <Card>
        <Text style={styles.cardTitle}>추천 조건</Text>
        {profile ? (
          <View style={styles.row}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.rule}>{profile.skinTypeDetail.sunscreenRecommendation}</Text>
          </View>
        ) : (
          <View style={styles.row}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.rule}>피부 타입 저장 후 맞춤 선크림 조건을 볼 수 있어요.</Text>
          </View>
        )}
      </Card>

      <Card>
        <Text style={styles.cardTitle}>주의할 성분/제형</Text>
        {profile ? (
          <View style={styles.row}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.rule}>{profile.skinTypeDetail.avoidOrCaution}</Text>
          </View>
        ) : (
          <Text style={styles.body}>피부 설정 탭에서 피부 타입을 먼저 선택해주세요.</Text>
        )}
      </Card>

      <Card>
        <Text style={styles.cardTitle}>관리 포인트</Text>
        {profile ? (
          <View style={styles.row}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.rule}>{profile.skinTypeDetail.carePoint}</Text>
          </View>
        ) : (
          <Text style={styles.body}>피부 설정 탭에서 피부 타입을 먼저 선택해주세요.</Text>
        )}
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    color: '#213B45',
    fontSize: 28,
    fontWeight: '900',
  },
  subtitle: {
    color: '#5C7A7F',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  summaryCard: {
    backgroundColor: '#FFF8D9',
  },
  cardTitle: {
    color: '#213B45',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 12,
  },
  body: {
    color: '#45666E',
    fontSize: 15,
    lineHeight: 22,
  },
  typeCode: {
    color: '#213B45',
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 38,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  bullet: {
    color: '#3EA7C8',
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 23,
  },
  rule: {
    color: '#45666E',
    flex: 1,
    fontSize: 15,
    lineHeight: 23,
  },
});
