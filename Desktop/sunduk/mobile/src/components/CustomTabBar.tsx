import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { HomeIcon, LeaderboardIcon, DialogIcon, ProfileIcon } from './icons/TabIcons';
import { useTheme, useThemeContext } from '../theme/useTheme';

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const theme = useTheme();
  const { isDarkMode } = useThemeContext();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.tabBar, 
      { 
        paddingBottom: Math.max(insets.bottom, 8),
        backgroundColor: theme.colors.background.default,
        overflow: 'hidden',
      }
    ]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined
          ? options.tabBarLabel
          : options.title !== undefined
          ? options.title
          : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name as any);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        // Icon ve color belirleme
        let IconComponent;
        const iconSize = 24;
        const activeColor = '#6949FF';
        const inactiveColor = '#9E9E9E';
        const iconColor = isFocused ? activeColor : inactiveColor;

        if (route.name === 'Home') {
          IconComponent = <HomeIcon size={iconSize} color={iconColor} />;
        } else if (route.name === 'Leaderboard') {
          IconComponent = <LeaderboardIcon size={iconSize} color={iconColor} />;
        } else if (route.name === 'Dialog') {
          IconComponent = <DialogIcon size={iconSize} color={iconColor} />;
        } else if (route.name === 'Profile') {
          IconComponent = <ProfileIcon size={iconSize} color={iconColor} />;
        }

        // Label text'leri
        const labelTexts: { [key: string]: string } = {
          Home: t('tabs.home'),
          Leaderboard: t('tabs.leaderboard'),
          Dialog: t('tabs.dialog'),
          Profile: t('tabs.profile'),
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[
              styles.tabItem,
              index > 0 && styles.tabItemWithMargin, // İlk item hariç margin ekle
            ]}
            activeOpacity={0.7}
          >
            {IconComponent}
            <Text
              style={[
                styles.tabLabel,
                {
                  color: iconColor,
                  fontFamily: isFocused
                    ? theme.typography.fontFamily.bold
                    : theme.typography.fontFamily.medium,
                  fontWeight: isFocused ? '700' : '500',
                },
              ]}
            >
              {labelTexts[route.name] || String(label)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    paddingTop: 8,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 82,
    gap: 19, // Tab'lar arası gap: 19px
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8, // Icon ve text arası gap: 8px
    paddingVertical: 0,
  },
  tabItemWithMargin: {
    // marginLeft: 19, // Tab'lar arası gap - gap kullanıldığı için gerek yok
  },
  tabLabel: {
    fontSize: 10,
    letterSpacing: 0.2,
    marginTop: 0,
    textAlign: 'center',
  },
});

export default CustomTabBar;

