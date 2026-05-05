import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { Card } from '../components/Card';
import { ScreenContainer } from '../components/ScreenContainer';
import { baseCleansingTips, cleansingRules } from '../data/cleansing';
import { skinTypes } from '../data/skinTypes';
import { loadSkinTypes } from '../services/storage';
import { SkinTypeId } from '../types';

const unique = (items: string[]) => Array.from(new Set(items));

export function CleansingScreen() {
  const [selectedIds, setSelectedIds] = useState<SkinTypeId[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadSkinTypes().then(setSelectedIds);
    }, []),
  );

  const selectedLabels = skinTypes.filter((type) => selectedIds.includes(type.id));
  const combinedRules = unique(selectedIds.flatMap((id) => cleansingRules[id]));
  const rulesToShow = combinedRules.length > 0 ? combinedRules : baseCleansingTips;

  return (
    <ScreenContainer>
      <View>
        <Text style={styles.title}>선크림 후 세안법</Text>
        <Text style={styles.subtitle}>진단이 아니라 매일 쓰기 쉬운 생활 관리 팁으로 안내해요.</Text>
      </View>

      <Card style={styles.summaryCard}>
        <Text style={styles.cardTitle}>선택된 피부 타입</Text>
        <Text style={styles.body}>
          {selectedLabels.length > 0 ? selectedLabels.map((type) => type.label).join(', ') : '피부 타입을 선택하면 세안 팁이 더 구체화돼요.'}
        </Text>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>맞춤 세안 루틴</Text>
        {rulesToShow.map((rule) => (
          <View key={rule} style={styles.row}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.rule}>{rule}</Text>
          </View>
        ))}
      </Card>

      <Card>
        <Text style={styles.cardTitle}>기본 루틴</Text>
        {baseCleansingTips.map((tip) => (
          <View key={tip} style={styles.row}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.rule}>{tip}</Text>
          </View>
        ))}
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
    backgroundColor: '#EFFAF2',
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
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  bullet: {
    color: '#66B58A',
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
