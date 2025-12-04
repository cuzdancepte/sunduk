import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import tr from './locales/tr.json';
import en from './locales/en.json';
import ru from './locales/ru.json';

const LANGUAGE_STORAGE_KEY = 'app_language';

// AsyncStorage'dan dil tercihini yükle
const loadLanguage = async (): Promise<string> => {
  try {
    // Önce onboarding'de seçilen dili kontrol et
    const onboardingLanguage = await AsyncStorage.getItem('onboarding_appLanguageId');
    if (onboardingLanguage && ['tr', 'en', 'ru'].includes(onboardingLanguage)) {
      return onboardingLanguage;
    }
    
    // Sonra genel app language'i kontrol et
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage && ['tr', 'en', 'ru'].includes(savedLanguage)) {
      return savedLanguage;
    }
    
    // Varsayılan dil: İngilizce
    return 'en';
  } catch (error) {
    console.error('Error loading language:', error);
    return 'en';
  }
};

// Dil değiştiğinde AsyncStorage'a kaydet
const saveLanguage = async (language: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    // Onboarding dilini de güncelle
    await AsyncStorage.setItem('onboarding_appLanguageId', language);
  } catch (error) {
    console.error('Error saving language:', error);
  }
};

// i18n konfigürasyonu
i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: {
      tr: { translation: tr },
      en: { translation: en },
      ru: { translation: ru },
    },
    lng: 'en', // Varsayılan dil, loadLanguage ile güncellenecek
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React zaten escape ediyor
    },
    react: {
      useSuspense: false, // React Native için Suspense kullanmıyoruz
    },
  });

// Uygulama başladığında dil tercihini yükle
loadLanguage().then((language) => {
  i18n.changeLanguage(language);
});

// Dil değiştiğinde kaydet
i18n.on('languageChanged', (language) => {
  saveLanguage(language);
});

export default i18n;

