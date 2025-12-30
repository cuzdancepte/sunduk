import React, { useEffect, useState, useRef, useCallback } from 'react';
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
  const [showQuestions, setShowQuestions] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<{
    [questionId: string]: string;
  }>({});
  const [translatedMessages, setTranslatedMessages] = useState<Set<string>>(new Set());
  const messagesScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadDialog();
  }, [dialogId]);

  const loadDialog = useCallback(async () => {
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
  }, [dialogId, navigation]);

  useEffect(() => {
    loadDialog();
  }, [loadDialog]);

  // Scroll to bottom when messages load
  useEffect(() => {
    if (dialog?.messages && messagesScrollRef.current && !showQuestions) {
      setTimeout(() => {
        messagesScrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [dialog?.messages, showQuestions]);

  // Karakterleri sıraya göre sağlı sollu dağıt
  // İlk görünen karakter sol, ikinci görünen karakter sağ, üçüncü tekrar sol, vs.
  const getCharacterSide = useCallback((characterId: string | undefined) => {
    if (!characterId || !dialog?.messages) return 'left';
    
    // Tüm benzersiz karakterleri sırayla topla
    const uniqueCharacters: string[] = [];
    dialog.messages.forEach((msg) => {
      const charId = msg.character?.id;
      if (charId && !uniqueCharacters.includes(charId)) {
        uniqueCharacters.push(charId);
      }
    });
    
    // Karakterin sırasını bul
    const characterIndex = uniqueCharacters.indexOf(characterId);
    // Çift index = sağ, tek index = sol
    return characterIndex % 2 === 0 ? 'left' : 'right';
  }, [dialog?.messages]);

  const handleShowQuestions = () => {
    setShowQuestions(true);
  };

  const toggleTranslation = (messageId: string) => {
    setTranslatedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
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

  // Format avatar URL helper function
  const formatImageUrl = (url: string | undefined): string | undefined => {
    if (!url) return undefined;
    let formattedUrl = url;
    if (formattedUrl.includes('localhost:3001')) {
      formattedUrl = formattedUrl.replace('localhost:3001', '192.168.1.5:3001');
    } else if (formattedUrl.includes('127.0.0.1:3001')) {
      formattedUrl = formattedUrl.replace('127.0.0.1:3001', '192.168.1.5:3001');
    } else if (!formattedUrl.startsWith('http')) {
      if (formattedUrl.startsWith('/uploads')) {
        formattedUrl = `http://192.168.1.5:3001${formattedUrl}`;
      } else if (formattedUrl.startsWith('uploads')) {
        formattedUrl = `http://192.168.1.5:3001/${formattedUrl}`;
      }
    }
    return formattedUrl;
  };

  // Render all messages in WhatsApp style
  const renderMessage = (message: DialogMessage, index: number) => {
    const character = message.character;
    const characterName = character?.translations?.[0]?.name || 'Karakter';
    
    // Mesajın tüm çevirileri artık backend'den geliyor
    // İlk çeviri öğrenilen dilde, ikinci çeviri native language'de olabilir
    // Ya da tam tersi - hangisi varsa onu göster
    const allTranslations = message.translations || [];
    const messageText = allTranslations[0]?.text || '';
    // İkinci çeviri varsa onu çeviri olarak göster
    const translationText = allTranslations.length > 1 ? allTranslations[1]?.text : '';
    
    const avatarUrl = formatImageUrl(character?.avatarUrl);
    
    // Karakterin hangi tarafta olacağını belirle
    const characterSide = getCharacterSide(character?.id);
    const isUserMessage = characterSide === 'right';
    const showTranslation = translatedMessages.has(message.id);

    // Aynı karakterin ardışık mesajlarını grupla (avatar gösterimi için)
    const prevMessage = index > 0 ? dialog?.messages?.[index - 1] : null;
    const showAvatar = !prevMessage || prevMessage.character?.id !== character?.id;

    return (
      <View
        key={message.id}
        style={[
          styles.messageRow,
          isUserMessage ? styles.userMessageRow : styles.characterMessageRow,
        ]}
      >
        {characterSide === 'left' && (
          <View style={[styles.avatarContainer, { marginLeft: 0, marginRight: 8 }]}>
            {showAvatar ? (
              avatarUrl && avatarUrl.trim() !== '' ? (
                <Image
                  source={{ uri: avatarUrl }}
                  style={styles.messageAvatar}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.messageAvatar, styles.avatarPlaceholder, { backgroundColor: theme.colors.primary.main }]}>
                  <Text style={[styles.avatarPlaceholderText, { color: theme.colors.primary.contrast }]}>
                    {characterName.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )
            ) : (
              <View style={styles.messageAvatar} />
            )}
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            isUserMessage ? styles.userBubble : styles.characterBubble,
          ]}
        >
          {characterSide === 'left' && showAvatar && (
            <Text style={[styles.messageSender, { color: theme.colors.primary.main }]}>
              {characterName}
            </Text>
          )}
          {characterSide === 'right' && showAvatar && (
            <Text style={[styles.messageSender, { color: '#25D366' }]}>
              {characterName}
            </Text>
          )}
          <Text style={styles.messageText}>{messageText}</Text>
          {showTranslation && translationText && (
            <View style={styles.translationContainer}>
              <Text style={styles.translationText}>{translationText}</Text>
            </View>
          )}
          <View style={styles.messageFooter}>
            <Text style={styles.messageTime}>
              {new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
            </Text>
            {message.audioUrl && (
              <Text style={styles.audioIcon}>🔊</Text>
            )}
          </View>
        </View>
        {/* Çeviri butonu - mesaj balonunun yanında */}
        {translationText && (
          <TouchableOpacity
            onPress={() => toggleTranslation(message.id)}
            style={[
              styles.translateButton,
              characterSide === 'left' ? styles.translateButtonLeft : styles.translateButtonRight,
            ]}
          >
            <Text style={styles.translateButtonText}>
              {showTranslation ? '🔼' : '🔽'}
            </Text>
          </TouchableOpacity>
        )}
        {characterSide === 'right' && (
          <View style={[styles.avatarContainer, { marginLeft: 8, marginRight: 0 }]}>
            {showAvatar ? (
              avatarUrl && avatarUrl.trim() !== '' ? (
                <Image
                  source={{ uri: avatarUrl }}
                  style={styles.messageAvatar}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.messageAvatar, styles.avatarPlaceholder, { backgroundColor: '#25D366' }]}>
                  <Text style={[styles.avatarPlaceholderText, { color: '#FFFFFF' }]}>
                    {characterName.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )
            ) : (
              <View style={styles.messageAvatar} />
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.light }]}>
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

      {/* Dialog Messages - WhatsApp Style */}
      {!showQuestions && dialog?.messages && dialog.messages.length > 0 && (
        <>
          <ScrollView
            ref={messagesScrollRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {dialog.messages.map((message, index) => renderMessage(message, index))}
          </ScrollView>
          
          {/* Questions Button */}
          <View style={[styles.questionsButtonContainer, { backgroundColor: theme.colors.background.default, borderTopColor: theme.colors.border.light }]}>
            <Button
              label="Sorulara Geç ▶"
              onPress={handleShowQuestions}
              variant="contained"
              style={styles.questionsButton}
            />
          </View>
        </>
      )}

      {/* Dialog Questions */}
      {showQuestions && dialog.questions && dialog.questions.length > 0 && (
        <ScrollView
          style={styles.questionsContainer}
          contentContainerStyle={[styles.content, { padding: theme.spacing.lg }]}
          showsVerticalScrollIndicator={false}
        >
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
                {mediaUrl && (
                  <Image
                    source={{ uri: mediaUrl }}
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
        </ScrollView>
      )}

      {showQuestions && (!dialog.questions || dialog.questions.length === 0) && (
        <View style={[styles.content, { padding: theme.spacing.lg }]}>
          <EmptyState
            title="Bu dialog için soru yok"
            description="Sorular yakında eklenecek"
          />
        </View>
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
  // WhatsApp style messages
  messagesContainer: {
    flex: 1,
    backgroundColor: '#ECE5DD', // WhatsApp benzeri arka plan
  },
  messagesContent: {
    padding: 12,
    paddingBottom: 20,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 4,
    alignItems: 'flex-end',
  },
  characterMessageRow: {
    justifyContent: 'flex-start',
  },
  userMessageRow: {
    justifyContent: 'flex-end',
  },
  avatarContainer: {
    width: 36,
  },
  messageAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
  },
  characterBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: '#DCF8C6', // WhatsApp yeşil tonu
    borderBottomRightRadius: 4,
  },
  messageSender: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    color: '#000000',
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 11,
    color: '#999999',
    marginRight: 4,
  },
  audioIcon: {
    fontSize: 12,
  },
  translationContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  translationText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#666666',
    fontStyle: 'italic',
  },
  translateButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
    marginRight: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  translateButtonLeft: {
    marginLeft: 4,
    marginRight: 0,
  },
  translateButtonRight: {
    marginLeft: 0,
    marginRight: 4,
  },
  translateButtonText: {
    fontSize: 14,
  },
  questionsButtonContainer: {
    padding: 16,
    borderTopWidth: 1,
  },
  questionsButton: {
    width: '100%',
  },
  questionsContainer: {
    flex: 1,
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

