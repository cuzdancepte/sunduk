import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UnitDetailScreen from '../screens/UnitDetailScreen';
import LessonScreen from '../screens/LessonScreen';
import LevelDetailScreen from '../screens/LevelDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';

export type AppStackParamList = {
  LevelDetail: { levelId: string };
  UnitDetail: { unitId: string };
  Lesson: { lessonId: string };
  Settings: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#6200ee',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="LevelDetail"
        component={LevelDetailScreen}
        options={{ title: 'Seviye Detayı' }}
      />
      <Stack.Screen
        name="UnitDetail"
        component={UnitDetailScreen}
        options={{ title: 'Ünite Detayı' }}
      />
      <Stack.Screen
        name="Lesson"
        component={LessonScreen}
        options={{ title: 'Ders' }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Ayarlar' }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;

