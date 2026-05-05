import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';

import { CleansingScreen } from './src/screens/CleansingScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { RecommendationScreen } from './src/screens/RecommendationScreen';
import { SkinTypeScreen } from './src/screens/SkinTypeScreen';
import { TimerScreen } from './src/screens/TimerScreen';
import { RootTabParamList } from './src/types';

const Tab = createBottomTabNavigator<RootTabParamList>();

const iconByRoute: Record<keyof RootTabParamList, keyof typeof Ionicons.glyphMap> = {
  홈: 'sunny',
  타이머: 'timer',
  '피부 설정': 'options',
  추천: 'sparkles',
  세안법: 'water',
};

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#2E9DBD',
          tabBarInactiveTintColor: '#7A989F',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '700',
          },
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopColor: '#DDEFE8',
            height: 68,
            paddingBottom: 10,
            paddingTop: 8,
          },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={iconByRoute[route.name]} color={color} size={size} />
          ),
        })}
      >
        <Tab.Screen name="홈" component={HomeScreen} />
        <Tab.Screen name="타이머" component={TimerScreen} />
        <Tab.Screen name="피부 설정" component={SkinTypeScreen} />
        <Tab.Screen name="추천" component={RecommendationScreen} />
        <Tab.Screen name="세안법" component={CleansingScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
