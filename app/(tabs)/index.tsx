import { UvHomeDashboard } from '@/src/components/UvHomeDashboard';

export default function HomeScreen() {
  return <UvHomeDashboard city="서울" uvInfo={{ index: 7, risk: '높음', message: '자외선 차단이 필요한 시간대예요.' }} />;
}
