import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { AppStackParamList } from '../navigation/AppStack';
import { contentAPI } from '../services/api';
import { Lesson, Exercise, ExerciseOption } from '../types';

type RoutePropType = RouteProp<AppStackParamList, 'Lesson'>;

const LessonScreen = () => {
  const route = useRoute<RoutePropType>();
  const { lessonId } = route.params;
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<{
    [exerciseId: string]: string;
  }>({});

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

    let correctCount = 0;
    let totalCount = lesson.exercises?.length || 0;

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
        isCorrect = selectedOption.translations?.some((t: any) => {
          if (!t.optionText) return false;
          return t.optionText.trim().toLowerCase() === exercise.correctAnswer.trim().toLowerCase();
        }) || false;
      }
      
      if (isCorrect) {
        correctCount++;
      }
    });

    const score = totalCount > 0 ? (correctCount / totalCount) * 100 : 0;

    Alert.alert(
      'Sonuç',
      `${correctCount}/${totalCount} doğru (${score.toFixed(0)}%)`,
      [
        {
          text: 'Tamam',
          onPress: async () => {
            try {
              await contentAPI.updateProgress(lessonId, score >= 70);
            } catch (error) {
              console.error('Progress update error:', error);
            }
          },
        },
      ]
    );
  };

  const renderExercise = (exercise: Exercise) => {
    const prompt = exercise.prompts?.[0];
    const questionText = prompt?.questionText || 'Soru';
    
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

    return (
      <View key={exercise.id} style={styles.exerciseCard}>
        <Text style={styles.questionText}>{questionText}</Text>
        {mediaUrl && (
          <Image
            source={{ uri: mediaUrl }}
            style={styles.exerciseImage}
            resizeMode="contain"
          />
        )}
        {exercise.options?.map((option) => {
          // Get translation - try to find translation with optionText
          // Backend sends all translations, so we need to find the best match
          const translation = option.translations?.find((t: any) => t.optionText && t.optionText.trim() !== '') || option.translations?.[0];
          
          // Use optionText if available, otherwise fallback to order number (1-indexed for user)
          const optionText = translation?.optionText?.trim() || `Seçenek ${option.order + 1}`;
          const isSelected = selectedOptions[exercise.id] === option.id;

          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                isSelected && styles.optionButtonSelected,
              ]}
              onPress={() => handleOptionSelect(exercise.id, option.id)}
            >
              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.optionTextSelected,
                ]}
              >
                {optionText}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  if (!lesson) {
    return (
      <View style={styles.centerContainer}>
        <Text>Ders bulunamadı</Text>
      </View>
    );
  }

  const translation = lesson.translations?.[0];
  const lessonTitle = translation?.title || `Ders ${lesson.order}`;
  const lessonContent = translation?.contentMd;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{lessonTitle}</Text>
        {lessonContent && (
          <Text style={styles.content}>{lessonContent}</Text>
        )}
      </View>

      <View style={styles.exercisesContainer}>
        <Text style={styles.exercisesTitle}>Alıştırmalar</Text>
        {lesson.exercises?.map(renderExercise)}
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Gönder</Text>
      </TouchableOpacity>
    </ScrollView>
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
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  content: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  exercisesContainer: {
    padding: 16,
  },
  exercisesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  exerciseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  exerciseImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#f0f0f0',
  },
  optionButton: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  optionButtonSelected: {
    borderColor: '#6200ee',
    backgroundColor: '#f3e5f5',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  optionTextSelected: {
    color: '#6200ee',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#6200ee',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LessonScreen;

