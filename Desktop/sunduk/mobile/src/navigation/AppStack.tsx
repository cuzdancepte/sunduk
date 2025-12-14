import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme/useTheme';
import UnitDetailScreen from '../screens/UnitDetailScreen';
import LessonScreen from '../screens/LessonScreen';
import ExamScreen from '../screens/ExamScreen';
import DialogDetailScreen from '../screens/DialogDetailScreen';
import LevelDetailScreen from '../screens/LevelDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LeaderboardScreen from '../screens/leaderboard/LeaderboardScreen';
import PeopleProfileDetailsScreen from '../screens/leaderboard/PeopleProfileDetailsScreen';
import PremiumScreen from '../screens/premium/PremiumScreen';
import ChooseSubscriptionPlanScreen from '../screens/premium/ChooseSubscriptionPlanScreen';
import SelectPaymentMethodScreen from '../screens/premium/SelectPaymentMethodScreen';
import SubscriptionSuccessScreen from '../screens/premium/SubscriptionSuccessScreen';
import PersonalInfoScreen from '../screens/settings/PersonalInfoScreen';
import NotificationSettingsScreen from '../screens/settings/NotificationSettingsScreen';
import AccessibilitySettingsScreen from '../screens/settings/AccessibilitySettingsScreen';
import SecuritySettingsScreen from '../screens/settings/SecuritySettingsScreen';
import HelpCenterFAQScreen from '../screens/settings/HelpCenterFAQScreen';
import HelpCenterSearchScreen from '../screens/settings/HelpCenterSearchScreen';
import HelpCenterContactScreen from '../screens/settings/HelpCenterContactScreen';
import AboutScreen from '../screens/settings/AboutScreen';
import LogoutModalScreen from '../screens/settings/LogoutModalScreen';
import LanguageSettingsScreen from '../screens/settings/LanguageSettingsScreen';

export type AppStackParamList = {
  LevelDetail: { levelId: string };
  UnitDetail: { unitId: string };
  Lesson: { lessonId: string };
  Exam: { examId: string };
  DialogDetail: { dialogId: string };
  Settings: undefined;
  Leaderboard: undefined;
  PeopleProfileDetails: { userId: string };
  Premium: undefined;
  ChooseSubscriptionPlan: { plan: string };
  SelectPaymentMethod: { planId: string };
  SubscriptionSuccess: { planId: string };
  PersonalInfo: undefined;
  NotificationSettings: undefined;
  AccessibilitySettings: undefined;
  SecuritySettings: undefined;
  LanguageSettings: undefined;
  HelpCenterFAQ: undefined;
  HelpCenterSearch: undefined;
  HelpCenterContact: undefined;
  About: undefined;
  LogoutModal: { visible: boolean };
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack = () => {
  const theme = useTheme();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.primary.main,
        },
        headerTintColor: theme.colors.primary.contrast,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontFamily: theme.typography.fontFamily.bold,
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
        name="Exam"
        component={ExamScreen}
        options={{ title: 'Sınav' }}
      />
      <Stack.Screen
        name="DialogDetail"
        component={DialogDetailScreen}
        options={{ title: 'Dialog' }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Ayarlar', headerShown: false }}
      />
      <Stack.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{ title: 'Liderlik Tablosu', headerShown: false }}
      />
      <Stack.Screen
        name="PeopleProfileDetails"
        component={PeopleProfileDetailsScreen}
        options={{ title: 'Profil Detayları' }}
      />
      <Stack.Screen
        name="Premium"
        component={PremiumScreen}
        options={{ title: 'Premium', headerShown: false }}
      />
      <Stack.Screen
        name="ChooseSubscriptionPlan"
        component={ChooseSubscriptionPlanScreen}
        options={{ title: 'Abonelik Planı' }}
      />
      <Stack.Screen
        name="SelectPaymentMethod"
        component={SelectPaymentMethodScreen}
        options={{ title: 'Ödeme Yöntemi' }}
      />
      <Stack.Screen
        name="SubscriptionSuccess"
        component={SubscriptionSuccessScreen}
        options={{ title: 'Başarılı', headerShown: false }}
      />
      <Stack.Screen
        name="PersonalInfo"
        component={PersonalInfoScreen}
        options={{ title: 'Kişisel Bilgiler' }}
      />
      <Stack.Screen
        name="NotificationSettings"
        component={NotificationSettingsScreen}
        options={{ title: 'Bildirimler' }}
      />
      <Stack.Screen
        name="AccessibilitySettings"
        component={AccessibilitySettingsScreen}
        options={{ title: 'Erişilebilirlik' }}
      />
      <Stack.Screen
        name="SecuritySettings"
        component={SecuritySettingsScreen}
        options={{ title: 'Güvenlik' }}
      />
      <Stack.Screen
        name="LanguageSettings"
        component={LanguageSettingsScreen}
        options={{ title: 'Dil Ayarları', headerShown: false }}
      />
      <Stack.Screen
        name="HelpCenterFAQ"
        component={HelpCenterFAQScreen}
        options={{ title: 'Yardım Merkezi' }}
      />
      <Stack.Screen
        name="HelpCenterSearch"
        component={HelpCenterSearchScreen}
        options={{ title: 'Arama' }}
      />
      <Stack.Screen
        name="HelpCenterContact"
        component={HelpCenterContactScreen}
        options={{ title: 'İletişim' }}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{ title: 'Hakkında' }}
      />
      <Stack.Screen
        name="LogoutModal"
        component={LogoutModalScreen}
        options={{ title: '', headerShown: false, presentation: 'transparentModal' }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
