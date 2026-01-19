import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  TextInput,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../theme/useTheme';
import { authAPI } from '../../services/api';

interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  avatar?: string;
  points: number;
  isCurrentUser?: boolean;
}

const LeaderboardScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const theme = useTheme();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [currentUserName, setCurrentUserName] = useState<string>('');
  const [currentUserRank] = useState<number>(450);
  const [currentUserPoints] = useState<number>(320);

  // Kullanıcı bilgilerini yükle
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const user = await authAPI.getCurrentUser().catch(() => null);
        if (user && user.username) {
          setCurrentUserName(user.username);
        }
      } catch (error) {
        console.error('Error loading current user:', error);
      }
    };
    loadCurrentUser();
  }, []);

  // Şimdilik mock veri – backend hazır olduğunda API'den gelecek
  // İlk 20 kişi için mock veri
  const generateMockUsers = (count: number, startRank: number): LeaderboardUser[] => {
    const names = [
      'Andrew', 'Maryland', 'Charlotte', 'Florencio', 'Roselle', 'Darron', 'Clinton',
      'John', 'Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Daniel', 'Lisa',
      'Robert', 'Amanda', 'James', 'Michelle', 'William', 'Jennifer', 'Richard',
      'Nicole', 'Joseph', 'Ashley', 'Thomas', 'Stephanie', 'Christopher', 'Melissa'
    ];
    return Array.from({ length: count }, (_, i) => ({
      id: `user-${startRank + i}`,
      rank: startRank + i,
      name: names[(startRank + i - 1) % names.length] || `User ${startRank + i}`,
      points: Math.floor(Math.random() * 500) + 400,
    }));
  };

  const allUsers: LeaderboardUser[] = generateMockUsers(20, 1);

  // Arama filtresi
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) {
      return allUsers;
    }
    const query = searchQuery.toLowerCase();
    return allUsers.filter(user => 
      user.name.toLowerCase().includes(query)
    );
  }, [searchQuery, allUsers]);

  // Arama yapılıyorsa tüm sonuçları göster, yoksa normal görünüm
  const isSearching = searchQuery.trim().length > 0;
  
  const topThree = isSearching ? [] : filteredUsers.slice(0, 3);
  // İlk 20 kişi (top 3 podium'da, kalan 17 kişi listede - rank 4-20)
  const first20Users = isSearching ? filteredUsers : filteredUsers.slice(3, 21);
  
  // Kullanıcının kendi sırası için özel item (eğer ilk 20'de değilse ve arama yapılmıyorsa)
  const currentUserItem: LeaderboardUser | null = !isSearching && currentUserRank > 20 ? {
    id: 'current-user',
    rank: currentUserRank,
    name: currentUserName || t('leaderboard.you'),
    points: currentUserPoints,
    isCurrentUser: true,
  } : null;

  // List data: Arama yapılıyorsa tüm sonuçlar, yoksa ilk 20'den kalanlar + kullanıcının kendi sırası
  const listData = isSearching 
    ? filteredUsers 
    : (currentUserItem ? [...first20Users, currentUserItem] : first20Users);

  const renderListItem = ({
    item,
    index,
  }: {
    item: LeaderboardUser;
    index: number;
  }) => {
    const isCurrentUser = item.isCurrentUser || false;
    const isSeparatorBefore = isCurrentUser && index > 0;

    return (
      <View>
        {isSeparatorBefore && (
          <View style={styles.separatorContainer}>
            <View style={[styles.separatorLine, { backgroundColor: theme.colors.border.light }]} />
            <Text style={[styles.separatorText, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.medium }]}>
              {t('leaderboard.yourRank')}
            </Text>
            <View style={[styles.separatorLine, { backgroundColor: theme.colors.border.light }]} />
          </View>
        )}
        <TouchableOpacity
          onPress={() => {
            if (!isCurrentUser) {
              navigation.navigate('App', {
                screen: 'PeopleProfileDetails',
                params: { userId: item.id },
              });
            }
          }}
          activeOpacity={0.8}
          style={[
            styles.listItem, 
            { 
              backgroundColor: isCurrentUser 
                ? 'rgba(13, 156, 221, 0.1)' 
                : theme.colors.background.paper,
              borderWidth: isCurrentUser ? 2 : 0,
              borderColor: isCurrentUser ? '#0d9cdd' : 'transparent',
            }
          ]}
        >
          <Text style={[styles.listRank, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
            {item.rank}
          </Text>

          <View style={styles.listCenter}>
            <View
              style={[
                styles.listAvatar,
                { backgroundColor: isCurrentUser ? '#0d9cdd' : 'rgba(13, 156, 221, 0.1)' },
              ]}
            >
              <Text
                style={[
                  styles.listAvatarText,
                  { 
                    color: isCurrentUser ? '#FFFFFF' : '#0d9cdd', 
                    fontFamily: theme.typography.fontFamily.bold 
                  },
                ]}
              >
                {item.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text
              style={[styles.listName, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.medium }]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
          </View>

          <Text
            style={[styles.listPoints, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.semiBold }]}
          >
            {item.points} XP
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <SafeAreaView style={[styles.container, { backgroundColor: '#0d9cdd' }]} edges={['top']}>
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
                      name="trophy-outline"
                      size={18}
                      color="#0d9cdd"
                    />
                  </View>
                  <Text
                    style={[
                      styles.headerTitle,
                      {
                        color: '#FFFFFF',
                        fontFamily: theme.typography.fontFamily.bold,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {t('leaderboard.title')}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.searchButton}
                  onPress={() => setIsSearchVisible(true)}
                >
                  <Ionicons
                    name="search-outline"
                    size={22}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>
              </View>

              {/* Top 3 podium - sadece arama yapılmadığında göster */}
              {!isSearching && (
              <View style={styles.podiumWrapper}>
                <View style={styles.podiumBackground} />

                <View style={styles.podiumRow}>
                  {/* 2. kişi */}
                  <TouchableOpacity
                    style={styles.podiumColumn}
                    onPress={() =>
                      topThree[1] &&
                      navigation.navigate('App', {
                        screen: 'PeopleProfileDetails',
                        params: { userId: topThree[1].id },
                      })
                    }
                    activeOpacity={0.8}
                  >
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
                      <View style={[styles.podiumBlockInner, { backgroundColor: '#0d9cdd' }]}>
                        <Text style={styles.podiumBlockText}>2</Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  {/* 1. kişi */}
                  <TouchableOpacity
                    style={[styles.podiumColumn, styles.podiumColumnCenter]}
                    onPress={() =>
                      topThree[0] &&
                      navigation.navigate('App', {
                        screen: 'PeopleProfileDetails',
                        params: { userId: topThree[0].id },
                      })
                    }
                    activeOpacity={0.8}
                  >
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
                      <View style={[styles.podiumBlockInner, { backgroundColor: '#0d9cdd' }]}>
                        <Text style={styles.podiumBlockText}>1</Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  {/* 3. kişi */}
                  <TouchableOpacity
                    style={styles.podiumColumn}
                    onPress={() =>
                      topThree[2] &&
                      navigation.navigate('App', {
                        screen: 'PeopleProfileDetails',
                        params: { userId: topThree[2].id },
                      })
                    }
                    activeOpacity={0.8}
                  >
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
                      <View style={[styles.podiumBlockInner, { backgroundColor: '#0d9cdd' }]}>
                        <Text style={styles.podiumBlockText}>3</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              )}

            </>
          }
        />
      </SafeAreaView>

      {/* Arama Modal */}
      <Modal
        visible={isSearchVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsSearchVisible(false)}
      >
        <SafeAreaView style={styles.modalOverlay} edges={['top']}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background.default }]}>
            <View style={styles.searchHeader}>
              <TextInput
                style={[styles.searchInput, { 
                  color: theme.colors.text.primary,
                  borderColor: '#0d9cdd',
                  borderWidth: 1,
                  fontFamily: theme.typography.fontFamily.regular,
                }]}
                placeholder={t('common.search')}
                placeholderTextColor={theme.colors.text.secondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus={true}
              />
              <TouchableOpacity
                onPress={() => {
                  setIsSearchVisible(false);
                  setSearchQuery('');
                }}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>
            {searchQuery.trim().length > 0 && (
              <FlatList
                data={filteredUsers}
                keyExtractor={item => item.id}
                renderItem={renderListItem}
                contentContainerStyle={styles.searchResultsContent}
                style={styles.searchResultsList}
              />
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 4,
    paddingTop: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 12,
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
    flexShrink: 0,
  },
  headerTitle: {
    fontSize: 24,
    flexShrink: 1,
  },
  searchButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
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
    color: '#0d9cdd',
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
    color: '#0d9cdd',
  },
  podiumBlock: {
    width: '80%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  podiumBlockFirst: {
    height: 200,
  },
  podiumBlockSecond: {
    height: 170,
  },
  podiumBlockThird: {
    height: 150,
  },
  podiumBlockInner: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 16,
  },
  podiumBlockText: {
    fontSize: 40,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  listRank: {
    minWidth: 40,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 4,
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
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  separatorLine: {
    flex: 1,
    height: 1,
  },
  separatorText: {
    marginHorizontal: 12,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    zIndex: 1000,
    elevation: 1000,
  },
  modalContent: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  searchResultsList: {
    flex: 1,
    marginTop: 16,
  },
  searchResultsContent: {
    paddingBottom: 24,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  closeButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LeaderboardScreen;

