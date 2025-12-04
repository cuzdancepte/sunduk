import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, SafeAreaView, StatusBar, useWindowDimensions, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../../theme/useTheme';
import { Button, ProgressBar } from '../../components/ui';
import { OnboardingStackParamList } from '../../navigation/OnboardingStack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackButton from '../../components/BackButton';
import HideIcon from '../../components/HideIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../../services/api';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Name'>;

const NameScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
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
      <StatusBar barStyle="dark-content" />
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
              style={[styles.backButton, { marginHorizontal: 24 }]}
              activeOpacity={0.7}
            >
              <BackButton width={28} height={28} color="#212121" />
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
            <View style={[styles.rightSpacer, { marginHorizontal: 24 }]} />
          </View>

          {/* Content Section - Figma: gap=32px */}
          <View style={styles.contentSection}>
            {/* Title */}
            <View style={styles.titleContainer}>
              <Text style={[styles.title, { color: '#212121', fontFamily: theme.typography.fontFamily.bold }]}>
                Create your account
              </Text>
            </View>

            {/* Full Name Input Section - Figma: gap=16px */}
            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: '#212121', fontFamily: theme.typography.fontFamily.bold }]}>
                Full Name
              </Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, { color: '#212121', fontFamily: theme.typography.fontFamily.bold }]}
                  placeholder="Enter your full name"
                  placeholderTextColor="#9E9E9E"
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
              <Text style={[styles.inputLabel, { color: '#212121', fontFamily: theme.typography.fontFamily.bold }]}>
                Email
              </Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, { color: '#212121', fontFamily: theme.typography.fontFamily.bold }]}
                  placeholder="Enter your email address"
                  placeholderTextColor="#9E9E9E"
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
              <Text style={[styles.inputLabel, { color: '#212121', fontFamily: theme.typography.fontFamily.bold }]}>
                Password
              </Text>
              <View style={styles.inputWrapper}>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={[styles.input, styles.passwordInput, { color: '#212121', fontFamily: theme.typography.fontFamily.bold }]}
                    placeholder="Enter your password"
                    placeholderTextColor="#9E9E9E"
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
                    <HideIcon width={28} height={28} color="#6949FF" />
                  </TouchableOpacity>
                </View>
                <View style={styles.inputUnderline} />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Button - Figma: absolute bottom, height=118 */}
        <View style={styles.buttonContainer}>
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
  scrollView: {
    flex: 1,
    marginTop: 44, // Top bar height
  },
  scrollContent: {
    paddingTop: 16, // Figma: pt-[16px]
    paddingHorizontal: 24, // Figma: px-[24px]
  },
  progressBarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48, // Figma exact: 48px
    paddingVertical: 12, // Figma: py-[12px]
    gap: 16, // Figma: gap-[16px]
    paddingHorizontal: 0, // Removed, handled by marginHorizontal on children
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
    backgroundColor: '#6949FF', // Figma: bg-[#6949ff]
    borderRadius: 100, // Figma: rounded-[100px]
    width: '100%',
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

export default NameScreen;
