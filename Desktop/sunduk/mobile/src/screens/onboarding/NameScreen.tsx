import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, SafeAreaView, StatusBar, useWindowDimensions, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme, useThemeContext } from '../../theme/useTheme';
import { Button, ProgressBar } from '../../components/ui';
import { OnboardingStackParamList } from '../../navigation/OnboardingStack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackButton from '../../components/BackButton';
import HideIcon from '../../components/HideIcon';
import ShowIcon from '../../components/ShowIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../../services/api';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Name'>;

const NameScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { isDarkMode } = useThemeContext();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Progress: 4. ekran, toplam 5 ekran (Splash, Welcome, Language, Name, Success) = %80
  // Progress bar: 4/5 = %80, width: ~173px / 216px
  const progress = 173 / 216; // Yaklaşık %80

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.default }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
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
              activeOpacity={0.7}
            >
              <BackButton width={28} height={28} color={theme.colors.text.primary} />
            </TouchableOpacity>
            <View style={styles.progressBarContainer}>
              <ProgressBar
                progress={progress * 100}
                height={12}
                color="#0d9cdd"
                backgroundColor="#EEEEEE"
                style={styles.progressBar}
              />
            </View>
            <View style={styles.rightSpacer} />
          </View>

          {/* Content Section - Figma: gap=32px */}
          <View style={styles.contentSection}>
            {/* Title */}
            <View style={styles.titleContainer}>
              <Text style={[styles.title, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
                Create your account
              </Text>
            </View>

            {/* Full Name Input Section - Figma: gap=16px */}
            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
                Full Name
              </Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}
                  placeholder="Enter your full name"
                  placeholderTextColor={theme.colors.text.secondary}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  autoFocus
                />
                <View style={styles.inputUnderline} />
              </View>
            </View>

            {/* Email Input Section - Figma: gap=16px */}
            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
                Email
              </Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}
                  placeholder="Enter your email address"
                  placeholderTextColor={theme.colors.text.secondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <View style={styles.inputUnderline} />
              </View>
            </View>

            {/* Password Input Section - Figma: gap=16px */}
            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
                Password
              </Text>
              <View style={styles.inputWrapper}>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={[styles.input, styles.passwordInput, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}
                    placeholder="Enter your password"
                    placeholderTextColor={theme.colors.text.secondary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIconContainer}
                    activeOpacity={0.7}
                  >
                    {showPassword ? (
                      <ShowIcon width={28} height={28} color="#0d9cdd" />
                    ) : (
                      <HideIcon width={28} height={28} color="#0d9cdd" />
                    )}
                  </TouchableOpacity>
                </View>
                <View style={styles.inputUnderline} />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Button - Figma: absolute bottom, height=118 */}
        <View style={[styles.buttonContainer, { backgroundColor: theme.colors.background.paper, borderTopColor: theme.colors.border.light }]}>
          <Button
            title="Continue"
            onPress={async () => {
              if (!name.trim() || !email.trim() || !password.trim()) {
                return;
              }

              setLoading(true);
              try {
                // AsyncStorage'dan dil bilgilerini al
                const nativeLanguageId = await AsyncStorage.getItem('onboarding_nativeLanguageId') || 'id';
                const appLanguageId = await AsyncStorage.getItem('onboarding_appLanguageId') || 'en';

                // Backend'e kayıt isteği gönder
                // Token otomatik olarak kaydedilecek (authAPI.register içinde)
                await authAPI.register(
                  email.trim(),
                  password,
                  name.trim(),
                  nativeLanguageId,
                  appLanguageId // learningLanguageId olarak kullanılıyor
                );

                // Başarılı kayıt sonrası bilgileri AsyncStorage'a kaydet (opsiyonel, backup için)
                await AsyncStorage.setItem('onboarding_name', name.trim());
                await AsyncStorage.setItem('onboarding_email', email.trim());

                // Success ekranına git (onboarding_completed bayrağı Success ekranında ayarlanacak)
                navigation.navigate('Success');
              } catch (error: any) {
                console.error('Register error:', error);
                const errorMessage = error.response?.data?.error || error.message || 'Kayıt yapılamadı. Lütfen tekrar deneyin.';
                Alert.alert('Kayıt Hatası', errorMessage);
              } finally {
                setLoading(false);
              }
            }}
            variant="primary"
            size="large"
            fullWidth
            disabled={!name.trim() || !email.trim() || !password.trim() || loading}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16, // Figma: pt-[16px]
    paddingHorizontal: 24, // Figma: px-[24px]
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
    zIndex: 1, // Görünürlük için
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
  contentSection: {
    gap: 32, // Figma: gap-[32px] - title ile ilk input arası
    marginTop: 24, // Figma: gap-[24px] from progress bar
  },
  inputSection: {
    gap: 16, // Figma: gap-[16px] - label ile input arası
    marginBottom: 32, // Input alanları arası boşluk
  },
  titleContainer: {
    gap: 12, // Figma: gap-[12px]
  },
  title: {
    fontSize: 32, // Figma: text-[32px]
    fontWeight: '700', // Figma: font-bold
    lineHeight: 51.2, // Figma: leading-[1.6] (32 * 1.6)
    letterSpacing: 0,
  },
  inputLabel: {
    fontSize: 16, // Figma: text-[16px]
    fontWeight: '700', // Figma: font-bold
    lineHeight: 22.4, // Figma: leading-[1.4] (16 * 1.4)
    letterSpacing: 0.2, // Figma: tracking-[0.2px]
  },
  inputWrapper: {
    gap: 8, // Figma: gap-[8px]
  },
  input: {
    fontSize: 24, // Figma: text-[24px]
    fontWeight: '700', // Figma: font-bold
    lineHeight: 38.4, // Figma: leading-[1.6] (24 * 1.6)
    letterSpacing: 0,
    paddingVertical: 0, // TextInput için
    minHeight: 38.4, // Line height ile aynı
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  passwordInput: {
    flex: 1,
    paddingRight: 8, // Eye icon için boşluk
  },
  eyeIconContainer: {
    padding: 4, // Touch area için padding
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputUnderline: {
    height: 1, // Figma: h-px
    backgroundColor: '#0d9cdd', // Welcome ekranı ile aynı renk
    borderRadius: 100, // Figma: rounded-[100px]
    width: '100%',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 32, // Welcome ekranı ile aynı (24 -> 32)
    paddingTop: 24, // Figma: pt-[24px]
    paddingBottom: 36, // Figma: pb-[36px]
    borderTopWidth: 1,
  },
  continueButton: {
    backgroundColor: '#0d9cdd', // Welcome ekranı ile aynı renk
    borderRadius: 100, // Figma: rounded-[100px]
    paddingVertical: 15, // Welcome ekranı ile aynı (18 -> 15)
    paddingHorizontal: 16, // Figma: px-[16px]
    shadowColor: '#0d9cdd',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default NameScreen;
