import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { contentAPI } from '../services/api';
import { Level } from '../types';
import { useTheme } from '../theme/useTheme';
import { Card, Badge, LoadingSpinner, EmptyState } from '../components/ui';

const LearnScreen = () => {
  const theme = useTheme();
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
        onPress={() => {
          navigation.navigate('App', {
            screen: 'LevelDetail',
            params: { levelId: item.id },
          });
        }}
        style={{ marginBottom: theme.spacing.lg }}
      >
        <Card variant="elevated" padding="large">
          <View style={styles.levelHeader}>
            <Text style={[styles.levelCode, { color: theme.colors.primary.main, fontFamily: theme.typography.fontFamily.bold }]}>
              {item.code}
            </Text>
            <Badge label={`${unitCount} Ünite`} variant="primary" size="small" />
          </View>
          {translation && (
            <Text style={[styles.levelDescription, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]} numberOfLines={2}>
              {translation.title}
            </Text>
          )}
        </Card>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Yükleniyor..." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.light }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.background.default, borderBottomColor: theme.colors.border.light }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
          Öğren
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
          Seviyeleri keşfet ve öğrenmeye başla
        </Text>
      </View>
      {levels.length === 0 ? (
        <EmptyState
          title="Henüz seviye eklenmemiş"
          description="Yakında seviyeler eklenecek"
        />
      ) : (
        <FlatList
          data={levels}
          renderItem={renderLevel}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.list, { padding: theme.spacing.lg }]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  list: {
    // Padding handled inline with theme
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
  },
  levelDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default LearnScreen;

