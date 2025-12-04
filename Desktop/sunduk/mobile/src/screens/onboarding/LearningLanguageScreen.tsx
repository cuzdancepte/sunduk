import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../theme/useTheme';
import { Button, Card } from '../../components/ui';
import { OnboardingStackParamList } from '../../navigation/OnboardingStack';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'LearningLanguage'>;

const languages = [
  { code: 'en', name: 'İngilizce', flag: '🇺🇸' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'zh', name: 'Mandarin', flag: '🇨🇳' },
  { code: 'es', name: 'İspanyolca', flag: '🇪🇸' },
  { code: 'hi', name: 'Hintçe', flag: '🇮🇳' },
  { code: 'fr', name: 'Fransızca', flag: '🇫🇷' },
];

const LearningLanguageScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.default }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.characterContainer}>
            <Text style={styles.characterEmoji}>🤔</Text>
          </View>
          <Text style={[styles.title, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
            Ne öğrenmek istersin?
          </Text>
        </View>

        <View style={styles.languageList}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              onPress={() => setSelectedLanguage(lang.code)}
              activeOpacity={0.7}
            >
              <Card
                variant={selectedLanguage === lang.code ? 'outlined' : 'default'}
                padding="large"
                style={[
                  styles.languageCard,
                  selectedLanguage === lang.code && {
                    borderColor: theme.colors.primary.main,
                    borderWidth: 2,
                    backgroundColor: `${theme.colors.primary.main}10`,
                  },
                ]}
              >
                <View style={styles.languageContent}>
                  <Text style={styles.flag}>{lang.flag}</Text>
                  <Text style={[styles.languageName, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.medium }]}>
                    {lang.name}
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title="Onayla"
          onPress={async () => {
            if (selectedLanguage) {
              // Öğrenilen dili kaydet
              await AsyncStorage.setItem('onboarding_learningLanguageId', selectedLanguage);
              navigation.navigate('ProfilePrompt');
            }
          }}
          variant="primary"
          size="large"
          fullWidth
          disabled={!selectedLanguage}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24, // Figma spacing.lg
  },
  header: {
    marginBottom: 32, // Figma spacing.xl
    alignItems: 'center',
  },
  characterContainer: {
    marginBottom: 24, // Figma spacing.lg
  },
  characterEmoji: {
    fontSize: 80,
  },
  title: {
    fontSize: 24, // Figma typography.figma['text-24-700']
    fontWeight: '700',
    marginBottom: 8, // Figma spacing.sm
    textAlign: 'center',
  },
  languageList: {
    gap: 16, // Figma spacing.md
  },
  languageCard: {
    marginBottom: 0,
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    fontSize: 32,
    marginRight: 16, // Figma spacing.md
  },
  languageName: {
    fontSize: 18, // Figma typography.figma['text-18-500']
  },
  buttonContainer: {
    padding: 24, // Figma spacing.lg
    paddingBottom: 40, // Figma spacing.xxl
  },
});

export default LearningLanguageScreen;

