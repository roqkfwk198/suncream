import { Activity } from '../types';

export const activities: Activity[] = [
  { id: 'daily', name: '일상 외출', minutes: 120, description: '가벼운 외출과 이동이 있는 날' },
  { id: 'workout', name: '운동', minutes: 90, description: '땀과 마찰이 생기기 쉬운 활동' },
  { id: 'swimming', name: '수영', minutes: 60, description: '물에 닿는 시간이 많은 활동' },
  { id: 'hiking', name: '등산/야외활동', minutes: 90, description: '햇빛 노출이 긴 야외 일정' },
  { id: 'rest', name: '휴식', minutes: 150, description: '그늘이나 실내외를 오가는 여유로운 날' },
  { id: 'indoor', name: '실내 업무', minutes: 180, description: '창가나 짧은 외출이 있는 실내 생활' },
  { id: 'sweaty', name: '땀이 많은 활동', minutes: 60, description: '땀으로 선크림이 지워지기 쉬운 상황' },
];

export const getActivityById = (id: Activity['id']) =>
  activities.find((activity) => activity.id === id) ?? activities[0];
