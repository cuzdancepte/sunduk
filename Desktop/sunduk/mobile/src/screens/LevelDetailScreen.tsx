import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { AppStackParamList } from '../navigation/AppStack';
import { contentAPI } from '../services/api';
import { Level, Unit } from '../types';
import { useTheme } from '../theme/useTheme';
import { Card, Badge, LoadingSpinner, EmptyState } from '../components/ui';

type RoutePropType = RouteProp<AppStackParamList, 'LevelDetail'>;

const LevelDetailScreen = () => {
  const theme = useTheme();
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

  const renderUnit = ({ item, index }: { item: Unit; index: number }) => {
    const translation = item.translations?.[0];
    const lessonCount = item.lessons?.length || 0;
    const title = translation?.title || item.slug;

    // İlk ünite her zaman aktif
    const isFirstUnit = index === 0;

    // Önceki ünite tamamlanmış mı kontrol et (tüm dersleri tamamlanmış olmalı)
    const previousUnit = level.units?.[index - 1];
    const isPreviousUnitCompleted = previousUnit
      ? previousUnit.lessons?.every((lesson: any) => lesson.completion?.completed) || false
      : true; // İlk ünite için true

    // Aktif olması için: ilk ünite olmalı VEYA önceki ünite tamamlanmış olmalı
    const isActive = isFirstUnit || isPreviousUnitCompleted;

    return (
      <TouchableOpacity
        onPress={() => {
          if (isActive) {
            navigation.navigate('UnitDetail', { unitId: item.id });
          } else {
            Alert.alert('Kilitli', 'Önceki üniteyi tamamlamalısınız');
          }
        }}
        disabled={!isActive}
        style={{ marginBottom: theme.spacing.lg }}
      >
        <Card
          variant="elevated"
          padding="large"
          style={[
            !isActive && {
              opacity: 0.5,
              backgroundColor: theme.colors.grey[100],
            },
          ]}
        >
          <View style={styles.unitHeader}>
            <Text
              style={[
                styles.unitTitle,
                {
                  color: isActive ? theme.colors.text.primary : theme.colors.text.disabled,
                  fontFamily: theme.typography.fontFamily.semiBold,
                },
              ]}
            >
              {title}
            </Text>
            <Badge label={`${lessonCount} Ders`} variant="primary" size="small" />
          </View>
          {translation?.description && (
            <Text
              style={[
                styles.unitDescription,
                {
                  color: isActive ? theme.colors.text.secondary : theme.colors.text.disabled,
                  fontFamily: theme.typography.fontFamily.regular,
                },
              ]}
              numberOfLines={2}
            >
              {translation.description}
            </Text>
          )}
          {!isActive && (
            <Text
              style={[
                styles.lockedText,
                {
                  color: theme.colors.text.disabled,
                  fontFamily: theme.typography.fontFamily.regular,
                },
              ]}
            >
              🔒 Kilitli
            </Text>
          )}
        </Card>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Yükleniyor..." />;
  }

  if (!level) {
    return (
      <EmptyState
        title="Seviye bulunamadı"
        description="Lütfen tekrar deneyin"
      />
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background.light }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { backgroundColor: theme.colors.primary.main }]}>
        <Text style={[styles.levelCode, { color: theme.colors.text.white, fontFamily: theme.typography.fontFamily.bold }]}>
          {level.code}
        </Text>
        <Text style={[styles.levelSubtitle, { color: theme.colors.text.white, fontFamily: theme.typography.fontFamily.regular }]}>
          {level.units?.length || 0} Ünite
        </Text>
      </View>

      {level.units && level.units.length > 0 ? (
        <FlatList
          data={level.units}
          renderItem={({ item, index }) => renderUnit({ item, index })}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={[styles.list, { padding: theme.spacing.lg }]}
        />
      ) : (
        <EmptyState
          title="Bu seviyede henüz ünite yok"
          description="Yakında üniteler eklenecek"
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  levelCode: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  levelSubtitle: {
    fontSize: 16,
    opacity: 0.9,
  },
  list: {
    // Padding handled inline with theme
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
    flex: 1,
  },
  unitDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  lockedText: {
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default LevelDetailScreen;

