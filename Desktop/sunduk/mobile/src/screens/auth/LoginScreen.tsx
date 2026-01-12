import React, { useState } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { authAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme, useThemeContext } from '../../theme/useTheme';
import { Button, Checkbox } from '../../components/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackButton from '../../components/BackButton';
import HideIcon from '../../components/HideIcon';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { isDarkMode } = useThemeContext();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const { setAuthenticated } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
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
      Alert.alert('Login Error', error.response?.data?.error || 'Login failed');
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
          {/* Header/Greeting - Figma: "Hello there 👋" */}
          <View style={styles.headerSection}>
            <Text style={[styles.greetingText, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
              Hello there 👋
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Email Input */}
            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
                Email
              </Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}
                  placeholder="andrew.ainsley@yourdomain.com"
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
                    <HideIcon width={28} height={28} color="#6949FF" />
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
                  color="#6949FF"
                />
                <Text style={[styles.rememberMeText, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
                  Remember me
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
                activeOpacity={0.7}
              >
                <Text style={[styles.forgotPasswordText, { color: '#6949FF', fontFamily: theme.typography.fontFamily.bold }]}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sign In Button */}
            <View style={styles.buttonContainer}>
              <Button
                title="SIGN IN"
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
    backgroundColor: '#6949FF',
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
    backgroundColor: '#6949FF',
    borderRadius: 100,
    paddingVertical: 18,
    paddingHorizontal: 16,
    shadowColor: '#6949FF',
    shadowOffset: { width: 4, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 8,
  },
});

export default LoginScreen;
