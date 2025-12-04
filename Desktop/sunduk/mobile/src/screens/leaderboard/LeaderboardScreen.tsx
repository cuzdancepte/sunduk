import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../theme/useTheme';
import { AppStackParamList } from '../../navigation/AppStack';

type Props = NativeStackScreenProps<AppStackParamList, 'Leaderboard'>;

interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  avatar?: string;
  points: number;
}

const LeaderboardScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] =
    useState<'weekly' | 'monthly' | 'alltime'>('weekly');

  // Şimdilik mock veri – backend hazır olduğunda API'den gelecek
  const users: LeaderboardUser[] = [
    { id: '1', rank: 1, name: 'Andrew', points: 872 },
    { id: '2', rank: 2, name: 'Maryland', points: 948 },
    { id: '3', rank: 3, name: 'Charlotte', points: 769 },
    { id: '4', rank: 4, name: 'Florencio Doll...', points: 723 },
    { id: '5', rank: 5, name: 'Roselle Ehram', points: 640 },
    { id: '6', rank: 6, name: 'Darron Kulino...', points: 596 },
    { id: '7', rank: 7, name: 'Clinton Mcclure', points: 537 },
  ];

  const topThree = users.slice(0, 3);
  const listData = users.slice(3);

  const periods = [
    { key: 'weekly' as const, label: t('leaderboard.weekly') },
    { key: 'monthly' as const, label: t('leaderboard.monthly') },
    { key: 'alltime' as const, label: t('leaderboard.allTime') },
  ];

  const renderListItem = ({
    item,
    index,
  }: {
    item: LeaderboardUser;
    index: number;
  }) => {
    const isLast = index === listData.length - 1;

    return (
      <View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('PeopleProfileDetails', { userId: item.id })
          }
          activeOpacity={0.8}
          style={styles.listItem}
        >
          <Text style={[styles.listRank, { color: theme.colors.grey[800] }]}>
            {item.rank}
          </Text>

          <View style={styles.listCenter}>
            <View
              style={[
                styles.listAvatar,
                { backgroundColor: theme.colors.primary.light + '20' },
              ]}
            >
              <Text
                style={[
                  styles.listAvatarText,
                  { color: theme.colors.primary.main },
                ]}
              >
                {item.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text
              style={[styles.listName, { color: theme.colors.grey[900] }]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
          </View>

          <Text
            style={[styles.listPoints, { color: theme.colors.grey[900] }]}
          >
            {item.points} XP
          </Text>
        </TouchableOpacity>
        {!isLast && (
          <View
            style={[styles.divider, { backgroundColor: theme.colors.grey[200] }]}
          />
        )}
      </View>
    );
  };

  const gradient = theme.gradients.purple;

  return (
    <LinearGradient
      colors={gradient.colors}
      start={gradient.start}
      end={gradient.end}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <FlatList
          data={listData}
          keyExtractor={item => item.id}
          renderItem={renderListItem}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <View style={styles.logoBox}>
                    <Ionicons
                      name="happy-outline"
                      size={18}
                      color={theme.colors.primary.main}
                    />
                  </View>
                  <Text
                    style={[
                      styles.headerTitle,
                      {
                        color: theme.colors.text.white,
                        fontFamily: theme.typography.fontFamily.bold,
                      },
                    ]}
                  >
                    {t('leaderboard.title')}
                  </Text>
                </View>
                <TouchableOpacity style={styles.searchButton}>
                  <Ionicons
                    name="search"
                    size={22}
                    color={theme.colors.text.white}
                  />
                </TouchableOpacity>
              </View>

              {/* Period chips */}
              <View style={styles.chipRow}>
                {periods.map(period => {
                  const isActive = selectedPeriod === period.key;
                  return (
                    <TouchableOpacity
                      key={period.key}
                      activeOpacity={0.9}
                      onPress={() => setSelectedPeriod(period.key)}
                      style={[
                        styles.chip,
                        isActive
                          ? styles.chipActive
                          : styles.chipInactive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          {
                            color: isActive
                              ? theme.colors.primary.main
                              : theme.colors.text.white,
                            fontFamily:
                              theme.typography.fontFamily.bold,
                          },
                        ]}
                      >
                        {period.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Top 3 podium */}
              <View style={styles.podiumWrapper}>
                <View style={styles.podiumBackground} />

                <View style={styles.podiumRow}>
                  {/* 2. kişi */}
                  <View style={styles.podiumColumn}>
                    <View style={styles.avatarWrapper}>
                      <View style={styles.avatarOuter}>
                        <Text style={styles.avatarInitial}>
                          {topThree[1]?.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={[styles.rankBadge, styles.rankBadgeSecond]}>
                        <Text style={styles.rankBadgeText}>2</Text>
                      </View>
                    </View>
                    <Text style={styles.podiumName}>
                      {topThree[1]?.name}
                    </Text>
                    <View style={styles.xpChip}>
                      <Text style={styles.xpChipText}>
                        {topThree[1]?.points} XP
                      </Text>
                    </View>
                    <View style={[styles.podiumBlock, styles.podiumBlockSecond]}>
                      <Text style={styles.podiumBlockText}>2</Text>
                    </View>
                  </View>

                  {/* 1. kişi */}
                  <View style={[styles.podiumColumn, styles.podiumColumnCenter]}>
                    <View style={styles.avatarWrapper}>
                      <View style={styles.avatarOuter}>
                        <Text style={styles.avatarInitial}>
                          {topThree[0]?.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={[styles.rankBadge, styles.rankBadgeFirst]}>
                        <Text style={styles.rankBadgeText}>1</Text>
                      </View>
                    </View>
                    <Text style={styles.podiumName}>
                      {topThree[0]?.name}
                    </Text>
                    <View style={styles.xpChip}>
                      <Text style={styles.xpChipText}>
                        {topThree[0]?.points} XP
                      </Text>
                    </View>
                    <View style={[styles.podiumBlock, styles.podiumBlockFirst]}>
                      <Text style={styles.podiumBlockText}>1</Text>
                    </View>
                  </View>

                  {/* 3. kişi */}
                  <View style={styles.podiumColumn}>
                    <View style={styles.avatarWrapper}>
                      <View style={styles.avatarOuter}>
                        <Text style={styles.avatarInitial}>
                          {topThree[2]?.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={[styles.rankBadge, styles.rankBadgeThird]}>
                        <Text style={styles.rankBadgeText}>3</Text>
                      </View>
                    </View>
                    <Text style={styles.podiumName}>
                      {topThree[2]?.name}
                    </Text>
                    <View style={styles.xpChip}>
                      <Text style={styles.xpChipText}>
                        {topThree[2]?.points} XP
                      </Text>
                    </View>
                    <View
                      style={[styles.podiumBlock, styles.podiumBlockThird]}
                    >
                      <Text style={styles.podiumBlockText}>3</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* List container header */}
              <View style={styles.listContainer}>
                {/* boş – satırlar renderItem ile gelecek */}
              </View>
            </>
          }
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  logoBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
  },
  searchButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  chip: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: '#FFFFFF',
  },
  chipInactive: {
    backgroundColor: 'transparent',
  },
  chipText: {
    fontSize: 18,
  },
  podiumWrapper: {
    marginBottom: 32,
  },
  podiumBackground: {
    position: 'absolute',
    left: -40,
    right: -40,
    top: 40,
    height: 220,
    borderTopLeftRadius: 220,
    borderTopRightRadius: 220,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  podiumRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  podiumColumn: {
    flex: 1,
    alignItems: 'center',
  },
  podiumColumnCenter: {
    marginHorizontal: 16,
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 28,
    color: '#6949FF',
    fontWeight: '700',
  },
  rankBadge: {
    position: 'absolute',
    bottom: -10,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadgeFirst: {
    backgroundColor: '#FFC02D',
  },
  rankBadgeSecond: {
    backgroundColor: '#B2C0DB',
  },
  rankBadgeThird: {
    backgroundColor: '#D79961',
  },
  rankBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  podiumName: {
    marginTop: 16,
    marginBottom: 6,
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  xpChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  xpChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6949FF',
  },
  podiumBlock: {
    width: '80%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 16,
  },
  podiumBlockFirst: {
    height: 200,
    backgroundColor: '#8B7AFF',
  },
  podiumBlockSecond: {
    height: 170,
    backgroundColor: '#7F6BF4',
  },
  podiumBlockThird: {
    height: 150,
    backgroundColor: '#7F6BF4',
  },
  podiumBlockText: {
    fontSize: 40,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  listContainer: {
    marginTop: 24,
    marginBottom: 12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#FAFAFA',
    height: 0,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  listRank: {
    width: 32,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  listCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  listAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listAvatarText: {
    fontSize: 20,
    fontWeight: '700',
  },
  listName: {
    fontSize: 20,
    fontWeight: '700',
  },
  listPoints: {
    fontSize: 18,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    width: '100%',
  },
});

export default LeaderboardScreen;

