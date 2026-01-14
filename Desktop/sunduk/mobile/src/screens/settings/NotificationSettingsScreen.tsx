import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Switch } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../theme/useTheme';
import { Card } from '../../components/ui';
import { AppStackParamList } from '../../navigation/AppStack';
import BackButton from '../../components/BackButton';

type Props = NativeStackScreenProps<AppStackParamList, 'NotificationSettings'>;

const NotificationSettingsScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [dailyReminders, setDailyReminders] = useState(true);
  const [achievements, setAchievements] = useState(true);
  const [streakReminders, setStreakReminders] = useState(true);
  const [lessonReminders, setLessonReminders] = useState(false);
  const [marketing, setMarketing] = useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.default }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <BackButton width={28} height={28} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
          {t('settings.notification')}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card variant="default" padding="medium" style={styles.settingCard}>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.semiBold }]}>
              {t('notifications.dailyReminders')}
            </Text>
            <Text style={[styles.settingDescription, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
              {t('notifications.dailyRemindersDesc')}
            </Text>
          </View>
          <Switch value={dailyReminders} onValueChange={setDailyReminders} trackColor={{ false: '#E0E0E0', true: '#0d9cdd' }} thumbColor="#FFFFFF" />
        </Card>

        <Card variant="default" padding="medium" style={styles.settingCard}>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.semiBold }]}>
              {t('notifications.achievements')}
            </Text>
            <Text style={[styles.settingDescription, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
              {t('notifications.achievementsDesc')}
            </Text>
          </View>
          <Switch value={achievements} onValueChange={setAchievements} trackColor={{ false: '#E0E0E0', true: '#0d9cdd' }} thumbColor="#FFFFFF" />
        </Card>

        <Card variant="default" padding="medium" style={styles.settingCard}>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.semiBold }]}>
              {t('notifications.streakReminders')}
            </Text>
            <Text style={[styles.settingDescription, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
              {t('notifications.streakRemindersDesc')}
            </Text>
          </View>
          <Switch value={streakReminders} onValueChange={setStreakReminders} trackColor={{ false: '#E0E0E0', true: '#0d9cdd' }} thumbColor="#FFFFFF" />
        </Card>

        <Card variant="default" padding="medium" style={styles.settingCard}>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.semiBold }]}>
              {t('notifications.lessonReminders')}
            </Text>
            <Text style={[styles.settingDescription, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
              {t('notifications.lessonRemindersDesc')}
            </Text>
          </View>
          <Switch value={lessonReminders} onValueChange={setLessonReminders} trackColor={{ false: '#E0E0E0', true: '#0d9cdd' }} thumbColor="#FFFFFF" />
        </Card>

        <Card variant="default" padding="medium" style={styles.settingCard}>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.semiBold }]}>
              {t('notifications.marketing')}
            </Text>
            <Text style={[styles.settingDescription, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
              {t('notifications.marketingDesc')}
            </Text>
          </View>
          <Switch value={marketing} onValueChange={setMarketing} trackColor={{ false: '#E0E0E0', true: '#0d9cdd' }} thumbColor="#FFFFFF" />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16 },
  backButton: { width: 28, height: 28, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  placeholder: { width: 28 },
  scrollContent: { padding: 24, paddingBottom: 40, gap: 12 },
  settingCard: { marginBottom: 0 },
  settingContent: { flex: 1, marginRight: 16 },
  settingTitle: { fontSize: 16, marginBottom: 4 },
  settingDescription: { fontSize: 14 },
});

export default NotificationSettingsScreen;

