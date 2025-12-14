import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { AppStackParamList } from '../navigation/AppStack';
import { contentAPI } from '../services/api';
import { Dialog, DialogMessage, DialogQuestion } from '../types';
import { useTheme } from '../theme/useTheme';
import { Card, Button, LoadingSpinner, EmptyState } from '../components/ui';

type RoutePropType = RouteProp<AppStackParamList, 'DialogDetail'>;

const DialogDetailScreen = () => {
  const theme = useTheme();
  const route = useRoute<RoutePropType>();
  const navigation = useNavigation<any>();
  const { dialogId } = route.params;
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showQuestions, setShowQuestions] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<{
    [questionId: string]: string;
  }>({});

  useEffect(() => {
    loadDialog();
  }, [dialogId]);

  const loadDialog = async () => {
    try {
      setLoading(true);
      const data = await contentAPI.getDialog(dialogId);
      setDialog(data);
    } catch (error: any) {
      Alert.alert('Hata', error.response?.data?.error || 'Dialog yüklenemedi');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleNextMessage = () => {
    if (dialog?.messages && currentMessageIndex < dialog.messages.length - 1) {
      setCurrentMessageIndex(currentMessageIndex + 1);
    } else {
      // Dialog bitti, soruları göster
      setShowQuestions(true);
    }
  };

  const handlePreviousMessage = () => {
    if (currentMessageIndex > 0) {
      setCurrentMessageIndex(currentMessageIndex - 1);
      setShowQuestions(false);
    }
  };

  const handleOptionSelect = (questionId: string, optionId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmitQuestions = () => {
    if (!dialog?.questions) return;

    let correctCount = 0;
    const totalCount = dialog.questions.length;

    dialog.questions.forEach((question) => {
      const selected = selectedOptions[question.id];
      if (selected === question.correctAnswer) {
        correctCount++;
      }
    });

    const score = (correctCount / totalCount) * 100;
    Alert.alert(
      'Sonuç',
      `Doğru: ${correctCount}/${totalCount}\nPuan: ${score.toFixed(0)}%`,
      [{ text: 'Tamam' }]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background.light }]}>
        <LoadingSpinner />
      </View>
    );
  }

  if (!dialog) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background.light }]}>
        <EmptyState title="Dialog bulunamadı" description="Dialog yüklenemedi" />
      </View>
    );
  }

  const translation = dialog.translations?.[0];
  const currentMessage = dialog.messages?.[currentMessageIndex];
  const character = currentMessage?.character;
  const characterName = character?.translations?.[0]?.name || 'Karakter';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background.light }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Dialog Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.colors.background.default,
            borderBottomColor: theme.colors.border.light,
          },
        ]}
      >
        <Text
          style={[
            styles.title,
            {
              color: theme.colors.text.primary,
              fontFamily: theme.typography.fontFamily.bold,
            },
          ]}
        >
          {translation?.title || 'Dialog'}
        </Text>
        {translation?.description && (
          <Text
            style={[
              styles.description,
              {
                color: theme.colors.text.primary,
                fontFamily: theme.typography.fontFamily.regular,
              },
            ]}
          >
            {translation.description}
          </Text>
        )}
        {translation?.scenario && (
          <Text
            style={[
              styles.scenario,
              {
                color: theme.colors.text.secondary,
                fontFamily: theme.typography.fontFamily.regular,
              },
            ]}
          >
            {translation.scenario}
          </Text>
        )}
      </View>

      {/* Dialog Messages */}
      {!showQuestions && currentMessage && (
        <View style={[styles.content, { padding: theme.spacing.lg }]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleNextMessage}
            style={{ marginBottom: theme.spacing.md }}
          >
            <Card
              variant="elevated"
              padding="large"
              style={{ minHeight: 150 }}
            >
              <View style={styles.messageHeader}>
                {character?.avatarUrl && (
                  <Image
                    source={{ uri: character.avatarUrl }}
                    style={styles.avatar}
                  />
                )}
                <Text
                  style={[
                    styles.characterName,
                    {
                      color: theme.colors.primary.main,
                      fontFamily: theme.typography.fontFamily.bold,
                    },
                  ]}
                >
                  {characterName}
                </Text>
              </View>
              <Text
                style={[
                  styles.messageText,
                  {
                    color: theme.colors.text.primary,
                    fontFamily: theme.typography.fontFamily.semiBold,
                  },
                ]}
              >
                {currentMessage.translations?.[0]?.text || ''}
              </Text>
              {currentMessage.audioUrl && (
                <Text
                  style={[
                    styles.audioNote,
                    {
                      color: theme.colors.text.secondary,
                      fontFamily: theme.typography.fontFamily.regular,
                    },
                  ]}
                >
                  🔊 Ses dosyası mevcut
                </Text>
              )}
              <View style={styles.tapHint}>
                <Text
                  style={[
                    styles.tapHintText,
                    {
                      color: theme.colors.text.secondary,
                      fontFamily: theme.typography.fontFamily.regular,
                    },
                  ]}
                >
                  {currentMessageIndex === (dialog.messages?.length || 0) - 1 
                    ? 'Sorulara geçmek için dokunun →' 
                    : 'Sonraki mesaj için dokunun →'}
                </Text>
              </View>
            </Card>
          </TouchableOpacity>

          <View style={styles.navigationContainer}>
            <View style={styles.navigationButtons}>
              <Button
                label="◀ Önceki"
                onPress={handlePreviousMessage}
                variant="outlined"
                disabled={currentMessageIndex === 0}
                style={{ flex: 1, marginRight: theme.spacing.sm }}
              />
              <Button
                label={currentMessageIndex === (dialog.messages?.length || 0) - 1 ? 'Sorulara Geç ▶' : 'Sonraki ▶'}
                onPress={handleNextMessage}
                variant="contained"
                style={{ flex: 1 }}
              />
            </View>
            <Text
              style={[
                styles.progressText,
                {
                  color: theme.colors.text.secondary,
                  fontFamily: theme.typography.fontFamily.regular,
                },
              ]}
            >
              {currentMessageIndex + 1} / {dialog.messages?.length || 0}
            </Text>
          </View>
        </View>
      )}

      {/* Dialog Questions */}
      {showQuestions && dialog.questions && dialog.questions.length > 0 && (
        <View style={[styles.content, { padding: theme.spacing.lg }]}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.text.primary,
                fontFamily: theme.typography.fontFamily.bold,
              },
            ]}
          >
            Sorular
          </Text>
          {dialog.questions.map((question: DialogQuestion, index: number) => {
            const prompt = question.prompts?.[0];
            const questionText = prompt?.questionText || 'Soru';

            return (
              <Card
                key={question.id}
                variant="elevated"
                padding="large"
                style={{ marginBottom: theme.spacing.md }}
              >
                <Text
                  style={[
                    styles.questionText,
                    {
                      color: theme.colors.text.primary,
                      fontFamily: theme.typography.fontFamily.semiBold,
                    },
                  ]}
                >
                  {questionText}
                </Text>
                {question.mediaUrl && (
                  <Image
                    source={{ uri: question.mediaUrl }}
                    style={styles.questionImage}
                    resizeMode="contain"
                  />
                )}
                {question.options && question.options.length > 0 && (
                  <View style={styles.optionsContainer}>
                    {question.options.map((option: any) => {
                      const optionText = option.translations?.[0]?.optionText || '';
                      const isSelected = selectedOptions[question.id] === option.id;

                      return (
                        <TouchableOpacity
                          key={option.id}
                          onPress={() => handleOptionSelect(question.id, option.id)}
                          style={[
                            styles.optionButton,
                            {
                              backgroundColor: isSelected
                                ? theme.colors.primary.main
                                : theme.colors.background.default,
                              borderColor: theme.colors.border.light,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.optionText,
                              {
                                color: isSelected
                                  ? theme.colors.primary.contrast
                                  : theme.colors.text.primary,
                                fontFamily: theme.typography.fontFamily.regular,
                              },
                            ]}
                          >
                            {optionText}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </Card>
            );
          })}
          <Button
            label="Cevapları Gönder"
            onPress={handleSubmitQuestions}
            variant="contained"
            style={{ marginTop: theme.spacing.md }}
          />
        </View>
      )}

      {showQuestions && (!dialog.questions || dialog.questions.length === 0) && (
        <View style={[styles.content, { padding: theme.spacing.lg }]}>
          <EmptyState
            title="Bu dialog için soru yok"
            description="Sorular yakında eklenecek"
          />
        </View>
      )}
    </ScrollView>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 22,
  },
  scenario: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 4,
    lineHeight: 20,
  },
  content: {
    // Padding handled inline with theme
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  characterName: {
    fontSize: 18,
    fontWeight: '600',
  },
  messageText: {
    fontSize: 20,
    lineHeight: 30,
    marginBottom: 8,
    fontWeight: '500',
  },
  audioNote: {
    fontSize: 12,
    marginTop: 8,
  },
  tapHint: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  tapHintText: {
    fontSize: 12,
    textAlign: 'right',
    fontStyle: 'italic',
  },
  navigationContainer: {
    marginTop: 8,
  },
  navigationButtons: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  progressText: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    lineHeight: 26,
  },
  questionImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  optionsContainer: {
    marginTop: 8,
  },
  optionButton: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  optionText: {
    fontSize: 16,
    lineHeight: 22,
  },
});

export default DialogDetailScreen;

