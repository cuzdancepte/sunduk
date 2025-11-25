import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { AppStackParamList } from '../navigation/AppStack';
import { contentAPI } from '../services/api';
import { Unit, Lesson } from '../types';

type RoutePropType = RouteProp<AppStackParamList, 'UnitDetail'>;

const UnitDetailScreen = () => {
  const route = useRoute<RoutePropType>();
  const navigation = useNavigation<any>();
  const { unitId } = route.params;
  const [unit, setUnit] = useState<Unit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUnit();
  }, [unitId]);

  const loadUnit = async () => {
    try {
      const data = await contentAPI.getUnit(unitId);
      setUnit(data);
    } catch (error: any) {
      Alert.alert('Hata', error.response?.data?.error || 'Ünite yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const renderLesson = ({ item }: { item: Lesson }) => {
    const translation = item.translations?.[0];
    const title = translation?.title || `Ders ${item.order}`;
    const isLocked = !item.isFree;

    return (
      <TouchableOpacity
        style={[styles.lessonCard, isLocked && styles.lockedCard]}
        onPress={() => {
          if (!isLocked) {
            navigation.navigate('App', {
              screen: 'Lesson',
              params: { lessonId: item.id },
            });
          } else {
            Alert.alert('Premium', 'Bu ders için abonelik gereklidir');
          }
        }}
      >
        <Text style={styles.lessonTitle}>{title}</Text>
        {isLocked && <Text style={styles.lockedText}>🔒 Premium</Text>}
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

  if (!unit) {
    return (
      <View style={styles.centerContainer}>
        <Text>Ünite bulunamadı</Text>
      </View>
    );
  }

  const translation = unit.translations?.[0];
  const unitTitle = translation?.title || unit.slug;
  const unitDescription = translation?.description;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{unitTitle}</Text>
        {unitDescription && (
          <Text style={styles.description}>{unitDescription}</Text>
        )}
      </View>
      <FlatList
        data={unit.lessons || []}
        renderItem={renderLesson}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  list: {
    padding: 16,
  },
  lessonCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lockedCard: {
    opacity: 0.6,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  lockedText: {
    fontSize: 12,
    color: '#6200ee',
    marginTop: 4,
  },
});

export default UnitDetailScreen;

