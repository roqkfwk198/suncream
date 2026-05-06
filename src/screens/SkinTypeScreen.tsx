import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { PrimaryButton } from '../components/PrimaryButton';
import { getSkinTypeDetail, skinTypeData } from '../data/skinTypeData';
import { loadSkinTypeProfile, saveSkinTypeProfile } from '../services/storage';
import { SkinMbtiAxisId, SkinMbtiOptionCode, SkinMbtiSelections } from '../types';

type SkinOption = {
  code: SkinMbtiOptionCode;
  label: string;
  hint: string;
};

type SkinAxis = {
  id: SkinMbtiAxisId;
  title: string;
  options: SkinOption[];
};

const skinAxes: SkinAxis[] = [
  {
    id: 'balance',
    title: '유수분',
    options: [
      { code: 'D', label: '건성', hint: '당김/건조' },
      { code: 'O', label: '지성', hint: '피지/번들' },
    ],
  },
  {
    id: 'sensitivity',
    title: '민감도',
    options: [
      { code: 'S', label: '민감성', hint: '붉음/따가움' },
      { code: 'R', label: '저항성', hint: '안정/튼튼' },
    ],
  },
  {
    id: 'pigment',
    title: '색소',
    options: [
      { code: 'P', label: '색소성', hint: '잡티/기미' },
      { code: 'N', label: '비색소성', hint: '색소 적음' },
    ],
  },
  {
    id: 'elasticity',
    title: '탄력',
    options: [
      { code: 'W', label: '주름', hint: '잔주름' },
      { code: 'T', label: '탄탄함', hint: '탄력 좋음' },
    ],
  },
];

const axisOrder: SkinMbtiAxisId[] = ['balance', 'sensitivity', 'pigment', 'elasticity'];

export function SkinTypeScreen() {
  const [selections, setSelections] = useState<Partial<SkinMbtiSelections>>({});
  const [savedCode, setSavedCode] = useState<string | null>(null);

  useEffect(() => {
    loadSkinTypeProfile().then((profile) => {
      if (!profile) return;
      setSelections(profile.selections);
      setSavedCode(profile.skinTypeCode);
    });
  }, []);

  const skinTypeCode = useMemo(
    () => axisOrder.map((axisId) => selections[axisId] ?? '-').join(''),
    [selections],
  );
  const isComplete = axisOrder.every((axisId) => selections[axisId]);
  const result = isComplete ? getSkinTypeDetail(skinTypeCode) : undefined;

  const selectOption = (axisId: SkinMbtiAxisId, code: SkinMbtiOptionCode) => {
    setSelections((current) => ({
      ...current,
      [axisId]: code,
    }));
  };

  const saveProfile = async () => {
    if (!isComplete || !result) return;

    const selectedSkinTypeCode = skinTypeCode;
    const selectedSkinTypeDetail = skinTypeData[selectedSkinTypeCode];

    await saveSkinTypeProfile({
      skinTypeCode: selectedSkinTypeCode,
      skinTypeDetail: selectedSkinTypeDetail,
      selections: selections as SkinMbtiSelections,
    });
    setSavedCode(selectedSkinTypeCode);
    Alert.alert('피부 타입이 저장되었어요.');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>피부 MBTI</Text>
            <Text style={styles.title}>한 화면에서 빠르게 선택해요</Text>
          </View>
          <View style={styles.headerBadge}>
            <Ionicons name="sparkles-outline" color="#2F8EAD" size={20} />
          </View>
        </View>

        <View style={styles.selectorCard}>
          {skinAxes.map((axis) => (
            <View key={axis.id} style={styles.axisRow}>
              <Text style={styles.axisTitle}>{axis.title}</Text>
              <View style={styles.options}>
                {axis.options.map((option) => {
                  const selected = selections[axis.id] === option.code;

                  return (
                    <Pressable
                      key={option.code}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      onPress={() => selectOption(axis.id, option.code)}
                      style={({ pressed }) => [
                        styles.option,
                        selected && styles.selectedOption,
                        pressed && styles.pressed,
                      ]}
                    >
                      <Text style={[styles.optionCode, selected && styles.selectedText]}>{option.code}</Text>
                      <View style={styles.optionCopy}>
                        <Text style={[styles.optionLabel, selected && styles.selectedText]}>{option.label}</Text>
                        <Text style={[styles.optionHint, selected && styles.selectedHint]}>{option.hint}</Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.codeCard}>
          <Text style={styles.codeLabel}>나의 피부 타입</Text>
          <Text style={styles.codeValue}>{skinTypeCode}</Text>
          {savedCode ? <Text style={styles.savedText}>최근 저장: {savedCode}</Text> : null}
        </View>

        {result ? (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultCode}>{skinTypeCode}</Text>
              <Text style={styles.resultSummary}>{result.summary}</Text>
            </View>

            <View>
              <CompactInfo title="선크림 선택 기준" text={result.sunscreenRecommendation} />
              <CompactInfo title="주의할 성분/제형" text={result.avoidOrCaution} />
              <CompactInfo title="관리 포인트" text={result.carePoint} />
            </View>
          </View>
        ) : (
          <View style={styles.emptyResultCard}>
            <Text style={styles.emptyTitle}>4개 축을 모두 선택하면 결과가 표시돼요.</Text>
            <Text style={styles.emptyText}>D/O, S/R, P/N, W/T를 하나씩 골라주세요.</Text>
          </View>
        )}

        <PrimaryButton label="저장하기" onPress={saveProfile} disabled={!isComplete} />
      </ScrollView>
    </SafeAreaView>
  );
}

function CompactInfo({ title, text }: { title: string; text: string }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoTitle}>{title}</Text>
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#FFFDF5',
    flex: 1,
  },
  scrollContent: {
    gap: 9,
    padding: 16,
    paddingBottom: 28,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eyebrow: {
    color: '#3C93AD',
    fontSize: 13,
    fontWeight: '900',
  },
  title: {
    color: '#1E3036',
    fontSize: 23,
    fontWeight: '900',
    lineHeight: 28,
    marginTop: 2,
  },
  headerBadge: {
    alignItems: 'center',
    backgroundColor: '#EAF8FF',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  selectorCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#EAF4F6',
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
    padding: 10,
    shadowColor: '#9CCBDA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  axisRow: {
    gap: 6,
  },
  axisTitle: {
    color: '#41575D',
    fontSize: 13,
    fontWeight: '900',
  },
  options: {
    flexDirection: 'row',
    gap: 8,
  },
  option: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EA',
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    minHeight: 50,
    paddingHorizontal: 10,
  },
  selectedOption: {
    backgroundColor: '#FFF4BE',
    borderColor: '#AEE1F2',
  },
  pressed: {
    opacity: 0.82,
  },
  optionCode: {
    color: '#8B9397',
    fontSize: 20,
    fontWeight: '900',
    marginRight: 8,
    width: 22,
  },
  optionCopy: {
    flex: 1,
  },
  optionLabel: {
    color: '#26363A',
    fontSize: 15,
    fontWeight: '900',
  },
  optionHint: {
    color: '#96A0A3',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 1,
  },
  selectedText: {
    color: '#18586C',
  },
  selectedHint: {
    color: '#5F7379',
  },
  codeCard: {
    alignItems: 'center',
    backgroundColor: '#EAF8FF',
    borderColor: '#D3F0F8',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 62,
    paddingHorizontal: 16,
  },
  codeLabel: {
    color: '#3C93AD',
    fontSize: 14,
    fontWeight: '900',
  },
  codeValue: {
    color: '#162E36',
    fontSize: 34,
    fontWeight: '900',
    lineHeight: 38,
  },
  savedText: {
    color: '#A88400',
    fontSize: 11,
    fontWeight: '900',
    position: 'absolute',
    right: 16,
    top: 6,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#EFE6BF',
    borderRadius: 14,
    borderWidth: 1,
    minHeight: 190,
    padding: 12,
  },
  resultHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  resultCode: {
    color: '#182C33',
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 30,
  },
  resultSummary: {
    color: '#182C33',
    flex: 1,
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 20,
  },
  infoItem: {
    backgroundColor: '#FFF9DD',
    borderRadius: 10,
    marginBottom: 7,
    padding: 9,
  },
  infoTitle: {
    color: '#A07800',
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 3,
  },
  infoText: {
    color: '#56686D',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  emptyResultCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#EFEFEF',
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 190,
    padding: 18,
  },
  emptyTitle: {
    color: '#1E3036',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },
  emptyText: {
    color: '#879296',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 6,
    textAlign: 'center',
  },
});
