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
import { useNavigation } from '@react-navigation/native';
import { contentAPI } from '../services/api';
import { Level } from '../types';

const LearnScreen = () => {
  const navigation = useNavigation<any>();
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLevels();
  }, []);

  const loadLevels = async () => {
    try {
      const data = await contentAPI.getLevels();
      setLevels(data);
    } catch (error: any) {
      Alert.alert('Hata', error.response?.data?.error || 'Seviyeler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const renderLevel = ({ item }: { item: Level }) => {
    const unitCount = item.units?.length || 0;
    const translation = item.units?.[0]?.translations?.[0];
    
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
        <View style={styles.levelHeader}>
          <Text style={styles.levelCode}>{item.code}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unitCount} Ünite</Text>
          </View>
        </View>
        {translation && (
          <Text style={styles.levelDescription} numberOfLines={2}>
            {translation.title}
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Öğren</Text>
        <Text style={styles.headerSubtitle}>Seviyeleri keşfet ve öğrenmeye başla</Text>
      </View>
      {levels.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Henüz seviye eklenmemiş</Text>
        </View>
      ) : (
        <FlatList
          data={levels}
          renderItem={renderLevel}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
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
  list: {
    padding: 16,
  },
  levelCard: {
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
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelCode: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  badge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6200ee',
  },
  levelDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default LearnScreen;

