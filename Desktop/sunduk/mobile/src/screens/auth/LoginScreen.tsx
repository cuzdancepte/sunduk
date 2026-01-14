import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { authAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme, useThemeContext } from '../../theme/useTheme';
import { Button, Checkbox } from '../../components/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackButton from '../../components/BackButton';
import HideIcon from '../../components/HideIcon';
import ShowIcon from '../../components/ShowIcon';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { isDarkMode } = useThemeContext();
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const { setAuthenticated } = useAuth();

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

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('auth.login.error'), t('auth.login.errorMessage'));
      return;
    }

    setLoading(true);
    try {
      await authAPI.login(email, password);
      if (rememberMe) {
        // Remember me functionality - email'i kaydet
        await AsyncStorage.setItem('remembered_email', email);
      } else {
        await AsyncStorage.removeItem('remembered_email');
      }
      setAuthenticated(true);
      // Navigation will be handled by AppNavigator based on auth state
    } catch (error: any) {
      Alert.alert(t('auth.login.loginError'), error.response?.data?.error || t('auth.login.loginErrorMessage'));
    } finally {
      setLoading(false);
    }
  };

  // Remembered email'i yükle
  React.useEffect(() => {
    const loadRememberedEmail = async () => {
      const remembered = await AsyncStorage.getItem('remembered_email');
      if (remembered) {
        setEmail(remembered);
        setRememberMe(true);
      }
    };
    loadRememberedEmail();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.default }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Top Bar - Figma: y=0, height=44 */}
        <View style={[styles.topBar, { top: insets.top }]}>
          <TouchableOpacity
            onPress={() => {
              // Welcome ekranına geri dön
              AsyncStorage.removeItem('onboarding_completed');
            }}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <BackButton width={28} height={28} color={theme.colors.text.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 44 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header/Greeting */}
          <View style={styles.headerSection}>
            <Text style={[styles.greetingText, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
              {t('auth.login.greeting')}
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Email Input */}
            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
                {t('auth.login.email')}
              </Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}
                  placeholder={t('auth.login.emailPlaceholder')}
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

            {/* Password Input */}
            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
                {t('auth.login.password')}
              </Text>
              <View style={styles.inputWrapper}>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={[styles.input, styles.passwordInput, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}
                    placeholder={t('auth.login.passwordPlaceholder')}
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

            {/* Remember Me & Forgot Password */}
            <View style={styles.optionsRow}>
              <View style={styles.rememberMeContainer}>
                <Checkbox
                  checked={rememberMe}
                  onPress={() => setRememberMe(!rememberMe)}
                  size={24}
                  color="#0d9cdd"
                />
                <Text style={[styles.rememberMeText, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
                  {t('auth.login.rememberMe')}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
                activeOpacity={0.7}
              >
                <Text style={[styles.forgotPasswordText, { color: '#0d9cdd', fontFamily: theme.typography.fontFamily.bold }]}>
                  {t('auth.login.forgotPassword')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sign In Button */}
            <View style={styles.buttonContainer}>
              <Button
                title={t('auth.login.signIn')}
                onPress={handleLogin}
                variant="primary"
                size="large"
                fullWidth
                loading={loading}
                disabled={loading || !email.trim() || !password.trim()}
                style={styles.signInButton}
              />
            </View>
          </View>
        </ScrollView>
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
    height: 44,
    paddingLeft: 24,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  backButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  headerSection: {
    marginTop: 40,
    marginBottom: 40,
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 51.2,
    letterSpacing: 0,
  },
  formSection: {
    flex: 1,
  },
  inputSection: {
    gap: 16,
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22.4,
    letterSpacing: 0.2,
  },
  inputWrapper: {
    gap: 8,
  },
  input: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 38.4,
    letterSpacing: 0,
    paddingVertical: 0,
    minHeight: 38.4,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  passwordInput: {
    flex: 1,
    paddingRight: 8,
  },
  eyeIconContainer: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputUnderline: {
    height: 1,
    backgroundColor: '#0d9cdd',
    borderRadius: 100,
    width: '100%',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rememberMeText: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22.4,
    letterSpacing: 0.2,
  },
  forgotPasswordText: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22.4,
    letterSpacing: 0.2,
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingBottom: 20,
  },
  signInButton: {
    backgroundColor: '#0d9cdd',
    borderRadius: 100,
    paddingVertical: 15,
    paddingHorizontal: 16,
    shadowColor: '#0d9cdd',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default LoginScreen;
