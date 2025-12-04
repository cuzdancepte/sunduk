import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/useTheme';
import { Card, Badge } from '../../components/ui';
import { AppStackParamList } from '../../navigation/AppStack';

type Props = NativeStackScreenProps<AppStackParamList, 'PeopleProfileDetails'>;

const PeopleProfileDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const theme = useTheme();
  const { userId } = route.params;

  // Mock data - gerçek uygulamada API'den gelecek
  const userData = {
    id: userId,
    name: 'Ahmet Yılmaz',
    avatar: null,
    rank: 1,
    points: 12500,
    level: 25,
    streak: 15,
    totalLessons: 150,
    completedUnits: 45,
    achievements: [
      { id: '1', title: 'İlk Ders', icon: '🎯', unlockedAt: '2024-01-15' },
      { id: '2', title: '7 Günlük Seri', icon: '🔥', unlockedAt: '2024-02-01' },
      { id: '3', title: '100 Ders', icon: '📚', unlockedAt: '2024-03-10' },
    ],
    languages: [
      { code: 'tr', name: 'Türkçe', level: 'İleri', flag: '🇹🇷' },
      { code: 'en', name: 'İngilizce', level: 'Orta', flag: '🇬🇧' },
    ],
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.default }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
          Profil Detayları
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <Card variant="default" padding="large" style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={[styles.avatarContainer, { backgroundColor: theme.colors.primary.main }]}>
              <Text style={[styles.avatarText, { color: theme.colors.text.white, fontFamily: theme.typography.fontFamily.bold }]}>
                {userData.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankIcon}>🥇</Text>
                <Text style={[styles.rankText, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
                  #{userData.rank}
                </Text>
              </View>
              <Text style={[styles.userName, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
                {userData.name}
              </Text>
              <Badge label={`Seviye ${userData.level}`} variant="primary" size="medium" />
            </View>
          </View>
        </Card>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <Card variant="default" padding="medium" style={styles.statCard}>
            <Ionicons name="star" size={24} color={theme.colors.warning.main} />
            <Text style={[styles.statValue, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
              {userData.points.toLocaleString()}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
              Toplam Puan
            </Text>
          </Card>

          <Card variant="default" padding="medium" style={styles.statCard}>
            <Ionicons name="flame" size={24} color={theme.colors.warning.main} />
            <Text style={[styles.statValue, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
              {userData.streak}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
              Günlük Seri
            </Text>
          </Card>

          <Card variant="default" padding="medium" style={styles.statCard}>
            <Ionicons name="book" size={24} color={theme.colors.info.main} />
            <Text style={[styles.statValue, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
              {userData.totalLessons}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
              Tamamlanan Ders
            </Text>
          </Card>
        </View>

        {/* Achievements */}
        <Card variant="default" padding="large" style={styles.sectionCard}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
            Rozetler
          </Text>
          <View style={styles.achievementsList}>
            {userData.achievements.map((achievement) => (
              <View key={achievement.id} style={styles.achievementItem}>
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <View style={styles.achievementInfo}>
                  <Text style={[styles.achievementTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.semiBold }]}>
                    {achievement.title}
                  </Text>
                  <Text style={[styles.achievementDate, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
                    {new Date(achievement.unlockedAt).toLocaleDateString('tr-TR')}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Card>

        {/* Languages */}
        <Card variant="default" padding="large" style={styles.sectionCard}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
            Öğrenilen Diller
          </Text>
          <View style={styles.languagesList}>
            {userData.languages.map((lang) => (
              <View key={lang.code} style={styles.languageItem}>
                <Text style={styles.languageFlag}>{lang.flag}</Text>
                <View style={styles.languageInfo}>
                  <Text style={[styles.languageName, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.semiBold }]}>
                    {lang.name}
                  </Text>
                  <Text style={[styles.languageLevel, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
                    {lang.level}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Card>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  profileCard: {
    marginBottom: 20,
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
    gap: 8,
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rankIcon: {
    fontSize: 20,
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  sectionCard: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  achievementsList: {
    gap: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  achievementIcon: {
    fontSize: 32,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: 12,
  },
  languagesList: {
    gap: 12,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  languageFlag: {
    fontSize: 32,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    marginBottom: 4,
  },
  languageLevel: {
    fontSize: 12,
  },
});

export default PeopleProfileDetailsScreen;

