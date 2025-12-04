import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Switch } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/useTheme';
import { Card } from '../../components/ui';
import { AppStackParamList } from '../../navigation/AppStack';

type Props = NativeStackScreenProps<AppStackParamList, 'NotificationSettings'>;

const NotificationSettingsScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [dailyReminders, setDailyReminders] = useState(true);
  const [achievements, setAchievements] = useState(true);
  const [streakReminders, setStreakReminders] = useState(true);
  const [lessonReminders, setLessonReminders] = useState(false);
  const [marketing, setMarketing] = useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.default }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
          Bildirimler
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card variant="default" padding="medium" style={styles.settingCard}>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.semiBold }]}>
              Günlük Hatırlatmalar
            </Text>
            <Text style={[styles.settingDescription, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
              Her gün öğrenmeye devam etmen için hatırlatma
            </Text>
          </View>
          <Switch value={dailyReminders} onValueChange={setDailyReminders} trackColor={{ false: theme.colors.grey[400], true: theme.colors.primary.main }} thumbColor={theme.colors.text.white} />
        </Card>

        <Card variant="default" padding="medium" style={styles.settingCard}>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.semiBold }]}>
              Rozet Bildirimleri
            </Text>
            <Text style={[styles.settingDescription, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
              Yeni rozet kazandığında bildirim al
            </Text>
          </View>
          <Switch value={achievements} onValueChange={setAchievements} trackColor={{ false: theme.colors.grey[400], true: theme.colors.primary.main }} thumbColor={theme.colors.text.white} />
        </Card>

        <Card variant="default" padding="medium" style={styles.settingCard}>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.semiBold }]}>
              Seri Hatırlatmaları
            </Text>
            <Text style={[styles.settingDescription, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
              Serini korumak için hatırlatma
            </Text>
          </View>
          <Switch value={streakReminders} onValueChange={setStreakReminders} trackColor={{ false: theme.colors.grey[400], true: theme.colors.primary.main }} thumbColor={theme.colors.text.white} />
        </Card>

        <Card variant="default" padding="medium" style={styles.settingCard}>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.semiBold }]}>
              Ders Hatırlatmaları
            </Text>
            <Text style={[styles.settingDescription, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
              Yeni dersler hakkında bildirim
            </Text>
          </View>
          <Switch value={lessonReminders} onValueChange={setLessonReminders} trackColor={{ false: theme.colors.grey[400], true: theme.colors.primary.main }} thumbColor={theme.colors.text.white} />
        </Card>

        <Card variant="default" padding="medium" style={styles.settingCard}>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.semiBold }]}>
              Pazarlama Bildirimleri
            </Text>
            <Text style={[styles.settingDescription, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
              Özel teklifler ve güncellemeler
            </Text>
          </View>
          <Switch value={marketing} onValueChange={setMarketing} trackColor={{ false: theme.colors.grey[400], true: theme.colors.primary.main }} thumbColor={theme.colors.text.white} />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  placeholder: { width: 40 },
  scrollContent: { padding: 20, paddingBottom: 40, gap: 12 },
  settingCard: { marginBottom: 0 },
  settingContent: { flex: 1, marginRight: 16 },
  settingTitle: { fontSize: 16, marginBottom: 4 },
  settingDescription: { fontSize: 14 },
});

export default NotificationSettingsScreen;

