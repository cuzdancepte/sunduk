import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/onboarding/SplashScreen';
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import LanguageSelectionScreen from '../screens/onboarding/LanguageSelectionScreen';
import LearningLanguageScreen from '../screens/onboarding/LearningLanguageScreen';
import ProfilePromptScreen from '../screens/onboarding/ProfilePromptScreen';
import NameScreen from '../screens/onboarding/NameScreen';
import EmailScreen from '../screens/onboarding/EmailScreen';
import PasswordScreen from '../screens/onboarding/PasswordScreen';
import SuccessScreen from '../screens/onboarding/SuccessScreen';

export type OnboardingStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  LanguageSelection: undefined;
  LearningLanguage: undefined;
  ProfilePrompt: undefined;
  Name: undefined;
  Email: { name: string };
  Password: { name: string; email: string };
  Success: undefined;
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

const OnboardingStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Splash"
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
      <Stack.Screen name="LearningLanguage" component={LearningLanguageScreen} />
      <Stack.Screen name="ProfilePrompt" component={ProfilePromptScreen} />
      <Stack.Screen name="Name" component={NameScreen} />
      <Stack.Screen name="Email" component={EmailScreen} />
      <Stack.Screen name="Password" component={PasswordScreen} />
      <Stack.Screen name="Success" component={SuccessScreen} />
    </Stack.Navigator>
  );
};

export default OnboardingStack;

