export type UvRiskLevel = '낮음' | '보통' | '높음' | '매우 높음' | '위험';

export type UvInfo = {
  index: number;
  risk: UvRiskLevel;
  message: string;
};

export type ActivityId =
  | 'daily'
  | 'workout'
  | 'swimming'
  | 'hiking'
  | 'rest'
  | 'indoor'
  | 'sweaty';

export type Activity = {
  id: ActivityId;
  name: string;
  minutes: number;
  description: string;
};

export type SkinTypeId =
  | 'dry'
  | 'oily'
  | 'combination'
  | 'sensitive'
  | 'acne'
  | 'dehydratedOily'
  | 'redness'
  | 'pigmentation'
  | 'atopic'
  | 'male'
  | 'outdoor';

export type SkinType = {
  id: SkinTypeId;
  label: string;
};

export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished';

export type PersistedTimer = {
  activityId: ActivityId;
  durationSeconds: number;
  remainingSeconds: number;
  status: TimerStatus;
  endAt?: number;
  notificationId?: string;
};

export type RootTabParamList = {
  홈: undefined;
  타이머: undefined;
  '피부 설정': undefined;
  추천: undefined;
  세안법: undefined;
};
