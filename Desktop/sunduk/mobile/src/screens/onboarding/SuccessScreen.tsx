import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, useWindowDimensions, Animated, Easing } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useTheme, useThemeContext } from '../../theme/useTheme';
import { Button } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { OnboardingStackParamList } from '../../navigation/OnboardingStack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SplashMascot from '../../components/SplashMascot';
import SpeechBubble from '../../components/SpeechBubble';
import Confetti from '../../components/Confetti';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getToken } from '../../services/api';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Success'>;

const SuccessScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { isDarkMode } = useThemeContext();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const { setAuthenticated } = useAuth();
  
  // Zıplama animasyonu için animated value
  const bounceAnim = useRef(new Animated.Value(0)).current;

  const handleContinue = async () => {
    // Onboarding'i tamamlandı olarak işaretle
    await AsyncStorage.setItem('onboarding_completed', 'true');

    // Token'ı kontrol et ve authentication state'ini güncelle
    const token = await getToken();
    if (token) {
      setAuthenticated(true);
      // Navigation AppNavigator tarafından otomatik olarak yönetilecek
      // Token varsa ve authenticated true ise, AppNavigator TabNavigator'ı gösterecek
    }
  };

  // Content area - Figma: x=24, y=146, width=382, height=547
  // Center vertically: calc(50% - 46.5px) from top
  const contentTop = (screenHeight - insets.top - insets.bottom - 547) / 2 - 46.5;

  // Zıplama animasyonu
  useEffect(() => {
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -30, // Yukarı zıpla
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0, // Aşağı in
          duration: 400,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.delay(200), // Kısa bekleme
      ])
    );
    
    bounceAnimation.start();
    
    return () => {
      bounceAnimation.stop();
    };
  }, [bounceAnim]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.default }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Konfeti efekti - ekran açılır açılmaz */}
        <Confetti count={60} />
        {/* Speech Bubble - Maskotun üstünde, WelcomeScreen gibi */}
        <View style={[styles.speechBubbleContainer, { 
          top: contentTop + 13, 
          left: (screenWidth - 360) / 2 // Center bubble like WelcomeScreen
        }]}>
          <SpeechBubble width={360} height={90} />
          <View style={styles.speechTextContainer}>
            <Text style={[styles.hurrayText, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
              {t('onboarding.success.hurray')}
            </Text>
          </View>
        </View>

        {/* Main Content Area - Figma: x=24, y=146, width=382, height=547 */}
        <View style={[styles.contentWrapper, { top: insets.top + 44 + contentTop, width: screenWidth - 48 }]}>
          {/* Frame - Figma: height=362px, width=382px */}
          <View style={[styles.frameContainer, { width: Math.min(382, screenWidth - 48) }]}>
            {/* Character - Centered mascot with bounce animation */}
            <Animated.View 
              style={[
                styles.characterContainer,
                {
                  transform: [{ translateY: bounceAnim }],
                }
              ]}
            >
              <SplashMascot size={288} />
            </Animated.View>
          </View>

          {/* Text Section - Figma: y=402, gap=4px */}
          <View style={styles.textSection}>
            <Text style={[styles.welcomeText, { color: isDarkMode ? '#FFFFFF' : '#000000', fontFamily: theme.typography.fontFamily.bold }]}>
              {t('onboarding.success.title')}
            </Text>
            <Text style={[styles.subtitleText, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.bold }]}>
              {t('onboarding.success.subtitle')}
            </Text>
          </View>
        </View>

        {/* Bottom Button - Figma: absolute bottom, height=118 */}
        <View style={[styles.buttonContainer, { backgroundColor: theme.colors.background.paper, borderTopColor: theme.colors.border.light }]}>
          <Button
            title={t('onboarding.success.continueToHome')}
            onPress={handleContinue}
            variant="primary"
            size="large"
            fullWidth
            style={styles.continueButton}
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
    left: 24, // Figma: x=24
    gap: 40, // Figma: gap-[40px]
    alignItems: 'center',
  },
  frameContainer: {
    width: 382, // Figma exact: 382px
    height: 400, // Increased for larger mascot
    position: 'relative',
    alignSelf: 'center', // Frame'i contentWrapper içinde ortala
  },
  characterContainer: {
    position: 'absolute',
    top: 50, // Adjusted for larger mascot
    left: '50%', // Ortalamak için
    marginLeft: -144, // Mascot genişliğinin yarısı (288/2 = 144)
    width: 288,
    height: 288,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2, // Karakteri speech bubble'ın üstünde göster
  },
  speechBubbleContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10, // Match WelcomeScreen zIndex
  },
  speechTextContainer: {
    position: 'absolute',
    left: 40, // Match WelcomeScreen
    top: 16, // Match WelcomeScreen
    right: 40, // Match WelcomeScreen
    alignItems: 'center',
    justifyContent: 'center',
  },
  hurrayText: {
    fontSize: 20, // Match Welcome screen speechText
    fontWeight: '700',
    lineHeight: 32, // Match Welcome screen speechText
    letterSpacing: 0,
    textAlign: 'center',
    width: '100%', // Ensure text takes full width for centering
  },
  textSection: {
    width: '100%',
    gap: 4, // Figma: gap-[4px]
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 48, // Figma: text-[48px]
    fontWeight: '700', // Figma: font-bold
    lineHeight: 76.8, // Figma: leading-[1.6] (48 * 1.6)
    letterSpacing: 0,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 20, // Figma: text-[20px]
    fontWeight: '700', // Figma: font-bold
    lineHeight: 32, // Figma: leading-[1.6] (20 * 1.6)
    letterSpacing: 0,
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 32, // Match Welcome screen
    paddingTop: 24, // Figma: pt-[24px]
    paddingBottom: 36, // Figma: pb-[36px]
    borderTopWidth: 1,
  },
  continueButton: {
    backgroundColor: '#0d9cdd',
    borderRadius: 100, // Figma: rounded-[100px]
    paddingVertical: 15, // Match Welcome screen
    paddingHorizontal: 16, // Figma: px-[16px]
    shadowColor: '#0d9cdd',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default SuccessScreen;
