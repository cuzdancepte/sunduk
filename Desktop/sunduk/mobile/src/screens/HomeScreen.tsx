import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { contentAPI } from '../services/api';
import { Level, UserProgress } from '../types';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const { isAuthenticated } = useAuth();
  const [levels, setLevels] = useState<Level[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [levelsData, progressData] = await Promise.all([
        contentAPI.getLevels(),
        contentAPI.getUserProgress().catch(() => null),
      ]);
      setLevels(levelsData);
      setProgress(progressData);
    } catch (error: any) {
      Alert.alert('Hata', error.response?.data?.error || 'Veriler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const renderLevel = ({ item }: { item: Level }) => {
    const unitCount = item.units?.length || 0;
    return (
      <TouchableOpacity
        style={styles.levelCard}
        onPress={() => {
          navigation.navigate('App', {
            screen: 'LevelDetail',
            params: { levelId: item.id },
          });
        }}
      >
        <View style={styles.levelCardContent}>
          <Text style={styles.levelCode}>{item.code}</Text>
          <Text style={styles.unitCount}>{unitCount} Ünite</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Welcome Card */}
      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeTitle}>Hoş Geldin! 👋</Text>
        <Text style={styles.welcomeSubtitle}>
          Bugün Türkçe öğrenmeye devam edelim
        </Text>
      </View>

      {/* Continue Learning Card */}
      {progress?.currentLessonId && (
        <TouchableOpacity
          style={styles.continueCard}
          onPress={() => {
            if (progress.currentLessonId) {
              navigation.navigate('App', {
                screen: 'Lesson',
                params: { lessonId: progress.currentLessonId },
              });
            }
          }}
        >
          <View style={styles.continueCardContent}>
            <Text style={styles.continueTitle}>Devam Et</Text>
            <Text style={styles.continueSubtitle}>Kaldığın yerden devam et</Text>
          </View>
          <View style={styles.continueIcon}>
            <Text style={styles.continueIconText}>→</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Levels Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Seviyeler</Text>
        {levels.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Henüz seviye eklenmemiş</Text>
          </View>
        ) : (
          <FlatList
            data={levels}
            renderItem={renderLevel}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.levelsGrid}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeCard: {
    backgroundColor: '#6200ee',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  continueCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  continueCardContent: {
    flex: 1,
  },
  continueTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  continueSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  continueIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueIconText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  levelsGrid: {
    paddingHorizontal: 16,
  },
  levelCard: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  levelCardContent: {
    padding: 20,
    alignItems: 'center',
  },
  levelCode: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 8,
  },
  unitCount: {
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default HomeScreen;
