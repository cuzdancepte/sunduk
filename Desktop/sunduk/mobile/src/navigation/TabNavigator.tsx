import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../theme/useTheme';
import HomeScreen from '../screens/HomeScreen';
import LeaderboardScreen from '../screens/leaderboard/LeaderboardScreen';
import DialogScreen from '../screens/DialogScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CustomTabBar from '../components/CustomTabBar';

export type TabParamList = {
  Home: undefined;
  Leaderboard: undefined;
  Dialog: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  const theme = useTheme();
  
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background.default,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 'auto',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />
      <Tab.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
      />
      <Tab.Screen
        name="Dialog"
        component={DialogScreen}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
