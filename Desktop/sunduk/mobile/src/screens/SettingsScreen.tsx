import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../theme/useTheme';
import { AppStackParamList } from '../navigation/AppStack';

type Props = NativeStackScreenProps<AppStackParamList, 'Settings'>;

interface SettingsItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBgColor: string;
  screen?: keyof AppStackParamList;
  onPress?: () => void;
  hasToggle?: boolean;
}

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { currentLanguage, availableLanguages } = useLanguage();
  const [darkMode, setDarkMode] = useState(false);
  
  // Seçili dilin adını bul
  const currentLanguageName = availableLanguages.find(
    (lang) => lang.code === currentLanguage
  )?.name || 'English';

  const settingsItems: SettingsItem[] = [
    {
      id: 'personal-info',
      title: t('settings.personalInfo'),
      icon: 'person-outline',
      iconColor: '#FF9800',
      iconBgColor: '#FFF3E0',
      screen: 'PersonalInfo',
    },
    {
      id: 'notifications',
      title: t('settings.notification'),
      icon: 'notifications-outline',
      iconColor: '#F44336',
      iconBgColor: '#FFEBEE',
      screen: 'NotificationSettings',
    },
    {
      id: 'general',
      title: t('settings.general'),
      icon: 'grid-outline',
      iconColor: '#6949FF',
      iconBgColor: 'rgba(105,73,255,0.08)',
    },
    {
      id: 'app-language',
      title: t('settings.appLanguage'),
      icon: 'language-outline',
      iconColor: '#2196F3',
      iconBgColor: 'rgba(33,150,243,0.08)',
      screen: 'LanguageSettings',
    },
    {
      id: 'accessibility',
      title: t('settings.accessibility'),
      icon: 'accessibility-outline',
      iconColor: '#FF9800',
      iconBgColor: '#FFF3E0',
      screen: 'AccessibilitySettings',
    },
    {
      id: 'security',
      title: t('settings.security'),
      icon: 'shield-checkmark-outline',
      iconColor: '#4CAF50',
      iconBgColor: '#E8F5E9',
      screen: 'SecuritySettings',
    },
    {
      id: 'find-friends',
      title: t('settings.findFriends'),
      icon: 'people-outline',
      iconColor: '#FF9800',
      iconBgColor: 'rgba(255,152,0,0.08)',
    },
    {
      id: 'dark-mode',
      title: t('settings.darkMode'),
      icon: 'eye-outline',
      iconColor: '#246BFD',
      iconBgColor: 'rgba(36,107,253,0.08)',
      hasToggle: true,
    },
    {
      id: 'help-center',
      title: t('settings.helpCenter'),
      icon: 'help-circle-outline',
      iconColor: '#4CAF50',
      iconBgColor: '#E8F5E9',
      screen: 'HelpCenterFAQ',
    },
    {
      id: 'about',
      title: t('settings.aboutElingo'),
      icon: 'information-circle-outline',
      iconColor: '#9C27B0',
      iconBgColor: '#F3E5F5',
      screen: 'About',
    },
    {
      id: 'logout',
      title: t('settings.logout'),
      icon: 'log-out-outline',
      iconColor: '#F75555',
      iconBgColor: 'rgba(247,85,85,0.08)',
      onPress: () =>
        navigation.navigate('LogoutModal', {
          visible: true,
        }),
    },
  ];

  const handleItemPress = (item: SettingsItem) => {
    if (item.screen) {
      navigation.navigate(item.screen);
    } else if (item.onPress) {
      item.onPress();
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.default },
      ]}
      edges={['top']}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back-outline"
            size={24}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.headerTitle,
            {
              color: theme.colors.text.primary,
              fontFamily: theme.typography.fontFamily.bold,
            },
          ]}
        >
          {t('settings.title')}
        </Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Settings Items */}
        <View style={styles.settingsList}>
          {settingsItems.map(item => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleItemPress(item)}
              activeOpacity={0.7}
              style={styles.settingsItem}
            >
              <View style={styles.itemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: item.iconBgColor }]}>
                  <Ionicons name={item.icon} size={22} color={item.iconColor} />
                </View>
                <Text
                  style={[
                    styles.itemTitle,
                    {
                      color:
                        item.id === 'logout'
                          ? theme.colors.error.main
                          : theme.colors.text.primary,
                      fontFamily: theme.typography.fontFamily.bold,
                    },
                  ]}
                >
                  {item.title}
                </Text>
              </View>
              {item.hasToggle ? (
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  trackColor={{
                    false: '#EEEEEE',
                    true: theme.colors.primary.main,
                  }}
                  thumbColor="#FFFFFF"
                />
              ) : item.id !== 'logout' ? (
                <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
              ) : null}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerPlaceholder: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  settingsList: {
    gap: 16,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 20,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 20,
  },
});

export default SettingsScreen;
