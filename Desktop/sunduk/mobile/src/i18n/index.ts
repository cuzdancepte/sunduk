import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';

import tr from './locales/tr.json';
import en from './locales/en.json';
import ru from './locales/ru.json';

const LANGUAGE_STORAGE_KEY = 'app_language';

// Telefon dilini algıla ve desteklenen dile çevir
const getDeviceLanguage = (): string => {
  try {
    // Telefonun dil kodunu al (örn: 'tr-TR', 'en-US', 'ru-RU')
    const deviceLocale = Localization.locale || Localization.getLocales()[0]?.languageCode || 'en';
    
    // Sadece dil kodunu al (örn: 'tr', 'en', 'ru')
    const languageCode = deviceLocale.split('-')[0].toLowerCase();
    
    // Desteklenen dilleri kontrol et
    if (languageCode === 'tr') {
      return 'tr';
    } else if (languageCode === 'ru') {
      return 'ru';
    } else if (languageCode === 'en') {
      return 'en';
    }
    
    // Diğer diller için varsayılan: İngilizce
    return 'en';
  } catch (error) {
    console.error('Error getting device language:', error);
    return 'en';
  }
};

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
    
    // Eğer kullanıcı daha önce bir dil seçmemişse, telefon dilini kullan
    return getDeviceLanguage();
  } catch (error) {
    console.error('Error loading language:', error);
    // Hata durumunda telefon dilini kullan
    return getDeviceLanguage();
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

