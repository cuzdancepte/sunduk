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
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { AppStackParamList } from '../navigation/AppStack';
import { contentAPI } from '../services/api';
import { Level, Unit } from '../types';

type RoutePropType = RouteProp<AppStackParamList, 'LevelDetail'>;

const LevelDetailScreen = () => {
  const route = useRoute<RoutePropType>();
  const navigation = useNavigation<any>();
  const { levelId } = route.params;
  const [level, setLevel] = useState<Level | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLevel();
  }, [levelId]);

  const loadLevel = async () => {
    try {
      // Get all levels and find the one we need
      const levels = await contentAPI.getLevels();
      const foundLevel = levels.find((l) => l.id === levelId);
      if (foundLevel) {
        setLevel(foundLevel);
      } else {
        Alert.alert('Hata', 'Seviye bulunamadı');
      }
    } catch (error: any) {
      Alert.alert('Hata', error.response?.data?.error || 'Seviye yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const renderUnit = ({ item }: { item: Unit }) => {
    const translation = item.translations?.[0];
    const lessonCount = item.lessons?.length || 0;
    const title = translation?.title || item.slug;

    return (
      <TouchableOpacity
        style={styles.unitCard}
        onPress={() => {
          navigation.navigate('UnitDetail', { unitId: item.id });
        }}
      >
        <View style={styles.unitHeader}>
          <Text style={styles.unitTitle}>{title}</Text>
          <View style={styles.lessonBadge}>
            <Text style={styles.lessonBadgeText}>{lessonCount} Ders</Text>
          </View>
        </View>
        {translation?.description && (
          <Text style={styles.unitDescription} numberOfLines={2}>
            {translation.description}
          </Text>
        )}
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

  if (!level) {
    return (
      <View style={styles.centerContainer}>
        <Text>Seviye bulunamadı</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.levelCode}>{level.code}</Text>
        <Text style={styles.levelSubtitle}>
          {level.units?.length || 0} Ünite
        </Text>
      </View>

      {level.units && level.units.length > 0 ? (
        <FlatList
          data={level.units}
          renderItem={renderUnit}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Bu seviyede henüz ünite yok</Text>
        </View>
      )}
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
    backgroundColor: '#6200ee',
    padding: 24,
    alignItems: 'center',
  },
  levelCode: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  levelSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  list: {
    padding: 16,
  },
  unitCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  unitTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  lessonBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  lessonBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6200ee',
  },
  unitDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
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

export default LevelDetailScreen;

