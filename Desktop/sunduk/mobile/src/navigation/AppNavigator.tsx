import React, { useEffect, useState, useCallback } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../theme/useTheme';
import AuthStack from './AuthStack';
import OnboardingStack from './OnboardingStack';
import TabNavigator from './TabNavigator';
import AppStack from './AppStack';

const RootStack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const theme = useTheme();
  const navigationRef = useNavigationContainerRef();
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);

  const checkOnboardingStatus = useCallback(async () => {
    try {
      // Onboarding durumu sadece AsyncStorage üzerinden kontrol ediliyor
      const completed = await AsyncStorage.getItem('onboarding_completed');
      setOnboardingCompleted(completed === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setOnboardingCompleted(false);
    }
  }, []);

  useEffect(() => {
    checkOnboardingStatus();
    
    // Her 500ms'de bir kontrol et (onboarding tamamlandığında state'i güncellemek için)
    const interval = setInterval(() => {
      checkOnboardingStatus();
    }, 500);

    return () => clearInterval(interval);
  }, [checkOnboardingStatus]);

  if (isLoading || onboardingCompleted === null) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background.default }]}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      {!onboardingCompleted ? (
        <OnboardingStack />
      ) : isAuthenticated ? (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="Tabs" component={TabNavigator} />
          <RootStack.Screen name="App" component={AppStack} />
        </RootStack.Navigator>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppNavigator;
