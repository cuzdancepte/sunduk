import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { AppStackParamList } from '../navigation/AppStack';
import { contentAPI } from '../services/api';
import { Lesson, Exercise, ExerciseOption } from '../types';
import { useTheme } from '../theme/useTheme';
import { Card, Button, LoadingSpinner, EmptyState } from '../components/ui';

type RoutePropType = RouteProp<AppStackParamList, 'Lesson'>;

const LessonScreen = () => {
  const theme = useTheme();
  const route = useRoute<RoutePropType>();
  const navigation = useNavigation<any>();
  const { lessonId } = route.params;
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<{
    [exerciseId: string]: string;
  }>({});
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultData, setResultData] = useState<{
    correctCount: number;
    totalCount: number;
    score: number;
    completed: boolean;
  } | null>(null);

  useEffect(() => {
    loadLesson();
  }, [lessonId]);

  const loadLesson = async () => {
    try {
      const data = await contentAPI.getLesson(lessonId);
      setLesson(data);
    } catch (error: any) {
      Alert.alert('Hata', error.response?.data?.error || 'Ders yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (exerciseId: string, optionId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [exerciseId]: optionId,
    }));
  };

  const handleSubmit = async () => {
    if (!lesson) return;

    // Check if all questions are answered
    const totalCount = lesson.exercises?.length || 0;
    const answeredCount = Object.keys(selectedOptions).length;
    
    if (answeredCount < totalCount) {
      Alert.alert('Uyarı', 'Lütfen tüm soruları cevaplayın.');
      return;
    }

    let correctCount = 0;

    lesson.exercises?.forEach((exercise) => {
      const selectedOptionId = selectedOptions[exercise.id];
      if (!selectedOptionId || !exercise.correctAnswer) {
        return;
      }
      
      // Find the selected option
      const selectedOption = exercise.options?.find((opt) => opt.id === selectedOptionId);
      if (!selectedOption) {
        return;
      }
      
      let isCorrect = false;
      
      // First check: If correctAnswer is an Option ID (for backward compatibility)
      if (selectedOptionId === exercise.correctAnswer) {
        isCorrect = true;
      } else {
        // Second check: If correctAnswer is Turkish option text
        // Check all translations for a match (case-insensitive)
        if (exercise.correctAnswer) {
          isCorrect = selectedOption.translations?.some((t: any) => {
            if (!t.optionText) return false;
            return t.optionText.trim().toLowerCase() === exercise.correctAnswer!.trim().toLowerCase();
          }) || false;
        }
      }
      
      if (isCorrect) {
        correctCount++;
      }
    });

    const score = totalCount > 0 ? (correctCount / totalCount) * 100 : 0;
    const passingScore = lesson.passingScore || 70; // Default: 70
    const completed = score >= passingScore;

    // Save result data
    setResultData({
      correctCount,
      totalCount,
      score,
      completed,
    });

    // Update progress on backend
    try {
      await contentAPI.updateProgress(lessonId, completed, score, correctCount, totalCount);
    } catch (error) {
      console.error('Progress update error:', error);
      Alert.alert('Hata', 'İlerleme kaydedilirken bir hata oluştu.');
    }

    // Show result modal
    setShowResultModal(true);
  };

  const handleCloseResultModal = () => {
    setShowResultModal(false);
    // Eğer ders başarıyla tamamlandıysa UnitDetailScreen'e geri dön
    if (resultData?.completed) {
      navigation.goBack();
    }
  };

  const renderExercise = (exercise: Exercise, index: number) => {
    const prompt = exercise.prompts?.[0];
    const questionText = prompt?.questionText || 'Soru';
    
    // İlk alıştırma her zaman aktif
    const isFirstExercise = index === 0;
    
    // Önceki alıştırma tamamlanmış mı kontrol et (seçim yapılmış mı)
    const previousExercise = lesson?.exercises?.[index - 1];
    const isPreviousExerciseCompleted = previousExercise 
      ? selectedOptions[previousExercise.id] !== undefined
      : true; // İlk alıştırma için true
    
    // Aktif olması için: ilk alıştırma olmalı VEYA önceki alıştırma tamamlanmış olmalı
    const isActive = isFirstExercise || isPreviousExerciseCompleted;
    
    // Format media URL - convert localhost to mobile-accessible IP
    let mediaUrl = exercise.mediaUrl;
    if (mediaUrl) {
      // Replace localhost with mobile-accessible IP
      if (mediaUrl.includes('localhost:3001')) {
        mediaUrl = mediaUrl.replace('localhost:3001', '192.168.1.5:3001');
      } else if (mediaUrl.includes('127.0.0.1:3001')) {
        mediaUrl = mediaUrl.replace('127.0.0.1:3001', '192.168.1.5:3001');
      } else if (!mediaUrl.startsWith('http')) {
        // If it's a relative path, prepend backend base URL
        if (mediaUrl.startsWith('/uploads')) {
          mediaUrl = `http://192.168.1.5:3001${mediaUrl}`;
        } else if (mediaUrl.startsWith('uploads')) {
          mediaUrl = `http://192.168.1.5:3001/${mediaUrl}`;
        }
      }
    }

    // Helper function to check if an option is correct
    const checkIfCorrect = (option: ExerciseOption): boolean => {
      if (!exercise.correctAnswer) return false;
      
      // Check if option ID matches
      if (option.id === exercise.correctAnswer) {
        return true;
      }
      
      // Check if option text matches (case-insensitive)
      if (!exercise.correctAnswer) return false;
      return option.translations?.some((t: any) => {
        if (!t.optionText) return false;
        return t.optionText.trim().toLowerCase() === exercise.correctAnswer!.trim().toLowerCase();
      }) || false;
    };

    return (
      <Card
        key={exercise.id}
        variant="elevated"
        padding="large"
        style={[
          { marginBottom: theme.spacing.lg },
          !isActive && {
            opacity: 0.6,
            backgroundColor: theme.colors.grey[100],
          },
        ]}
      >
        <Text style={[styles.questionText, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.semiBold }]}>
          {questionText}
        </Text>
        {mediaUrl && (
          <Image
            source={{ uri: mediaUrl }}
            style={[styles.exerciseImage, { backgroundColor: theme.colors.background.light }]}
            resizeMode="contain"
          />
        )}
        {!isActive && (
          <View style={[styles.lockedOverlay, { backgroundColor: 'rgba(255, 255, 255, 0.9)' }]}>
            <Text style={[styles.lockedOverlayText, { color: theme.colors.text.disabled, fontFamily: theme.typography.fontFamily.semiBold }]}>
              🔒 Önceki soruyu cevaplayın
            </Text>
          </View>
        )}
        {exercise.options?.map((option) => {
          const translation = option.translations?.find((t: any) => t.optionText && t.optionText.trim() !== '') || option.translations?.[0];
          const optionText = translation?.optionText?.trim() || `Seçenek ${option.order + 1}`;
          const isSelected = selectedOptions[exercise.id] === option.id;
          const isCorrect = checkIfCorrect(option);

          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                {
                  borderColor: isSelected && isCorrect
                    ? theme.colors.success.main
                    : isSelected && !isCorrect
                    ? theme.colors.error.main
                    : theme.colors.border.light,
                  backgroundColor: isSelected && isCorrect
                    ? `${theme.colors.success.main}15`
                    : isSelected && !isCorrect
                    ? `${theme.colors.error.main}15`
                    : 'transparent',
                },
                !isActive && { opacity: 0.5 },
              ]}
              onPress={() => {
                if (isActive) {
                  handleOptionSelect(exercise.id, option.id);
                }
              }}
              disabled={!isActive}
            >
              <Text
                style={[
                  styles.optionText,
                  {
                    color: isSelected && isCorrect
                      ? theme.colors.success.dark
                      : isSelected && !isCorrect
                      ? theme.colors.error.dark
                      : theme.colors.text.primary,
                    fontFamily: isSelected ? theme.typography.fontFamily.semiBold : theme.typography.fontFamily.regular,
                  },
                  !isActive && { color: theme.colors.text.disabled },
                ]}
              >
                {optionText}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Card>
    );
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Yükleniyor..." />;
  }

  if (!lesson) {
    return (
      <EmptyState
        title="Ders bulunamadı"
        description="Lütfen tekrar deneyin"
      />
    );
  }

  const translation = lesson.translations?.[0];
  const lessonTitle = translation?.title || `Ders ${lesson.order}`;
  const lessonContent = translation?.contentMd;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background.light }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.background.default }]}>
        <Text style={[styles.title, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
          {lessonTitle}
        </Text>
        {lessonContent && (
          <Text style={[styles.content, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
            {lessonContent}
          </Text>
        )}
      </View>

      <View style={[styles.exercisesContainer, { padding: theme.spacing.lg }]}>
        <Text style={[styles.exercisesTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
          Alıştırmalar
        </Text>
        {lesson.exercises?.map((exercise, index) => renderExercise(exercise, index))}
      </View>

      <View style={{ padding: theme.spacing.lg }}>
        <Button
          title="Tamamla"
          onPress={handleSubmit}
          variant="primary"
          size="large"
          fullWidth
        />
      </View>

      {/* Result Modal */}
      <Modal
        visible={showResultModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseResultModal}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
          <Card
            variant="default"
            padding="large"
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.colors.background.default,
                borderRadius: theme.borderRadius.large,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
                Değerlendirme Sonucu
              </Text>
            </View>
            
            {resultData && (
              <>
                <View style={styles.resultContainer}>
                  <Text style={[styles.resultScore, { color: theme.colors.primary.main, fontFamily: theme.typography.fontFamily.bold }]}>
                    {resultData.score.toFixed(0)}%
                  </Text>
                  <Text style={[styles.resultText, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
                    {resultData.correctCount}/{resultData.totalCount} doğru
                  </Text>
                </View>

                {resultData.completed ? (
                  <View style={[styles.successContainer, { backgroundColor: `${theme.colors.success.main}15` }]}>
                    <Text style={[styles.successIcon, { color: theme.colors.success.main }]}>✓</Text>
                    <Text style={[styles.successText, { color: theme.colors.success.dark, fontFamily: theme.typography.fontFamily.semiBold }]}>
                      Tebrikler! Ders tamamlandı.
                    </Text>
                  </View>
                ) : (
                  <View style={[styles.failContainer, { backgroundColor: `${theme.colors.warning.main}15` }]}>
                    <Text style={[styles.failText, { color: theme.colors.warning.dark, fontFamily: theme.typography.fontFamily.semiBold }]}>
                      Ders tamamlanması için en az %{lesson.passingScore || 70} başarı gerekir.
                    </Text>
                    <Text style={[styles.failSubtext, { color: theme.colors.warning.dark, fontFamily: theme.typography.fontFamily.regular }]}>
                      Tekrar deneyebilirsiniz.
                    </Text>
                  </View>
                )}
              </>
            )}

            <Button
              title="Tamam"
              onPress={handleCloseResultModal}
              variant="primary"
              size="large"
              fullWidth
              style={{ marginTop: theme.spacing.lg }}
            />
          </Card>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
  exercisesContainer: {
    // Padding handled inline with theme
  },
  exercisesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  exerciseImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  optionButton: {
    borderWidth: 2,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalHeader: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  resultContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resultScore: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 18,
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    width: '100%',
  },
  successIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  successText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  failContainer: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    width: '100%',
  },
  failText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  failSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  lockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    zIndex: 10,
  },
  lockedOverlayText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LessonScreen;

