import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../theme/useTheme';
import { AppStackParamList } from '../../navigation/AppStack';
import BackButton from '../../components/BackButton';

type Props = NativeStackScreenProps<AppStackParamList, 'LanguageSettings'>;

const LanguageSettingsScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(currentLanguage);

  const handleLanguageSelect = async (languageCode: string) => {
    setSelectedLanguage(languageCode);
    await changeLanguage(languageCode);
    // Dil değiştiğinde ekranı yeniden render etmek için navigation.goBack() kullanabiliriz
    // veya kullanıcıya başarı mesajı gösterebiliriz
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.default },
      ]}
      edges={['top']}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <BackButton width={28} height={28} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text
          style={[
            styles.headerTitle,
            {
              color: theme.colors.text.primary,
              fontFamily: theme.typography.fontFamily.bold,
            },
          ]}
        >
          {t('settings.appLanguage')}
        </Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            styles.description,
            {
              color: theme.colors.text.secondary,
              fontFamily: theme.typography.fontFamily.regular,
            },
          ]}
        >
          {t('settings.languageDescription')}
        </Text>

        {/* Language Options */}
        <View style={styles.languageList}>
          {availableLanguages.map((language) => {
            const isSelected = selectedLanguage === language.code;
            return (
              <TouchableOpacity
                key={language.code}
                onPress={() => handleLanguageSelect(language.code)}
                activeOpacity={0.7}
                style={[
                  styles.languageItem,
                  { backgroundColor: theme.colors.background.paper },
                  isSelected && {
                    backgroundColor: 'rgba(13, 156, 221, 0.08)',
                    borderColor: '#0d9cdd',
                    borderWidth: 2,
                  },
                ]}
              >
                <View style={styles.languageLeft}>
                  <Text style={styles.flag}>{language.flag}</Text>
                  <Text
                    style={[
                      styles.languageName,
                      {
                        color: theme.colors.text.primary,
                        fontFamily: theme.typography.fontFamily.bold,
                      },
                    ]}
                  >
                    {language.name}
                  </Text>
                </View>
                {isSelected && (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color="#0d9cdd"
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerPlaceholder: {
    width: 28,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 24,
  },
  languageList: {
    gap: 12,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  languageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  flag: {
    fontSize: 32,
  },
  languageName: {
    fontSize: 18,
  },
});

export default LanguageSettingsScreen;

