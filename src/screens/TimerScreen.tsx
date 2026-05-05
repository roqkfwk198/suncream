import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { Card } from '../components/Card';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { SelectableChip } from '../components/SelectableChip';
import { activities, getActivityById } from '../data/activities';
import { cancelNotification, scheduleReapplyNotification } from '../services/notificationService';
import { clearTimer, loadTimer, saveTimer } from '../services/storage';
import { ActivityId, PersistedTimer, TimerStatus } from '../types';

const toSeconds = (minutes: number) => minutes * 60;

const formatTime = (seconds: number) => {
  const safeSeconds = Math.max(0, seconds);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const restSeconds = safeSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(restSeconds).padStart(2, '0')}`;
  }

  return `${minutes}:${String(restSeconds).padStart(2, '0')}`;
};

export function TimerScreen() {
  const [activityId, setActivityId] = useState<ActivityId>('daily');
  const [remainingSeconds, setRemainingSeconds] = useState(toSeconds(activities[0].minutes));
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [endAt, setEndAt] = useState<number | undefined>();
  const [notificationId, setNotificationId] = useState<string | undefined>();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const selectedActivity = useMemo(() => getActivityById(activityId), [activityId]);
  const durationSeconds = toSeconds(selectedActivity.minutes);

  const persist = useCallback(
    async (nextTimer: Partial<PersistedTimer>) => {
      await saveTimer({
        activityId,
        durationSeconds,
        remainingSeconds,
        status,
        endAt,
        notificationId,
        ...nextTimer,
      });
    },
    [activityId, durationSeconds, endAt, notificationId, remainingSeconds, status],
  );

  const finishTimer = useCallback(async () => {
    setStatus('finished');
    setRemainingSeconds(0);
    setEndAt(undefined);
    setNotificationId(undefined);
    await clearTimer();
    Alert.alert('SunCare Timer', '선크림을 다시 바를 시간이에요!');
  }, []);

  useEffect(() => {
    const restoreTimer = async () => {
      const saved = await loadTimer();
      if (!saved) return;

      const nextRemaining =
        saved.status === 'running' && saved.endAt
          ? Math.max(0, Math.ceil((saved.endAt - Date.now()) / 1000))
          : saved.remainingSeconds;

      setActivityId(saved.activityId);
      setRemainingSeconds(nextRemaining);
      setStatus(nextRemaining === 0 ? 'finished' : saved.status);
      setEndAt(saved.endAt);
      setNotificationId(saved.notificationId);

      if (saved.status === 'running' && nextRemaining === 0) {
        await finishTimer();
      }
    };

    restoreTimer();
  }, [finishTimer]);

  useEffect(() => {
    if (status !== 'running' || !endAt) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      const nextRemaining = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      setRemainingSeconds(nextRemaining);
      if (nextRemaining <= 0) {
        finishTimer();
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [endAt, finishTimer, status]);

  const selectActivity = async (nextActivityId: ActivityId) => {
    const nextActivity = getActivityById(nextActivityId);
    const nextDuration = toSeconds(nextActivity.minutes);
    await cancelNotification(notificationId);
    setActivityId(nextActivityId);
    setRemainingSeconds(nextDuration);
    setStatus('idle');
    setEndAt(undefined);
    setNotificationId(undefined);
    await saveTimer({
      activityId: nextActivityId,
      durationSeconds: nextDuration,
      remainingSeconds: nextDuration,
      status: 'idle',
    });
  };

  const startTimer = async () => {
    const nextEndAt = Date.now() + remainingSeconds * 1000;
    const nextNotificationId = await scheduleReapplyNotification(remainingSeconds);
    setStatus('running');
    setEndAt(nextEndAt);
    setNotificationId(nextNotificationId);
    await persist({ status: 'running', endAt: nextEndAt, notificationId: nextNotificationId });
  };

  const pauseTimer = async () => {
    const nextRemaining = endAt ? Math.max(0, Math.ceil((endAt - Date.now()) / 1000)) : remainingSeconds;
    await cancelNotification(notificationId);
    setStatus('paused');
    setRemainingSeconds(nextRemaining);
    setEndAt(undefined);
    setNotificationId(undefined);
    await persist({
      status: 'paused',
      remainingSeconds: nextRemaining,
      endAt: undefined,
      notificationId: undefined,
    });
  };

  const resetTimer = async () => {
    await cancelNotification(notificationId);
    setRemainingSeconds(durationSeconds);
    setStatus('idle');
    setEndAt(undefined);
    setNotificationId(undefined);
    await saveTimer({
      activityId,
      durationSeconds,
      remainingSeconds: durationSeconds,
      status: 'idle',
    });
  };

  return (
    <ScreenContainer>
      <View>
        <Text style={styles.title}>재도포 타이머</Text>
        <Text style={styles.subtitle}>활동에 맞춰 선크림을 다시 바를 시간을 알려드려요.</Text>
      </View>

      <Card>
        <Text style={styles.cardTitle}>현재 활동</Text>
        <View style={styles.chipGrid}>
          {activities.map((activity) => (
            <SelectableChip
              key={activity.id}
              label={activity.name}
              selected={activity.id === activityId}
              onPress={() => selectActivity(activity.id)}
            />
          ))}
        </View>
      </Card>

      <Card style={styles.timerCard}>
        <Text style={styles.activityName}>{selectedActivity.name}</Text>
        <Text style={styles.activityDescription}>{selectedActivity.description}</Text>
        <Text style={styles.timer}>{formatTime(remainingSeconds)}</Text>
        <Text style={styles.timerHint}>기본 설정: {selectedActivity.minutes}분</Text>

        <View style={styles.buttonRow}>
          {status === 'running' ? (
            <PrimaryButton label="일시정지" onPress={pauseTimer} variant="secondary" />
          ) : (
            <PrimaryButton
              label={status === 'paused' ? '재시작' : '시작'}
              onPress={startTimer}
              disabled={remainingSeconds <= 0}
            />
          )}
          <PrimaryButton label="초기화" onPress={resetTimer} variant="danger" />
        </View>
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
  timerCard: {
    alignItems: 'center',
    backgroundColor: '#EAF8FF',
  },
  activityName: {
    color: '#213B45',
    fontSize: 22,
    fontWeight: '900',
  },
  activityDescription: {
    color: '#5C7A7F',
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
  },
  timer: {
    color: '#236476',
    fontSize: 58,
    fontWeight: '900',
    marginTop: 24,
  },
  timerHint: {
    color: '#5C7A7F',
    fontSize: 14,
    marginBottom: 22,
    marginTop: 6,
  },
  buttonRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
});
