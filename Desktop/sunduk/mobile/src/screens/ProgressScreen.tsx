import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { contentAPI } from '../services/api';
import { UserProgress } from '../types';

const ProgressScreen = () => {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const data = await contentAPI.getUserProgress();
      setProgress(data);
    } catch (error: any) {
      Alert.alert('Hata', error.response?.data?.error || 'İlerleme yüklenemedi');
    } finally {
      setLoading(false);
    }
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>İlerleme</Text>
        <Text style={styles.headerSubtitle}>Öğrenme yolculuğun</Text>
      </View>

      {/* Statistics Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Tamamlanan Ders</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Toplam Puan</Text>
        </View>
      </View>

      {/* Current Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mevcut Durum</Text>
        <View style={styles.progressCard}>
          {progress?.currentLessonId ? (
            <>
              <Text style={styles.progressTitle}>Devam Ediyor</Text>
              <Text style={styles.progressText}>
                Ders ID: {progress.currentLessonId}
              </Text>
            </>
          ) : (
            <Text style={styles.progressText}>Henüz ders başlatılmadı</Text>
          )}
          {progress?.completedAt && (
            <Text style={styles.progressDate}>
              Son tamamlanma: {new Date(progress.completedAt).toLocaleDateString('tr-TR')}
            </Text>
          )}
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Başarılar</Text>
        <View style={styles.achievementsCard}>
          <Text style={styles.achievementsText}>
            Henüz rozet kazanılmadı
          </Text>
        </View>
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
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  progressDate: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  achievementsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementsText: {
    fontSize: 16,
    color: '#999',
  },
});

export default ProgressScreen;

