import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, useWindowDimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../theme/useTheme';
import { Button } from '../../components/ui';
import { OnboardingStackParamList } from '../../navigation/OnboardingStack';
import WelcomeLogo from '../../components/WelcomeLogo';
import SpeechBubble from '../../components/SpeechBubble';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Welcome'>;

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();

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

        {/* Main Content - Figma: x=24, calculated top position */}
        <View style={[styles.contentWrapper, { top: contentTop, width: contentWidth, left: (screenWidth - contentWidth) / 2 }]}>
          {/* Character Container - Figma: Frame x=0, y=0, width=382, height=348 */}
          <View style={styles.characterContainer}>
            {/* Speech Bubble - Figma: Group x=91, y=13, width=200, height=64 */}
            <View style={styles.speechBubbleContainer}>
              <SpeechBubble width={200} height={64} />
              <View style={styles.speechTextContainer}>
                <Text style={[styles.speechText, { color: '#212121', fontFamily: theme.typography.fontFamily.bold }]}>
                  Hi there! I'm El!
                </Text>
              </View>
            </View>
            {/* Character Logo - Figma: x=102, y=105, width=200, height=243.46 */}
            <View style={styles.logoContainer}>
              <WelcomeLogo width={200} height={243.46} />
            </View>
          </View>

          {/* Text Container - Figma: x=0, y=388, width=382, height=145 */}
          <View style={styles.textContainer}>
            <Text style={[styles.appName, { color: '#6949FF', fontFamily: theme.typography.fontFamily.bold }]}>
              {t('onboarding.welcome.title')}
            </Text>
            <Text 
              style={[styles.subtitle, { color: '#616161', fontFamily: theme.typography.fontFamily.bold }]}
              numberOfLines={0}
            >
              {t('onboarding.welcome.subtitle')}
            </Text>
          </View>
        </View>

        {/* Bottom Buttons - Absolute positioned at bottom */}
        <View style={styles.buttonContainer}>
          <Button
            title={t('onboarding.welcome.getStarted')}
            onPress={() => navigation.navigate('LanguageSelection')}
            variant="primary"
            size="large"
            fullWidth
            style={[styles.startButton, { 
              backgroundColor: '#6949FF',
              borderRadius: 100,
              paddingVertical: 18,
              paddingHorizontal: 16,
              shadowColor: '#6949FF',
              shadowOffset: { width: 4, height: 8 },
              shadowOpacity: 0.25,
              shadowRadius: 24,
              elevation: 8,
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
              backgroundColor: '#F0EDFF',
              borderColor: 'transparent',
              borderRadius: 100,
              paddingVertical: 18,
              paddingHorizontal: 16,
            }]}
            textStyle={{ color: '#6949FF', fontFamily: theme.typography.fontFamily.bold }}
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
  },
  timeText: {
    fontSize: 16, // Figma: text-[16px]
    fontWeight: '600', // Figma: font-semibold
    letterSpacing: 0.2, // Figma: tracking-[0.2px]
    lineHeight: 22.4, // Figma: leading-[1.4]
  },
  contentWrapper: {
    position: 'absolute',
    height: 533, // Figma exact: 533px
  },
  characterContainer: {
    width: 382, // Figma exact: 382px
    height: 348, // Figma exact: 348px
    position: 'relative',
  },
  speechBubbleContainer: {
    position: 'absolute',
    top: 13, // Figma exact: y=13
    left: 91, // Figma exact: x=91
    width: 200, // Figma exact: 200px
    height: 64, // Figma exact: 64px
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  speechTextContainer: {
    position: 'absolute',
    left: 28, // Figma: text x=119 - bubble x=91 = 28px
    top: 8, // Figma: text y=21 - bubble y=13 = 8px
    width: 144, // Figma exact: 144px
    height: 32, // Figma exact: 32px
    alignItems: 'center',
    justifyContent: 'center',
  },
  speechText: {
    fontSize: 20, // Figma: text-[20px]
    fontWeight: '700', // Figma: font-bold
    lineHeight: 32, // Figma: leading-[1.6] (20 * 1.6)
    textAlign: 'center',
  },
  logoContainer: {
    position: 'absolute',
    top: 105, // Figma exact: y=105
    left: '50%', // Ortalamak için
    marginLeft: -100, // Logo width'in yarısı (200/2 = 100)
    width: 200, // Figma exact: 200px
    height: 243.46, // Figma exact: 243.46165466308594px
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
    paddingHorizontal: 24, // Figma: px-[24px]
    paddingTop: 24, // Figma: pt-[24px]
    paddingBottom: 36, // Figma: pb-[36px]
    gap: 24, // Figma: gap-[24px]
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE', // Figma: border-neutral-100
    backgroundColor: '#FFFFFF',
  },
  startButton: {
    marginBottom: 0,
  },
  loginButton: {
    marginTop: 0,
  },
});

export default WelcomeScreen;

