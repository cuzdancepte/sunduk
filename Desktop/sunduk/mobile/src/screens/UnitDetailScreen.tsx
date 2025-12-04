import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { AppStackParamList } from '../navigation/AppStack';
import { contentAPI } from '../services/api';
import { Unit, Lesson } from '../types';
import { useTheme } from '../theme/useTheme';
import { Card, Badge, LoadingSpinner, EmptyState } from '../components/ui';

type RoutePropType = RouteProp<AppStackParamList, 'UnitDetail'>;

const UnitDetailScreen = () => {
  const theme = useTheme();
  const route = useRoute<RoutePropType>();
  const navigation = useNavigation<any>();
  const { unitId } = route.params;
  const [unit, setUnit] = useState<Unit | null>(null);
  const [loading, setLoading] = useState(true);

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

  // Sayfa her açıldığında (focus olduğunda) verileri yenile
  useFocusEffect(
    useCallback(() => {
      loadUnit();
    }, [unitId])
  );

  const renderLesson = ({ item, index }: { item: Lesson; index: number }) => {
    const translation = item.translations?.[0];
    const title = translation?.title || `Ders ${item.order}`;
    const isLocked = !item.isFree;
    const isCompleted = item.completion?.completed || false;
    
    // İlk ders her zaman aktif
    const isFirstLesson = index === 0;
    
    // Önceki ders tamamlanmış mı kontrol et
    const previousLesson = unit.lessons?.[index - 1];
    const isPreviousLessonCompleted = previousLesson?.completion?.completed || false;
    
    // Aktif olması için: ilk ders olmalı VEYA önceki ders tamamlanmış olmalı
    const isActive = isFirstLesson || isPreviousLessonCompleted;
    
    // Devre dışı bırakılması için: aktif değilse VEYA kilitliyse
    const isDisabled = !isActive || isLocked;

    return (
      <TouchableOpacity
        onPress={() => {
          if (isDisabled) {
            if (!isActive) {
              Alert.alert('Kilitli', 'Önceki dersi tamamlamalısınız');
            } else if (isLocked) {
              Alert.alert('Premium', 'Bu ders için abonelik gereklidir');
            }
          } else {
            navigation.navigate('App', {
              screen: 'Lesson',
              params: { lessonId: item.id },
            });
          }
        }}
        disabled={isDisabled}
        style={{ marginBottom: theme.spacing.md }}
      >
        <Card
          variant="elevated"
          padding="medium"
          style={[
            isLocked && { opacity: 0.6 },
            isCompleted && {
              borderWidth: 2,
              borderColor: theme.colors.success.main,
              backgroundColor: `${theme.colors.success.main}10`,
            },
            !isActive && {
              opacity: 0.5,
              backgroundColor: theme.colors.grey[100],
            },
          ]}
        >
          <View style={styles.lessonHeader}>
            <Text
              style={[
                styles.lessonTitle,
                {
                  color: isActive ? theme.colors.text.primary : theme.colors.text.disabled,
                  fontFamily: theme.typography.fontFamily.semiBold,
                },
              ]}
            >
              {title}
            </Text>
            {isCompleted && (
              <View style={[styles.completedBadge, { backgroundColor: theme.colors.success.main }]}>
                <Text style={[styles.completedIcon, { color: theme.colors.text.white }]}>✓</Text>
              </View>
            )}
          </View>
          {!isActive && (
            <Text style={[styles.lockedText, { color: theme.colors.text.disabled, fontFamily: theme.typography.fontFamily.regular }]}>
              🔒 Kilitli
            </Text>
          )}
          {isLocked && (
            <Badge label="Premium" variant="warning" size="small" style={{ marginTop: 8 }} />
          )}
          {isCompleted && item.completion && (
            <Text style={[styles.completedText, { color: theme.colors.success.dark, fontFamily: theme.typography.fontFamily.medium }]}>
              {item.completion.correctCount}/{item.completion.totalCount} doğru ({item.completion.score.toFixed(0)}%)
            </Text>
          )}
        </Card>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Yükleniyor..." />;
  }

  if (!unit) {
    return (
      <EmptyState
        title="Ünite bulunamadı"
        description="Lütfen tekrar deneyin"
      />
    );
  }

  const translation = unit.translations?.[0];
  const unitTitle = translation?.title || unit.slug;
  const unitDescription = translation?.description;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.light }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.background.default, borderBottomColor: theme.colors.border.light }]}>
        <Text style={[styles.title, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
          {unitTitle}
        </Text>
        {unitDescription && (
          <Text style={[styles.description, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
            {unitDescription}
          </Text>
        )}
      </View>
      {unit.lessons && unit.lessons.length > 0 ? (
        <FlatList
          data={unit.lessons}
          renderItem={({ item, index }) => renderLesson({ item, index })}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.list, { padding: theme.spacing.lg }]}
        />
      ) : (
        <EmptyState
          title="Bu ünitede henüz ders yok"
          description="Yakında dersler eklenecek"
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
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
  },
  list: {
    // Padding handled inline with theme
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  completedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  completedIcon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  lockedText: {
    fontSize: 12,
    marginTop: 4,
  },
  completedText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});

export default UnitDetailScreen;

