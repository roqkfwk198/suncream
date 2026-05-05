import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '../components/Card';
import { ScreenContainer } from '../components/ScreenContainer';
import { SelectableChip } from '../components/SelectableChip';
import { skinTypes } from '../data/skinTypes';
import { loadSkinTypes, saveSkinTypes } from '../services/storage';
import { SkinTypeId } from '../types';

export function SkinTypeScreen() {
  const [selectedIds, setSelectedIds] = useState<SkinTypeId[]>([]);

  useEffect(() => {
    loadSkinTypes().then(setSelectedIds);
  }, []);

  const toggleSkinType = async (id: SkinTypeId) => {
    const nextIds = selectedIds.includes(id)
      ? selectedIds.filter((selectedId) => selectedId !== id)
      : [...selectedIds, id];

    setSelectedIds(nextIds);
    await saveSkinTypes(nextIds);
  };

  return (
    <ScreenContainer>
      <View>
        <Text style={styles.title}>피부 타입 설정</Text>
        <Text style={styles.subtitle}>해당되는 항목을 여러 개 선택해도 괜찮아요.</Text>
      </View>

      <Card>
        <Text style={styles.cardTitle}>내 피부에 가까운 항목</Text>
        <View style={styles.chipGrid}>
          {skinTypes.map((skinType) => (
            <SelectableChip
              key={skinType.id}
              label={skinType.label}
              selected={selectedIds.includes(skinType.id)}
              onPress={() => toggleSkinType(skinType.id)}
            />
          ))}
        </View>
      </Card>

      <Card style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>저장된 선택</Text>
        <Text style={styles.summaryText}>
          {selectedIds.length > 0
            ? skinTypes.filter((type) => selectedIds.includes(type.id)).map((type) => type.label).join(', ')
            : '선택된 항목이 없어요. 추천과 세안법 화면에서 기본 팁을 보여드릴게요.'}
        </Text>
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
  cardTitle: {
    color: '#213B45',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 14,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  summaryCard: {
    backgroundColor: '#EFFAF2',
  },
  summaryTitle: {
    color: '#236476',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  summaryText: {
    color: '#45666E',
    fontSize: 15,
    lineHeight: 22,
  },
});
