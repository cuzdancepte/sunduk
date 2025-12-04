import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, useWindowDimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../theme/useTheme';
import { Button } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { OnboardingStackParamList } from '../../navigation/OnboardingStack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CompletedCharacter from '../../components/CompletedCharacter';
import SpeechBubble from '../../components/SpeechBubble';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getToken } from '../../services/api';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Success'>;

const SuccessScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const { setAuthenticated } = useAuth();

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

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.default }]}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Top Bar - Figma: y=0, height=44 */}
        <View style={[styles.topBar, { top: insets.top }]}>
          <Text style={[styles.timeText, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.semiBold }]}>
            9:41
          </Text>
        </View>

        {/* Main Content Area - Figma: x=24, y=146, width=382, height=547 */}
        <View style={[styles.contentWrapper, { top: insets.top + 44 + contentTop, width: screenWidth - 48 }]}>
          {/* Frame - Figma: height=362px, width=382px */}
          <View style={[styles.frameContainer, { width: Math.min(382, screenWidth - 48) }]}>
            {/* Character - Figma: x=96, y=105, width=190, height=256.848 */}
            {/* Frame genişliği 382px, karakter x=96'da, yani ortada: (382-190)/2 = 96 */}
            <View style={styles.characterContainer}>
              <CompletedCharacter width={190} height={257} />
            </View>

            {/* Speech Bubble Group - Figma: x=91, y=13, width=200, height=64 */}
            <View style={styles.speechBubbleContainer}>
              <SpeechBubble width={200} height={64} />
              <View style={styles.speechTextContainer}>
                <Text style={[styles.hurrayText, { color: '#212121', fontFamily: theme.typography.fontFamily.bold }]}>
                  Hurray!!
                </Text>
              </View>
            </View>
          </View>

          {/* Text Section - Figma: y=402, gap=4px */}
          <View style={styles.textSection}>
            <Text style={[styles.welcomeText, { color: '#6949FF', fontFamily: theme.typography.fontFamily.bold }]}>
              {t('onboarding.success.title')}
            </Text>
            <Text style={[styles.subtitleText, { color: '#616161', fontFamily: theme.typography.fontFamily.bold }]}>
              {t('onboarding.success.subtitle')}
            </Text>
          </View>
        </View>

        {/* Bottom Button - Figma: absolute bottom, height=118 */}
        <View style={styles.buttonContainer}>
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
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
  },
  topBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 44, // Figma exact: 44px
    paddingLeft: 23, // Figma: left-[23px]
    justifyContent: 'center',
    zIndex: 10,
  },
  timeText: {
    fontSize: 16, // Figma: text-[16px]
    fontWeight: '600', // Figma: font-semibold
    letterSpacing: 0.2, // Figma: tracking-[0.2px]
    lineHeight: 22.4, // Figma: leading-[1.4]
  },
  contentWrapper: {
    position: 'absolute',
    left: 24, // Figma: x=24
    gap: 40, // Figma: gap-[40px]
    alignItems: 'center',
  },
  frameContainer: {
    width: 382, // Figma exact: 382px
    height: 362, // Figma exact: 362px
    position: 'relative',
    alignSelf: 'center', // Frame'i contentWrapper içinde ortala
  },
  characterContainer: {
    position: 'absolute',
    // Figma: frame width=382, character x=96, width=190
    // Ortalamak için: left: '50%' ve marginLeft: -95 (190/2)
    top: 105, // Figma: y=105
    left: '50%', // Ortalamak için
    marginLeft: -95, // Karakter genişliğinin yarısı (190/2 = 95)
    width: 190, // Figma exact: 190px
    height: 257, // Figma: 256.848px (rounded)
    zIndex: 2, // Karakteri speech bubble'ın üstünde göster
  },
  speechBubbleContainer: {
    position: 'absolute',
    left: 91, // Figma exact: x=91
    top: 13, // Figma: y=13
    width: 200, // Figma exact: 200px
    height: 64, // Figma exact: 64px
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1, // Speech bubble karakterin altında
  },
  speechTextContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hurrayText: {
    fontSize: 20, // Figma: text-[20px]
    fontWeight: '700', // Figma: font-bold
    lineHeight: 32, // Figma: leading-[1.6] (20 * 1.6)
    letterSpacing: 0,
    textAlign: 'center',
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
    paddingHorizontal: 24, // Figma: px-[24px]
    paddingTop: 24, // Figma: pt-[24px]
    paddingBottom: 36, // Figma: pb-[36px]
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE', // Figma: border-neutral-100
    backgroundColor: '#FFFFFF',
  },
  continueButton: {
    backgroundColor: '#6949FF',
    borderRadius: 100, // Figma: rounded-[100px]
    paddingVertical: 18, // Figma: py-[18px]
    paddingHorizontal: 16, // Figma: px-[16px]
    shadowColor: '#6949FF',
    shadowOffset: { width: 4, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 8,
  },
});

export default SuccessScreen;
