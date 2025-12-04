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
import { contentAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { UserProgress } from '../types';
import { useTheme } from '../theme/useTheme';
import { Card, LoadingSpinner, Badge } from '../components/ui';

const ProfileScreen = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLessons: 0,
    totalPoints: 0,
    currentStreak: 0,
    level: 1,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const progressData = await contentAPI.getUserProgress().catch(() => null);
      setProgress(progressData);
      
      // TODO: API'den gerçek istatistikleri al
      // Şimdilik mock data
      setStats({
        totalLessons: 25,
        totalPoints: 1250,
        currentStreak: 4,
        level: 5,
      });
    } catch (error: any) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigation.navigate('App', {
      screen: 'LogoutModal',
      params: { visible: true },
    });
  };

  if (loading) {
    return <LoadingSpinner fullScreen text={t('common.loading')} />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.default }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
          {t('profile.title')}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <Card variant="elevated" padding="large" style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={[styles.avatarContainer, { backgroundColor: theme.colors.primary.main }]}>
              <Text style={[styles.avatarText, { color: theme.colors.text.white, fontFamily: theme.typography.fontFamily.bold }]}>
                K
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.username, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
                {t('profile.user')}
              </Text>
              <Text style={[styles.userEmail, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
                kullanici@example.com
              </Text>
              <Badge label={`${t('profile.level')} ${stats.level}`} variant="primary" size="small" style={styles.levelBadge} />
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('App', { screen: 'PersonalInfo' })}
              style={styles.editButton}
            >
              <Ionicons name="create-outline" size={20} color={theme.colors.primary.main} />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <Card variant="default" padding="medium" style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: theme.colors.warning.light + '20' }]}>
              <Ionicons name="flame" size={24} color={theme.colors.warning.main} />
            </View>
            <Text style={[styles.statValue, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
              {stats.currentStreak}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
              {t('profile.dailyStreak')}
            </Text>
          </Card>

          <Card variant="default" padding="medium" style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: theme.colors.warning.light + '20' }]}>
              <Ionicons name="star" size={24} color={theme.colors.warning.main} />
            </View>
            <Text style={[styles.statValue, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
              {stats.totalPoints}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
              {t('profile.totalPoints')}
            </Text>
          </Card>

          <Card variant="default" padding="medium" style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: theme.colors.info.light + '20' }]}>
              <Ionicons name="book" size={24} color={theme.colors.info.main} />
            </View>
            <Text style={[styles.statValue, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
              {stats.totalLessons}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
              {t('profile.completedLessons')}
            </Text>
          </Card>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <TouchableOpacity
            onPress={() => navigation.navigate('App', { screen: 'Leaderboard' })}
            style={styles.menuItem}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconContainer, { backgroundColor: theme.colors.primary.light + '20' }]}>
                <Ionicons name="trophy" size={20} color={theme.colors.primary.main} />
              </View>
              <Text style={[styles.menuItemText, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.medium }]}>
                {t('profile.leaderboard')}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('App', { screen: 'Premium' })}
            style={styles.menuItem}
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

          <TouchableOpacity
            onPress={() => navigation.navigate('App', { screen: 'Settings' })}
            style={styles.menuItem}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconContainer, { backgroundColor: theme.colors.grey[200] }]}>
                <Ionicons name="settings-outline" size={20} color={theme.colors.text.primary} />
              </View>
              <Text style={[styles.menuItemText, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.medium }]}>
                {t('profile.settings')}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('App', { screen: 'HelpCenterFAQ' })}
            style={styles.menuItem}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIconContainer, { backgroundColor: theme.colors.grey[200] }]}>
                <Ionicons name="help-circle-outline" size={20} color={theme.colors.text.primary} />
              </View>
              <Text style={[styles.menuItemText, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.medium }]}>
                {t('profile.helpCenter')}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          style={[styles.logoutButton, { borderColor: theme.colors.error.main }]}
        >
          <Ionicons name="log-out-outline" size={20} color={theme.colors.error.main} />
          <Text style={[styles.logoutText, { color: theme.colors.error.main, fontFamily: theme.typography.fontFamily.semiBold }]}>
            {t('profile.logout')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  profileCard: {
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  editButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  menuSection: {
    marginBottom: 24,
    gap: 8,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
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
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
  },
});

export default ProfileScreen;
