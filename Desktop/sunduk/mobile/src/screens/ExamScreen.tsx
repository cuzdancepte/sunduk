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
  TextInput,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { AppStackParamList } from '../navigation/AppStack';
import { contentAPI } from '../services/api';
import { Exam, ExamQuestion, ExamQuestionOption } from '../types';
import { useTheme } from '../theme/useTheme';
import { Card, Button, LoadingSpinner, EmptyState } from '../components/ui';

type RoutePropType = RouteProp<AppStackParamList, 'Exam'>;

const ExamScreen = () => {
  const theme = useTheme();
  const route = useRoute<RoutePropType>();
  const navigation = useNavigation<any>();
  const { examId } = route.params;
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<{
    [questionId: string]: string; // For multiple_choice: optionId, for fill_blank: answer text, for matching: JSON string of pairs
  }>({});
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultData, setResultData] = useState<{
    correctCount: number;
    totalCount: number;
    score: number;
    completed: boolean;
  } | null>(null);
  const [questionResults, setQuestionResults] = useState<{
    [questionId: string]: boolean; // true if correct, false if incorrect
  }>({});

  useEffect(() => {
    loadExam();
  }, [examId]);

  const loadExam = async () => {
    try {
      const data = await contentAPI.getExam(examId);
      setExam(data);
    } catch (error: any) {
      Alert.alert('Hata', error.response?.data?.error || 'Sınav yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (questionId: string, optionId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleTextInputChange = (questionId: string, text: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: text,
    }));
  };


  const handleSubmit = async () => {
    if (!exam) return;

    // Check if all questions are answered
    const totalCount = exam.questions?.length || 0;
    const answeredCount = Object.keys(selectedOptions).filter((qId) => {
      const answer = selectedOptions[qId];
      if (!answer || answer.trim() === '') return false;
      
      // For matching questions, check if JSON is valid and has pairs
      const question = exam.questions?.find(q => q.id === qId);
      if (question?.type === 'matching') {
        try {
          const pairs = JSON.parse(answer);
          return Array.isArray(pairs) && pairs.length > 0;
        } catch {
          return false;
        }
      }
      
      return true;
    }).length;
    
    if (answeredCount < totalCount) {
      Alert.alert('Uyarı', 'Lütfen tüm soruları cevaplayın.');
      return;
    }

    let correctCount = 0;
    const results: { [questionId: string]: boolean } = {};

    exam.questions?.forEach((question) => {
      const userAnswer = selectedOptions[question.id];
      if (!userAnswer || !question.correctAnswer) {
        results[question.id] = false;
        return;
      }
      
      let isCorrect = false;
      
      if (question.type === 'fill_blank') {
        // For fill_blank, correctAnswer is a JSON array of possible answers
        try {
          const correctAnswers = JSON.parse(question.correctAnswer);
          if (Array.isArray(correctAnswers)) {
            isCorrect = correctAnswers.some((correctAnswer: string) => {
              return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
            });
          } else {
            // Fallback: treat as single string
            isCorrect = userAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
          }
        } catch {
          // If not JSON, treat as single string
          isCorrect = userAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
        }
      } else if (question.type === 'matching') {
        // For matching, correctAnswer and userAnswer are JSON arrays of {left, right} pairs
        try {
          const correctPairs = JSON.parse(question.correctAnswer);
          const userPairs = JSON.parse(userAnswer);
          
          if (Array.isArray(correctPairs) && Array.isArray(userPairs)) {
            // Check if all pairs match (order doesn't matter)
            if (correctPairs.length !== userPairs.length) {
              isCorrect = false;
            } else {
              isCorrect = correctPairs.every((correctPair: { left: string; right: string }) => {
                return userPairs.some((userPair: { left: string; right: string }) => {
                  return correctPair.left.trim().toLowerCase() === userPair.left.trim().toLowerCase() &&
                         correctPair.right.trim().toLowerCase() === userPair.right.trim().toLowerCase();
                });
              });
            }
          } else {
            isCorrect = false;
          }
        } catch {
          isCorrect = false;
        }
      } else {
        // For multiple_choice and other types
        const selectedOption = question.options?.find((opt) => opt.id === userAnswer);
        if (!selectedOption) {
          results[question.id] = false;
          return;
        }
        
        // First check: If correctAnswer is an Option ID
        if (userAnswer === question.correctAnswer) {
          isCorrect = true;
        } else {
          // Second check: If correctAnswer is option text
          isCorrect = selectedOption.translations?.some((t: any) => {
            if (!t.optionText) return false;
            return t.optionText.trim().toLowerCase() === question.correctAnswer!.trim().toLowerCase();
          }) || false;
        }
      }
      
      results[question.id] = isCorrect;
      if (isCorrect) {
        correctCount++;
      }
    });

    const score = totalCount > 0 ? (correctCount / totalCount) * 100 : 0;
    const passingScore = exam.passingScore || 70; // Default: 70
    const completed = score >= passingScore;

    // Save result data and question results
    setQuestionResults(results);
    setResultData({
      correctCount,
      totalCount,
      score,
      completed,
    });

    // Update exam progress on backend
    try {
      await contentAPI.updateExamProgress(examId, completed, score, correctCount, totalCount);
    } catch (error) {
      console.error('Exam progress update error:', error);
      Alert.alert('Hata', 'Sınav sonucu kaydedilirken bir hata oluştu.');
    }

    // Show result modal
    setShowResultModal(true);
  };

  const handleCloseResultModal = () => {
    setShowResultModal(false);
    // Eğer sınav başarıyla tamamlandıysa UnitDetailScreen'e geri dön
    if (resultData?.completed) {
      navigation.goBack();
    }
  };

  const renderQuestion = (question: ExamQuestion, index: number) => {
    const prompt = question.prompts?.[0];
    const questionText = prompt?.questionText || 'Soru';
    
    // İlk soru her zaman aktif
    const isFirstQuestion = index === 0;
    
    // Önceki soru tamamlanmış mı kontrol et (seçim yapılmış mı)
    const previousQuestion = exam?.questions?.[index - 1];
    const isPreviousQuestionCompleted = previousQuestion 
      ? (selectedOptions[previousQuestion.id] !== undefined && 
         selectedOptions[previousQuestion.id].trim() !== '' &&
         (previousQuestion.type !== 'matching' || 
          (() => {
            try {
              const pairs = JSON.parse(selectedOptions[previousQuestion.id] || '[]');
              return Array.isArray(pairs) && pairs.length > 0;
            } catch {
              return false;
            }
          })()))
      : true; // İlk soru için true
    
    // Aktif olması için: ilk soru olmalı VEYA önceki soru tamamlanmış olmalı
    // Sınav bitirildikten sonra tüm sorular aktif olmalı (sonuçları görmek için)
    const isActive = resultData ? true : (isFirstQuestion || isPreviousQuestionCompleted);
    const isQuestionCorrect = resultData ? questionResults[question.id] : undefined;
    
    // Format media URL - convert localhost to mobile-accessible IP
    let mediaUrl = question.mediaUrl;
    if (mediaUrl) {
      if (mediaUrl.includes('localhost:3001')) {
        mediaUrl = mediaUrl.replace('localhost:3001', '192.168.1.5:3001');
      } else if (mediaUrl.includes('127.0.0.1:3001')) {
        mediaUrl = mediaUrl.replace('127.0.0.1:3001', '192.168.1.5:3001');
      } else if (!mediaUrl.startsWith('http')) {
        if (mediaUrl.startsWith('/uploads')) {
          mediaUrl = `http://192.168.1.5:3001${mediaUrl}`;
        } else if (mediaUrl.startsWith('uploads')) {
          mediaUrl = `http://192.168.1.5:3001/${mediaUrl}`;
        }
      }
    }

    // Helper function to check if an option is correct
    const checkIfCorrect = (option: ExamQuestionOption): boolean => {
      if (!question.correctAnswer) return false;
      
      // Check if option ID matches
      if (option.id === question.correctAnswer) {
        return true;
      }
      
      // Check if option text matches (case-insensitive)
      return option.translations?.some((t: any) => {
        if (!t.optionText) return false;
        return t.optionText.trim().toLowerCase() === question.correctAnswer!.trim().toLowerCase();
      }) || false;
    };

    return (
      <Card
        key={question.id}
        variant="elevated"
        padding="large"
        style={[
          { marginBottom: theme.spacing.lg },
          !isActive && !resultData && {
            opacity: 0.6,
            backgroundColor: theme.colors.grey[100],
          },
          resultData && isQuestionCorrect !== undefined && {
            borderWidth: 2,
            borderColor: isQuestionCorrect ? theme.colors.success.main : theme.colors.error.main,
            backgroundColor: isQuestionCorrect 
              ? `${theme.colors.success.main}15` 
              : `${theme.colors.error.main}15`,
          },
        ]}
      >
        <Text style={[styles.questionText, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.semiBold }]}>
          {questionText}
        </Text>
        {mediaUrl && (
          <Image
            source={{ uri: mediaUrl }}
            style={[styles.questionImage, { backgroundColor: theme.colors.background.light }]}
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
        {question.type === 'fill_blank' ? (
          <View>
            <TextInput
              style={[
                styles.textInput,
                {
                  borderColor: resultData && isQuestionCorrect !== undefined
                    ? (isQuestionCorrect ? theme.colors.success.main : theme.colors.error.main)
                    : theme.colors.border.light,
                  color: theme.colors.text.primary,
                  backgroundColor: resultData && isQuestionCorrect !== undefined
                    ? (isQuestionCorrect 
                        ? `${theme.colors.success.main}15` 
                        : `${theme.colors.error.main}15`)
                    : theme.colors.background.default,
                },
                !isActive && !resultData && { opacity: 0.5, backgroundColor: theme.colors.grey[100] },
              ]}
              placeholder="Cevabınızı yazın..."
              placeholderTextColor={theme.colors.text.disabled}
              value={selectedOptions[question.id] || ''}
              onChangeText={(text) => handleTextInputChange(question.id, text)}
              editable={isActive && !resultData}
              multiline={false}
            />
            {resultData && isQuestionCorrect !== undefined && (
              <Text style={[
                styles.resultIndicator,
                {
                  color: isQuestionCorrect ? theme.colors.success.dark : theme.colors.error.dark,
                  fontFamily: theme.typography.fontFamily.semiBold,
                }
              ]}>
                {isQuestionCorrect ? '✓ Doğru' : '✗ Yanlış'}
              </Text>
            )}
          </View>
        ) : question.type === 'matching' ? (
          <View>
            {(() => {
              // Parse correctAnswer to get left and right pairs
              let leftItems: string[] = [];
              let rightItems: string[] = [];
              
              try {
                const correctPairs = JSON.parse(question.correctAnswer || '[]');
                if (Array.isArray(correctPairs)) {
                  leftItems = correctPairs.map((p: any) => p.left).filter(Boolean);
                  rightItems = correctPairs.map((p: any) => p.right).filter(Boolean);
                }
              } catch {
                // If parsing fails, try to get from options
                if (question.options && question.options.length > 0) {
                  const half = Math.ceil(question.options.length / 2);
                  leftItems = question.options.slice(0, half).map(opt => 
                    opt.translations?.[0]?.optionText || ''
                  ).filter(Boolean);
                  rightItems = question.options.slice(half).map(opt => 
                    opt.translations?.[0]?.optionText || ''
                  ).filter(Boolean);
                }
              }
              
              // Get user's selected pairs
              let userPairs: Array<{ left: string; right: string }> = [];
              try {
                const userAnswer = selectedOptions[question.id];
                if (userAnswer) {
                  userPairs = JSON.parse(userAnswer);
                }
              } catch {
                userPairs = [];
              }
              
              // Get selected right item for each left item
              const getSelectedRight = (leftItem: string) => {
                const pair = userPairs.find(p => p.left === leftItem);
                return pair?.right || '';
              };
              
              return (
                <View>
                  {leftItems.map((leftItem, leftIndex) => {
                    const selectedRight = getSelectedRight(leftItem);
                    const isCorrect = resultData && isQuestionCorrect !== undefined
                      ? (() => {
                          try {
                            const correctPairs = JSON.parse(question.correctAnswer || '[]');
                            const correctPair = correctPairs.find((p: any) => p.left === leftItem);
                            return correctPair?.right === selectedRight;
                          } catch {
                            return false;
                          }
                        })()
                      : undefined;
                    
                    return (
                      <View key={leftIndex} style={[styles.matchingRow, { marginBottom: theme.spacing.md }]}>
                        <View style={[styles.matchingLeft, {
                          backgroundColor: theme.colors.background.default,
                          borderColor: theme.colors.border.light,
                        }]}>
                          <Text style={[styles.matchingText, {
                            color: theme.colors.text.primary,
                            fontFamily: theme.typography.fontFamily.medium,
                          }]}>
                            {leftItem}
                          </Text>
                        </View>
                        <Text style={[styles.matchingArrow, { color: theme.colors.text.secondary }]}>→</Text>
                        {!resultData ? (
                          <View style={[styles.matchingRight, {
                            borderColor: theme.colors.border.light,
                            backgroundColor: theme.colors.background.default,
                          }]}>
                            {rightItems.map((rightItem, rightIndex) => {
                              const isSelected = selectedRight === rightItem;
                              return (
                                <TouchableOpacity
                                  key={rightIndex}
                                  style={[
                                    styles.matchingOption,
                                    {
                                      borderColor: isSelected 
                                        ? theme.colors.primary.main 
                                        : theme.colors.border.light,
                                      backgroundColor: isSelected 
                                        ? `${theme.colors.primary.main}15` 
                                        : 'transparent',
                                    },
                                    !isActive && { opacity: 0.5 },
                                  ]}
                                  onPress={() => {
                                    if (isActive) {
                                      setSelectedOptions((prev) => {
                                        let pairs: Array<{ left: string; right: string }> = [];
                                        try {
                                          if (prev[question.id]) {
                                            pairs = JSON.parse(prev[question.id]);
                                          }
                                        } catch {
                                          pairs = [];
                                        }
                                        
                                        const existingIndex = pairs.findIndex(p => p.left === leftItem);
                                        if (existingIndex >= 0) {
                                          pairs[existingIndex] = { left: leftItem, right: rightItem };
                                        } else {
                                          pairs.push({ left: leftItem, right: rightItem });
                                        }
                                        
                                        return {
                                          ...prev,
                                          [question.id]: JSON.stringify(pairs),
                                        };
                                      });
                                    }
                                  }}
                                  disabled={!isActive}
                                >
                                  <Text style={[styles.matchingOptionText, {
                                    color: isSelected 
                                      ? theme.colors.primary.dark 
                                      : theme.colors.text.primary,
                                    fontFamily: isSelected 
                                      ? theme.typography.fontFamily.semiBold 
                                      : theme.typography.fontFamily.regular,
                                  }]}>
                                    {rightItem}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        ) : (
                          <View style={[styles.matchingRight, {
                            borderColor: isCorrect !== undefined
                              ? (isCorrect ? theme.colors.success.main : theme.colors.error.main)
                              : theme.colors.border.light,
                            backgroundColor: isCorrect !== undefined
                              ? (isCorrect 
                                  ? `${theme.colors.success.main}15` 
                                  : `${theme.colors.error.main}15`)
                              : theme.colors.background.default,
                          }]}>
                            <Text style={[styles.matchingText, {
                              color: isCorrect !== undefined
                                ? (isCorrect ? theme.colors.success.dark : theme.colors.error.dark)
                                : theme.colors.text.primary,
                              fontFamily: theme.typography.fontFamily.medium,
                            }]}>
                              {selectedRight || '(Boş)'}
                            </Text>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              );
            })()}
          </View>
        ) : (
          question.options?.map((option) => {
          const translation = option.translations?.find((t: any) => t.optionText && t.optionText.trim() !== '') || option.translations?.[0];
          const optionText = translation?.optionText?.trim() || `Seçenek ${option.order + 1}`;
          const isSelected = selectedOptions[question.id] === option.id;
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
                if (isActive && !resultData) {
                  handleOptionSelect(question.id, option.id);
                }
              }}
              disabled={!isActive || !!resultData}
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
        })
        )}
      </Card>
    );
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Yükleniyor..." />;
  }

  if (!exam) {
    return (
      <EmptyState
        title="Sınav bulunamadı"
        description="Lütfen tekrar deneyin"
      />
    );
  }

  const translation = exam.translations?.[0];
  const examTitle = translation?.title || `Sınav ${exam.order}`;
  const examDescription = translation?.description;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background.light }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.background.default }]}>
        <Text style={[styles.title, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
          🏆 {examTitle}
        </Text>
        {examDescription && (
          <Text style={[styles.content, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
            {examDescription}
          </Text>
        )}
        {exam.passingScore && (
          <Text style={[styles.passingScore, { color: '#FFA828', fontFamily: theme.typography.fontFamily.medium }]}>
            Geçme notu: %{exam.passingScore}
          </Text>
        )}
      </View>

      <View style={[styles.questionsContainer, { padding: theme.spacing.lg }]}>
        <Text style={[styles.questionsTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
          Sorular
        </Text>
        {exam.questions?.map((question, index) => renderQuestion(question, index))}
      </View>

      <View style={{ padding: theme.spacing.lg }}>
        <Button
          title="Sınavı Bitir"
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
                Sınav Sonucu
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
                      Tebrikler! Sınavı geçtiniz.
                    </Text>
                  </View>
                ) : (
                  <View style={[styles.failContainer, { backgroundColor: `${theme.colors.warning.main}15` }]}>
                    <Text style={[styles.failText, { color: theme.colors.warning.dark, fontFamily: theme.typography.fontFamily.semiBold }]}>
                      Sınavı geçmek için en az %{exam.passingScore || 70} başarı gerekir.
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
    marginBottom: 8,
  },
  passingScore: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  questionsContainer: {
    // Padding handled inline with theme
  },
  questionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  questionImage: {
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
  textInput: {
    borderWidth: 2,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginTop: 8,
    minHeight: 48,
  },
  resultIndicator: {
    fontSize: 14,
    marginTop: 8,
    fontWeight: '600',
  },
  matchingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  matchingLeft: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    marginRight: 8,
  },
  matchingArrow: {
    fontSize: 20,
    marginHorizontal: 8,
    fontWeight: 'bold',
  },
  matchingRight: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    minHeight: 48,
    justifyContent: 'center',
  },
  matchingText: {
    fontSize: 16,
  },
  matchingOption: {
    borderWidth: 2,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  matchingOptionText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ExamScreen;

