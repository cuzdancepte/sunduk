import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, useWindowDimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme, useThemeContext } from '../../theme/useTheme';
import { Button } from '../../components/ui';
import { OnboardingStackParamList } from '../../navigation/OnboardingStack';
import SplashMascot from '../../components/SplashMascot';
import FlyingBird from '../../components/FlyingBird';
import SpeechBubble from '../../components/SpeechBubble';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Welcome'>;

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { isDarkMode } = useThemeContext();
  const { t, i18n } = useTranslation();
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Ekran açıldığında seçilen dili yükle
  useEffect(() => {
    const loadSelectedLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('onboarding_appLanguageId');
        if (savedLanguage && ['tr', 'en', 'ru'].includes(savedLanguage) && i18n.language !== savedLanguage) {
          await i18n.changeLanguage(savedLanguage);
        }
      } catch (error) {
        console.error('Error loading language:', error);
      }
    };
    loadSelectedLanguage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Figma: content top = calc(50% - 83.5px) with translate-y-[-50%]
  // Content center = screen center - 83.5px
  // Content top = content center - (content height / 2)
  // SafeAreaView içindeki alanın ortasından hesaplıyoruz
  const safeAreaHeight = screenHeight - insets.top;
  const screenCenter = safeAreaHeight / 2;
  const contentCenter = screenCenter - 83.5; // Figma: calc(50% - 83.5px)
  const contentTop = contentCenter - 266.5; // translate-y-[-50%] = content height / 2
  
  // Content width: Figma'da 382px ama ekran genişliğine göre ayarla
  const contentWidth = Math.min(382, screenWidth - 48); // 24px padding each side

  // Martı animasyonu için state
  const [birds, setBirds] = useState<Array<{
    id: number;
    startY: number;
    delay: number;
    duration: number;
    direction: 'left' | 'right';
    size: number;
  }>>([]);

  useEffect(() => {
    // İlk 3 martıyı farklı zamanlarda başlat
    const initialDelay = 2000;
    
    // Her 4-6 saniyede bir yeni martı ekle (daha sık)
    const addBird = () => {
      setBirds(prev => {
        // Maksimum 3 martı olsun
        if (prev.length >= 3) {
          return prev;
        }

        const newBird = {
          id: Date.now() + Math.random(),
          startY: Math.random() * 200 + 50, // 50-250 arası rastgele yükseklik
          delay: Math.random() * 1000, // 0-1 saniye rastgele gecikme
          duration: 3000 + Math.random() * 2000, // 3-5 saniye uçuş süresi
          direction: Math.random() > 0.5 ? 'right' : 'left' as 'left' | 'right',
          size: 45 + Math.random() * 30, // 45-75 arası rastgele boyut (%50 büyütülmüş)
        };
        
        // Martı ekrandan çıktıktan sonra listeden kaldır
        setTimeout(() => {
          setBirds(prevBirds => prevBirds.filter(bird => bird.id !== newBird.id));
        }, newBird.duration + newBird.delay + 1000);

        return [...prev, newBird];
      });
    };

    // İlk 3 martıyı farklı zamanlarda başlat
    const firstBirdTimer1 = setTimeout(() => addBird(), initialDelay);
    const firstBirdTimer2 = setTimeout(() => addBird(), initialDelay + 1500);
    const firstBirdTimer3 = setTimeout(() => addBird(), initialDelay + 3000);
    
    // Sonraki martılar için interval (daha sık - 4-6 saniye arası)
    const birdInterval = setInterval(() => {
      addBird();
    }, 4000 + Math.random() * 2000); // 4-6 saniye arası

    return () => {
      clearTimeout(firstBirdTimer1);
      clearTimeout(firstBirdTimer2);
      clearTimeout(firstBirdTimer3);
      clearInterval(birdInterval);
    };
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.default }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Martılar - Maskot'un arkasında */}
        {birds.map(bird => (
          <FlyingBird
            key={bird.id}
            startX={bird.direction === 'right' ? -50 : screenWidth + 50}
            endX={bird.direction === 'right' ? screenWidth + 50 : -50}
            startY={bird.startY}
            duration={bird.duration}
            delay={bird.delay}
            size={bird.size}
            direction={bird.direction}
          />
        ))}

        {/* Speech Bubble - Maskotun üstünde */}
        <View style={[styles.speechBubbleContainer, { 
          top: contentTop + 13, 
          left: (screenWidth - 360) / 2 // Baloncuğu ortala
        }]}>
          <SpeechBubble width={360} height={90} />
              <View style={styles.speechTextContainer}>
            <Text style={[styles.speechText, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
              Merhaba! Benim adım Baran.
                </Text>
              </View>
            </View>

        {/* Character Logo - Full screen width centered */}
        <View style={[styles.logoContainer, { top: contentTop + 20, width: screenWidth }]}>
          <SplashMascot size={288} />
          </View>

        {/* Main Content - Figma: x=24, calculated top position */}
        <View style={[styles.contentWrapper, { top: contentTop, width: contentWidth, left: (screenWidth - contentWidth) / 2 }]}>
          {/* Text Container - Figma: x=0, y=388, width=382, height=145 */}
          <View style={styles.textContainer}>
            <Text style={[styles.appName, { color: isDarkMode ? '#FFFFFF' : '#000000', fontFamily: theme.typography.fontFamily.bold }]}>
              {t('onboarding.welcome.title')}
            </Text>
            <Text 
              style={[styles.subtitle, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.bold }]}
              numberOfLines={0}
            >
              {t('onboarding.welcome.subtitle')}
            </Text>
          </View>
        </View>

        {/* Bottom Buttons - Absolute positioned at bottom */}
        <View style={[styles.buttonContainer, { backgroundColor: theme.colors.background.paper, borderTopColor: theme.colors.border.light }]}>
          <Button
            title={t('onboarding.welcome.getStarted')}
            onPress={() => navigation.navigate('LanguageSelection')}
            variant="primary"
            size="large"
            fullWidth
            style={[styles.startButton, { 
              backgroundColor: '#0d9cdd', // Maskotun atkısındaki açık mavi tonu
              borderRadius: 100,
              paddingVertical: 15, // %15 azaltıldı (18 -> 15)
              paddingHorizontal: 16,
              shadowColor: '#0d9cdd',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }]}
          />
          <Button
            title={t('onboarding.welcome.alreadyHaveAccount')}
            onPress={async () => {
              await AsyncStorage.setItem('onboarding_completed', 'true');
            }}
            variant="outlined"
            size="medium"
            fullWidth
            style={[styles.loginButton, { 
              backgroundColor: isDarkMode ? theme.colors.background.paper : '#FFFFFF', // Dark mode'da tema rengi, light mode'da beyaz
              borderColor: '#0d9cdd', // Maskotun atkısındaki açık mavi border
              borderWidth: 2,
              borderRadius: 100,
              paddingVertical: 15, // %15 azaltıldı (18 -> 15)
              paddingHorizontal: 16,
            }]}
            textStyle={{ color: '#0d9cdd', fontFamily: theme.typography.fontFamily.bold }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  contentWrapper: {
    position: 'absolute',
    height: 533, // Figma exact: 533px
  },
  speechBubbleContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  speechTextContainer: {
    position: 'absolute',
    left: 40,
    top: 16,
    right: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speechText: {
    fontSize: 20, // Subtitle ile aynı boyut
    fontWeight: '700',
    lineHeight: 32, // Subtitle ile aynı lineHeight
    textAlign: 'center',
  },
  logoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 450, // Larger size
    alignItems: 'center', // Center horizontally
    justifyContent: 'center',
  },
  textContainer: {
    position: 'absolute',
    top: 388, // Figma exact: y=388 (348 + 40 gap)
    left: 0,
    right: 0,
    width: '100%', // Use full width of contentWrapper
    height: 145, // Figma exact: 145px
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 4, // Figma: gap-[4px]
  },
  appName: {
    fontSize: 48, // Figma: text-[48px]
    fontWeight: '700', // Figma: font-bold
    lineHeight: 76.8, // Figma: leading-[1.6] (48 * 1.6)
    letterSpacing: 0,
    textAlign: 'center',
    width: '100%', // Use full width of container
    height: 77, // Figma exact: 77px
  },
  subtitle: {
    fontSize: 20, // Figma: text-[20px]
    fontWeight: '700', // Figma: font-bold
    lineHeight: 32, // Figma: leading-[1.6] (20 * 1.6)
    letterSpacing: 0,
    textAlign: 'center',
    width: '100%', // Use full width of container
    height: 64, // Figma exact: 64px
    alignSelf: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 32, // Artırıldı (24 -> 32)
    paddingTop: 24, // Figma: pt-[24px]
    paddingBottom: 36, // Figma: pb-[36px]
    gap: 24, // Figma: gap-[24px]
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE', // Figma: border-neutral-100
  },
  startButton: {
    marginBottom: 0,
  },
  loginButton: {
    marginTop: 0,
  },
});

export default WelcomeScreen;

