import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { contentAPI, authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { UserProgress } from '../types';
import { useTheme } from '../theme/useTheme';
import { Card, LoadingSpinner, Badge } from '../components/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ProfileScreen = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState(1);
  const [userData, setUserData] = useState<any>(null);
  const [birthDate, setBirthDate] = useState<Date | null>(null);

  const getLocale = () => {
    const lang = i18n.language || 'tr';
    if (lang.startsWith('tr')) return 'tr-TR';
    if (lang.startsWith('ru')) return 'ru-RU';
    return 'en-US';
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const progressData = await contentAPI.getUserProgress().catch(() => null);
      setProgress(progressData);
      
      // Kullanıcı bilgilerini yükle
      const user = await authAPI.getCurrentUser().catch(() => null);
      if (user) {
        setUserData(user);
        // createdAt'i Date'e çevir
        if (user.createdAt) {
          // createdAt zaten string olarak geliyor
        }
      }
      
      // TODO: API'den gerçek level ve doğum tarihi bilgisini al
      // Şimdilik mock data
      setLevel(5);
      // Doğum tarihi şimdilik null, API'den gelecek
    } catch (error: any) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatJoinDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(getLocale(), {
        year: 'numeric',
        month: 'long',
      });
    } catch {
      return '';
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text={t('common.loading')} />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.default }]} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Cover Photo Area */}
        <View style={[styles.coverPhotoContainer, { backgroundColor: '#90EE90' }]}>
          {/* Settings Button - Top Right */}
          <TouchableOpacity
            onPress={() => navigation.navigate('App', { screen: 'Settings' })}
            style={[styles.settingsButton, { top: insets.top + 16, right: 16 }]}
            activeOpacity={0.7}
          >
            <Ionicons name="settings-outline" size={24} color="#333333" />
          </TouchableOpacity>
        </View>

        {/* User Info Section */}
        <View style={styles.userInfoSection}>
          <Text style={[styles.userName, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
            {userData?.username || t('profile.user')}
          </Text>
          
          {birthDate && (
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={16} color={theme.colors.text.secondary} />
              <Text style={[styles.infoText, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
                {t('profile.birthDate')}: {birthDate.toLocaleDateString(getLocale(), {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
          )}
          
          {userData?.createdAt && (
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={16} color={theme.colors.text.secondary} />
              <Text style={[styles.infoText, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
                {t('profile.joinDate')} {formatJoinDate(userData.createdAt)}
              </Text>
            </View>
          )}
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <TouchableOpacity
            onPress={() => navigation.navigate('App', { screen: 'Premium' })}
            style={[styles.menuItem, { backgroundColor: theme.colors.background.paper }]}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconContainer, { backgroundColor: theme.colors.warning.light + '20' }]}>
                <Ionicons name="diamond" size={20} color={theme.colors.warning.main} />
              </View>
              <Text style={[styles.menuItemText, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.medium }]}>
                {t('profile.goPremium')}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  coverPhotoContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  settingsButton: {
    position: 'absolute',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    zIndex: 10,
  },
  userInfoSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    gap: 12,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
  },
  menuSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 8,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
  },
});

export default ProfileScreen;
