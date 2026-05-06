import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { UvInfo } from '../types';

const hourlyForecast = [
  { time: '00:00', uv: 0 },
  { time: '01:00', uv: 0 },
  { time: '02:00', uv: 0 },
  { time: '03:00', uv: 0 },
  { time: '04:00', uv: 0 },
  { time: '05:00', uv: 1 },
  { time: '06:00', uv: 1 },
  { time: '07:00', uv: 2 },
  { time: '08:00', uv: 3 },
  { time: '09:00', uv: 4 },
  { time: '10:00', uv: 5 },
  { time: '11:00', uv: 6 },
  { time: '12:00', uv: 8 },
  { time: '13:00', uv: 9 },
  { time: '14:00', uv: 8 },
  { time: '15:00', uv: 6 },
  { time: '16:00', uv: 4 },
  { time: '17:00', uv: 3 },
  { time: '18:00', uv: 1 },
  { time: '19:00', uv: 0 },
  { time: '20:00', uv: 0 },
  { time: '21:00', uv: 0 },
  { time: '22:00', uv: 0 },
  { time: '23:00', uv: 0 },
];

type UvHomeDashboardProps = {
  city?: string;
  loading?: boolean;
  notice?: string;
  uvInfo?: UvInfo | null;
};

const getUvRisk = (uv: number) => {
  if (uv <= 2) return '낮음';
  if (uv <= 5) return '보통';
  if (uv <= 7) return '높음';
  if (uv <= 10) return '매우 높음';
  return '위험';
};

const getSpf = (uv: number) => {
  if (uv >= 6) return 'SPF 50+';
  if (uv >= 3) return 'SPF 30+';
  return 'SPF 15+';
};

const formatHour = (date: Date) => `${String(date.getHours()).padStart(2, '0')}:00`;

export function UvHomeDashboard({ city = '서울', loading, notice, uvInfo }: UvHomeDashboardProps) {
  const currentUvIndex = uvInfo?.index ?? 7;
  const currentRisk = getUvRisk(currentUvIndex);
  const maxUv = Math.max(...hourlyForecast.map((item) => item.uv));
  const currentHour = formatHour(new Date());
  const recommendedSpf = getSpf(currentUvIndex);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerLabel}>현재 자외선 지수</Text>
          <Text style={styles.city}>{city}</Text>
        </View>

        <View style={styles.circleCard}>
          {loading ? (
            <ActivityIndicator color="#D1A400" />
          ) : (
            <>
              <Text style={styles.uvNumber}>{currentUvIndex}</Text>
              <Text style={styles.uvLabel}>UV INDEX</Text>
              <View style={styles.riskBadge}>
                <Text style={styles.riskText}>⚠️ {currentRisk}</Text>
              </View>
            </>
          )}
        </View>

        {notice ? <Text style={styles.notice}>{notice}</Text> : null}

        <View style={styles.forecastSection}>
          <Text style={styles.sectionTitle}>시간대별 예보</Text>
          <View style={styles.forecastCard}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hourlyContent}
            >
              {hourlyForecast.map((item) => {
                const isHighest = item.uv === maxUv;
                const isCurrent = item.time === currentHour;

                return (
                  <View
                    key={item.time}
                    style={[
                      styles.hourItem,
                      isHighest && styles.highestHourItem,
                      isCurrent && styles.currentHourItem,
                    ]}
                  >
                    <Text style={[styles.hourUv, (isHighest || isCurrent) && styles.emphasisText]}>{item.uv}</Text>
                    <Text style={[styles.hourTime, (isHighest || isCurrent) && styles.emphasisText]}>{item.time}</Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>

        <View style={styles.bottomCards}>
          <View style={styles.smallCard}>
            <Text style={styles.smallLabel}>오늘의 최고</Text>
            <Text style={styles.smallValue}>{maxUv}</Text>
          </View>
          <View style={styles.smallCard}>
            <Text style={styles.smallLabel}>권장 차단 지수</Text>
            <Text style={styles.smallValue}>{recommendedSpf}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#F7F4E9',
    flex: 1,
  },
  content: {
    gap: 24,
    padding: 24,
    paddingBottom: 36,
  },
  header: {
    alignItems: 'center',
    gap: 6,
    paddingTop: 8,
  },
  headerLabel: {
    color: '#2E332D',
    fontSize: 22,
    fontWeight: '900',
  },
  city: {
    color: '#8E8A78',
    fontSize: 14,
    fontWeight: '700',
  },
  circleCard: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 140,
    height: 260,
    justifyContent: 'center',
    shadowColor: '#6B6243',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.12,
    shadowRadius: 30,
    width: 260,
  },
  uvNumber: {
    color: '#24281F',
    fontSize: 86,
    fontWeight: '900',
    lineHeight: 96,
  },
  uvLabel: {
    color: '#A59F87',
    fontSize: 13,
    fontWeight: '900',
    marginTop: 2,
  },
  riskBadge: {
    backgroundColor: '#F3EBA8',
    borderRadius: 20,
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  riskText: {
    color: '#5F5418',
    fontSize: 15,
    fontWeight: '900',
  },
  notice: {
    color: '#8A846C',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
    marginTop: -8,
    textAlign: 'center',
  },
  forecastSection: {
    gap: 12,
  },
  sectionTitle: {
    color: '#2E332D',
    fontSize: 20,
    fontWeight: '900',
  },
  forecastCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 16,
    shadowColor: '#6B6243',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.09,
    shadowRadius: 24,
  },
  hourlyContent: {
    gap: 10,
    paddingHorizontal: 16,
  },
  hourItem: {
    alignItems: 'center',
    backgroundColor: '#FAFAF6',
    borderColor: '#EEEBDD',
    borderRadius: 18,
    borderWidth: 1,
    gap: 8,
    height: 86,
    justifyContent: 'center',
    width: 66,
  },
  highestHourItem: {
    backgroundColor: '#F3EBA8',
    borderColor: '#E8D96C',
  },
  currentHourItem: {
    borderColor: '#C9B743',
    borderWidth: 2,
  },
  hourUv: {
    color: '#2E332D',
    fontSize: 25,
    fontWeight: '800',
  },
  hourTime: {
    color: '#9D9782',
    fontSize: 12,
    fontWeight: '700',
  },
  emphasisText: {
    color: '#3D3610',
    fontWeight: '900',
  },
  bottomCards: {
    flexDirection: 'row',
    gap: 14,
  },
  smallCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    flex: 1,
    minHeight: 118,
    padding: 18,
    shadowColor: '#6B6243',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.09,
    shadowRadius: 24,
  },
  smallLabel: {
    color: '#8E8A78',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 19,
  },
  smallValue: {
    color: '#2E332D',
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 36,
    marginTop: 12,
  },
});
