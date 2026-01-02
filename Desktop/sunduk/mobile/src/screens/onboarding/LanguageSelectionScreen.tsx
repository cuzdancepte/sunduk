import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, useWindowDimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { useTheme, useThemeContext } from '../../theme/useTheme';
import { Button, ProgressBar } from '../../components/ui';
import { OnboardingStackParamList } from '../../navigation/OnboardingStack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Character from '../../components/Character';
import Bubble1 from '../../components/Bubble1';
import BackButton from '../../components/BackButton';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'LanguageSelection'>;

// Native & App Language seçenekleri
const nativeLanguages = [
  { code: 'id', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'zh', name: 'Mandarin', flag: '🇨🇳' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
];

const appLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
];

const LanguageSelectionScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { isDarkMode } = useThemeContext();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [selectedAppLanguage, setSelectedAppLanguage] = useState<string>('en');
  const [nativeLanguage, setNativeLanguage] = useState<string>('id'); // Default: Indonesia
  const [showNativeOptions, setShowNativeOptions] = useState(false);

  // Progress: 3. ekran, toplam 7 ekran (1:Splash, 2:Welcome, 3:Language, 11:Name, 13:Email, 14:Password, 15:Success)
  // Progress bar: 3/7 = %42.86, width: ~92px / 216px
  const progress = 92 / 216; // Yaklaşık %42.86

  // Speech bubble responsive width: ekrana göre ayarla
  const speechBubbleWidth = Math.min(242, screenWidth - 140 - 48); // 140 (character) + 48 (padding)

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.default }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Top Bar - Figma: y=0, height=44 */}
        <View style={[styles.topBar, { top: insets.top }]}>
          <Text style={[styles.timeText, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.semiBold }]}>
            9:41
          </Text>
        </View>

        {/* Main Content Area - Figma: x=24, y=44, width=382, height=888 */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: 200 }, // Bottom button için alan bırak
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Progress Bar Section - Figma: height=48px */}
          <View style={styles.progressBarSection}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <BackButton width={28} height={28} color={theme.colors.text.primary} />
            </TouchableOpacity>
            <View style={styles.progressBarContainer}>
              <ProgressBar
                progress={progress * 100}
                height={12}
                color="#6949FF"
                backgroundColor="#EEEEEE"
                style={styles.progressBar}
              />
            </View>
            <View style={styles.rightSpacer} />
          </View>

          {/* Character + Speech Bubble Section - Figma: height=140px */}
          <View style={[styles.characterSection, { width: '100%' }]}>
            {/* Character Frame - Figma: x=0, y=0, width=140, height=140 */}
            <View style={styles.characterFrame}>
              {/* Character - Figma: x=10, y=1, width=120, height=138.65 */}
              <View style={styles.characterContainer}>
                <Character width={120} height={139} />
              </View>
            </View>
            {/* Speech Bubble Group - Figma: x=140, y=12, width=242, height=116 */}
            <View style={[styles.speechBubbleGroup, { width: speechBubbleWidth }]}>
              <Bubble1 width={speechBubbleWidth} height={116} />
              <View style={styles.speechTextContainer}>
                <Text style={[styles.speechText, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
                  What language do you want to use for Sunduk?
                </Text>
              </View>
            </View>
          </View>

          {/* Divider - Figma: y=172, height=0 (1px line) */}
          <View style={[styles.divider, { backgroundColor: theme.colors.border.light }]} />

          {/* Language Selection Section - Figma: y=204, gap=20px */}
          <View style={styles.languageSection}>
            {/* Your Native Language */}
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
              {t('onboarding.languageSelection.title')}
            </Text>
            {(() => {
              const currentNative =
                nativeLanguages.find(lang => lang.code === nativeLanguage) ??
                nativeLanguages[0];

              return (
                <>
                  <TouchableOpacity
                    style={styles.selectedLanguageCard}
                    activeOpacity={0.8}
                    onPress={() => setShowNativeOptions(prev => !prev)}
                  >
                    <Text style={styles.flag}>{currentNative.flag}</Text>
                    <Text
                      style={[
                        styles.languageName,
                        {
                          color: theme.colors.text.primary,
                          fontFamily: theme.typography.fontFamily.bold,
                        },
                      ]}
                    >
                      {currentNative.name}
                    </Text>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => setShowNativeOptions(prev => !prev)}
                    >
                      <Text
                        style={[
                          styles.changeButton,
                          {
                            color: '#6949FF',
                            fontFamily: theme.typography.fontFamily.bold,
                          },
                        ]}
                      >
                        Change
                      </Text>
                    </TouchableOpacity>
                  </TouchableOpacity>

                  {showNativeOptions && (
                    <View style={styles.nativeOptionsContainer}>
                      {nativeLanguages
                        .filter(lang => lang.code !== nativeLanguage)
                        .map(lang => (
                          <TouchableOpacity
                            key={lang.code}
                            onPress={() => {
                              setNativeLanguage(lang.code);
                              setShowNativeOptions(false);
                            }}
                            activeOpacity={0.7}
                            style={[styles.languageCard, styles.unselectedCard, { 
                              backgroundColor: theme.colors.background.paper,
                              borderColor: theme.colors.border.light,
                            }]}
                          >
                            <Text style={styles.flag}>{lang.flag}</Text>
                            <Text
                              style={[
                                styles.languageName,
                                {
                                  color: theme.colors.text.primary,
                                  fontFamily: theme.typography.fontFamily.bold,
                                },
                              ]}
                            >
                              {lang.name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                    </View>
                  )}
                </>
              );
            })()}

            {/* App Language */}
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
              {t('onboarding.languageSelection.appLanguage')}
            </Text>
            {appLanguages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                onPress={() => setSelectedAppLanguage(lang.code)}
                activeOpacity={0.7}
            style={[
              styles.languageCard,
              selectedAppLanguage === lang.code ? styles.selectedCard : [styles.unselectedCard, { 
                backgroundColor: theme.colors.background.paper,
                borderColor: theme.colors.border.light,
              }],
            ]}
              >
                <Text style={styles.flag}>{lang.flag}</Text>
                <Text style={[styles.languageName, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
                  {lang.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Bottom Button - Figma: absolute bottom, height=118 */}
        <View style={[styles.buttonContainer, { backgroundColor: theme.colors.background.paper, borderTopColor: theme.colors.border.light }]}>
          <Button
            title={t('onboarding.languageSelection.continue')}
            onPress={async () => {
              await AsyncStorage.setItem('onboarding_nativeLanguageId', nativeLanguage);
              await AsyncStorage.setItem('onboarding_appLanguageId', selectedAppLanguage);
              navigation.navigate('Name');
            }}
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
  scrollView: {
    flex: 1,
    marginTop: 44, // Top bar height
  },
  scrollContent: {
    paddingTop: 16, // Figma: pt-[16px]
    paddingHorizontal: 24, // Figma: px-[24px]
    gap: 28, // Figma: gap-[28px]
  },
  progressBarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 48, // Figma exact: 48px
    paddingVertical: 12, // Figma: py-[12px]
    gap: 16, // Figma: gap-[16px]
    marginLeft: -24, // ScrollView padding'ini telafi et
    paddingLeft: 24, // Back button için padding
  },
  backButton: {
    width: 28, // Figma: size-[28px]
    height: 28, // Figma: size-[28px]
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  progressBarContainer: {
    flex: 1,
    maxWidth: 216, // Figma: w-[216px]
  },
  progressBar: {
    width: 216, // Figma exact: 216px
  },
  rightSpacer: {
    width: 28, // Back button width for balance
  },
  characterSection: {
    width: '100%',
    minHeight: 140, // Figma exact: 140px
    marginBottom: 0,
    position: 'relative',
  },
  characterFrame: {
    width: 140, // Figma exact: 140px
    height: 140, // Figma exact: 140px
    position: 'relative',
    flexShrink: 0,
  },
  characterContainer: {
    position: 'absolute',
    left: 10, // Figma: x=10
    top: 1, // Figma: y=1
    width: 120, // Figma exact: 120px
    height: 139, // Figma exact: 138.65px (rounded to 139)
  },
  speechBubbleGroup: {
    position: 'absolute',
    left: 140, // Figma: x=140
    top: 12, // Figma: y=12
    height: 116, // Figma exact: 116px
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  speechTextContainer: {
    position: 'absolute',
    left: 20, // Sola kaydırıldı - daha iyi görünüm için
    top: 10, // Figma: y=22 - bubble y=12 = 10px
    right: 20, // Sağdan da padding
    alignItems: 'center',
    justifyContent: 'center',
  },
  speechText: {
    fontSize: 20, // Figma: text-[20px]
    fontWeight: '700', // Figma: font-bold
    lineHeight: 32, // Figma: leading-[1.6] (20 * 1.6)
    letterSpacing: 0,
    textAlign: 'center',
  },
  divider: {
    height: 1, // Figma: height=0 (1px line)
    width: '100%',
  },
  languageSection: {
    gap: 20, // Figma: gap-[20px]
  },
  sectionTitle: {
    fontSize: 24, // Figma: text-[24px]
    fontWeight: '700', // Figma: font-bold
    lineHeight: 38.4, // Figma: leading-[1.6] (24 * 1.6)
    letterSpacing: 0,
    marginBottom: 0,
  },
  selectedLanguageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(105, 73, 255, 0.08)', // Figma: bg-[rgba(105,73,255,0.08)]
    borderWidth: 4, // Figma: border-4
    borderColor: '#6949FF', // Figma: border-[#6949ff]
    borderRadius: 24, // Figma: rounded-[24px]
    paddingHorizontal: 20, // Figma: px-[20px]
    paddingVertical: 12, // Figma: py-[12px]
    gap: 24, // Figma: gap-[24px]
    height: 84, // Figma exact: 84px
    marginTop: 20, // Gap between title and card
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24, // Figma: rounded-[24px]
    paddingHorizontal: 20, // Figma: px-[20px]
    paddingVertical: 12, // Figma: py-[12px]
    gap: 24, // Figma: gap-[24px]
    height: 84, // Figma exact: 84px
  },
  selectedCard: {
    backgroundColor: 'rgba(105, 73, 255, 0.08)', // Figma: bg-[rgba(105,73,255,0.08)]
    borderWidth: 4, // Figma: border-4
    borderColor: '#6949FF', // Figma: border-[#6949ff]
  },
  unselectedCard: {
    borderWidth: 2, // Figma: border-2
  },
  flag: {
    fontSize: 60, // Figma: text-[60px]
    width: 60, // Figma exact: 60px
    height: 60, // Figma exact: 60px
    textAlign: 'center',
    lineHeight: 60,
  },
  languageName: {
    flex: 1,
    fontSize: 24, // Figma: text-[24px]
    fontWeight: '700', // Figma: font-bold
    lineHeight: 38.4, // Figma: leading-[1.6] (24 * 1.6)
    letterSpacing: 0,
  },
  changeButton: {
    fontSize: 18, // Figma: text-[18px]
    fontWeight: '700', // Figma: font-bold
    lineHeight: 28.8, // Figma: leading-[1.6] (18 * 1.6)
    letterSpacing: 0,
    textAlign: 'right',
  },
  nativeOptionsContainer: {
    marginTop: 12,
    gap: 12,
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

export default LanguageSelectionScreen;
