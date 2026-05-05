import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const setupNotifications = async () => {
  const permission = await Notifications.requestPermissionsAsync();

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('suncare-timer', {
      name: 'SunCare Timer',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#F9C74F',
    });
  }

  return permission.granted || permission.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
};

export const scheduleReapplyNotification = async (seconds: number) => {
  const granted = await setupNotifications();
  if (!granted) return undefined;

  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'SunCare Timer',
      body: '선크림을 다시 바를 시간이에요!',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: Math.max(1, Math.floor(seconds)),
      channelId: 'suncare-timer',
    },
  });
};

export const cancelNotification = async (notificationId?: string) => {
  if (notificationId) {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }
};
