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
import { Unit, Lesson, Exam } from '../types';
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

  const renderExam = (exam: Exam, index: number, allItems: Array<{ type: 'lesson' | 'exam'; sortOrder: number; data: Lesson | Exam }>) => {
    const translation = exam.translations?.[0];
    const title = translation?.title || `Sınav ${exam.order}`;
    const isCompleted = exam.completion?.completed || false;
    
    // Önceki item'ları kontrol et
    const previousItems = allItems.slice(0, index);
    const isFirstItem = index === 0;
    const previousItemsCompleted = previousItems.every(item => {
      if (item.type === 'lesson') {
        const lesson = item.data as Lesson;
        return lesson.completion?.completed || false;
      } else {
        const prevExam = item.data as Exam;
        return prevExam.completion?.completed || false;
      }
    });
    
    const isActive = isFirstItem || previousItemsCompleted;
    const isDisabled = !isActive;

    return (
      <TouchableOpacity
        key={`exam-${exam.id}`}
        onPress={() => {
          if (isDisabled) {
            Alert.alert('Kilitli', 'Önceki dersleri tamamlamalısınız');
          } else {
            navigation.navigate('App', {
              screen: 'Exam',
              params: { examId: exam.id },
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
            !isActive && {
              opacity: 0.5,
              backgroundColor: theme.colors.grey[100],
            },
            isCompleted && {
              borderWidth: 2,
              borderColor: theme.colors.success.main,
              backgroundColor: `${theme.colors.success.main}10`,
            },
            !isCompleted && {
              borderWidth: 2,
              borderColor: '#FFA828',
              backgroundColor: '#FFA82815',
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
              🏆 {title}
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
          {isCompleted && exam.completion && (
            <Text style={[styles.completedText, { color: theme.colors.success.dark, fontFamily: theme.typography.fontFamily.medium }]}>
              {exam.completion.correctCount}/{exam.completion.totalCount} doğru ({exam.completion.score.toFixed(0)}%)
            </Text>
          )}
          {!isCompleted && exam.passingScore && (
            <Text style={[styles.completedText, { color: '#FFA828', fontFamily: theme.typography.fontFamily.medium }]}>
              Geçme notu: {exam.passingScore}%
            </Text>
          )}
        </Card>
      </TouchableOpacity>
    );
  };

  const renderLesson = (lesson: Lesson, index: number, allItems: Array<{ type: 'lesson' | 'exam'; sortOrder: number; data: Lesson | Exam }>) => {
    const translation = lesson.translations?.[0];
    const title = translation?.title || `Ders ${lesson.order}`;
    const isLocked = !lesson.isFree;
    const isCompleted = lesson.completion?.completed || false;
    
    // Önceki item'ları kontrol et
    const previousItems = allItems.slice(0, index);
    const isFirstItem = index === 0;
    const previousItemsCompleted = previousItems.every(item => {
      if (item.type === 'lesson') {
        const prevLesson = item.data as Lesson;
        return prevLesson.completion?.completed || false;
      }
      // Exam'ler için şimdilik true (ileride exam completion eklenebilir)
      return true;
    });
    
    // Aktif olması için: ilk item olmalı VEYA önceki item'lar tamamlanmış olmalı
    const isActive = isFirstItem || previousItemsCompleted;
    
    // Devre dışı bırakılması için: aktif değilse VEYA kilitliyse
    const isDisabled = !isActive || isLocked;

    return (
      <TouchableOpacity
        onPress={() => {
          if (isDisabled) {
            if (!isActive) {
              Alert.alert('Kilitli', 'Önceki içerikleri tamamlamalısınız');
            } else if (isLocked) {
              Alert.alert('Premium', 'Bu ders için abonelik gereklidir');
            }
          } else {
            navigation.navigate('App', {
              screen: 'Lesson',
              params: { lessonId: lesson.id },
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
          {isCompleted && lesson.completion && (
            <Text style={[styles.completedText, { color: theme.colors.success.dark, fontFamily: theme.typography.fontFamily.medium }]}>
              {lesson.completion.correctCount}/{lesson.completion.totalCount} doğru ({lesson.completion.score.toFixed(0)}%)
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

  // Dersler ve sınavları lessonId'ye göre birleştir
  const lessons = (unit.lessons || []).slice().sort((a, b) => a.order - b.order);
  const exams = (unit.exams || []).slice().sort((a, b) => a.order - b.order);
  const maxLessonOrder = lessons.length > 0 ? Math.max(...lessons.map(l => l.order)) : 0;
  
  type UnitItem = { type: 'lesson' | 'exam'; sortOrder: number; data: Lesson | Exam };
  const unitItems: UnitItem[] = [
    ...lessons.map(lesson => ({ 
      type: 'lesson' as const, 
      sortOrder: lesson.order * 10000,
      data: lesson 
    })),
    ...exams.map(exam => {
      if (exam.lessonId) {
        // Exam bir derse bağlıysa, o dersin order'ından sonra
        const lesson = lessons.find(l => l.id === exam.lessonId);
        const lessonOrder = lesson ? lesson.order : maxLessonOrder;
        return {
          type: 'exam' as const,
          sortOrder: lessonOrder * 10000 + 5000 + exam.order,
          data: exam
        };
      } else {
        // Exam unit sonunda
        return {
          type: 'exam' as const,
          sortOrder: maxLessonOrder * 10000 + 100000 + exam.order,
          data: exam
        };
      }
    }),
  ].sort((a, b) => a.sortOrder - b.sortOrder);

  const renderItem = ({ item, index }: { item: UnitItem; index: number }) => {
    if (item.type === 'lesson') {
      return renderLesson(item.data as Lesson, index, unitItems);
    } else {
      return renderExam(item.data as Exam, index, unitItems);
    }
  };

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
      {unitItems.length > 0 ? (
        <FlatList
          data={unitItems}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.type}-${item.data.id}`}
          contentContainerStyle={[styles.list, { padding: theme.spacing.lg }]}
        />
      ) : (
        <EmptyState
          title="Bu ünitede henüz içerik yok"
          description="Yakında dersler ve sınavlar eklenecek"
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

