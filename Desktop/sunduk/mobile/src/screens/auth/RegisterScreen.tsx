import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { authAPI } from '../../services/api';
import { useTheme } from '../../theme/useTheme';
import { Button, Input } from '../../components/ui';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (pwd: string) => {
    return pwd.length >= 6;
  };

  const handleRegister = async () => {
    if (!email || !password || !username) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Hata', 'Geçerli bir email adresi girin');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor');
      return;
    }

    setLoading(true);
    try {
      // Onboarding'de seçilen dil kodlarını al
      const nativeLanguageCode = await AsyncStorage.getItem('onboarding_nativeLanguageId') || 'en';
      const learningLanguageCode = await AsyncStorage.getItem('onboarding_learningLanguageId') || 'tr';

      await authAPI.register(
        email,
        password,
        username,
        nativeLanguageCode, // Backend code'dan ID'ye dönüştürecek
        learningLanguageCode // Backend code'dan ID'ye dönüştürecek
      );
      navigation.navigate('RegisterSuccess');
    } catch (error: any) {
      console.error('Register error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Kayıt yapılamadı';
      Alert.alert('Kayıt Hatası', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.default }]} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo/Header Section */}
        <View style={styles.headerSection}>
          <View style={[styles.logoContainer, { backgroundColor: theme.colors.primary.main }]}>
            <Text style={[styles.logoText, { color: theme.colors.text.white, fontFamily: theme.typography.fontFamily.bold }]}>
              Sunduk
            </Text>
          </View>
          <Text style={[styles.welcomeText, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
            Hesap Oluştur
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
            Türkçe öğrenmeye başlamak için hesabını oluştur
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Input
            label="İsim"
            placeholder="İsminizi girin"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="words"
            containerStyle={styles.inputSpacing}
            leftIcon={<Ionicons name="person-outline" size={20} color={theme.colors.text.secondary} />}
          />

          <Input
            label="Email"
            placeholder="ornek@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            containerStyle={styles.inputSpacing}
            leftIcon={<Ionicons name="mail-outline" size={20} color={theme.colors.text.secondary} />}
            error={email && !validateEmail(email) ? 'Geçerli bir email adresi girin' : undefined}
          />

          <Input
            label="Şifre"
            placeholder="En az 6 karakter"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoComplete="password"
            containerStyle={styles.inputSpacing}
            leftIcon={<Ionicons name="lock-closed-outline" size={20} color={theme.colors.text.secondary} />}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={theme.colors.text.secondary}
                />
              </TouchableOpacity>
            }
            error={password && !validatePassword(password) ? 'Şifre en az 6 karakter olmalıdır' : undefined}
          />

          <Input
            label="Şifreyi Onayla"
            placeholder="Şifrenizi tekrar girin"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            containerStyle={styles.inputSpacing}
            leftIcon={<Ionicons name="lock-closed-outline" size={20} color={theme.colors.text.secondary} />}
            rightIcon={
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={theme.colors.text.secondary}
                />
              </TouchableOpacity>
            }
            error={confirmPassword && password !== confirmPassword ? 'Şifreler eşleşmiyor' : undefined}
          />

          <Button
            title="Kayıt Ol"
            onPress={handleRegister}
            variant="primary"
            size="large"
            fullWidth
            loading={loading}
            disabled={loading || !email || !password || !username || !validateEmail(email) || !validatePassword(password) || password !== confirmPassword}
            style={styles.registerButton}
          />
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={[styles.dividerLine, { backgroundColor: theme.colors.border.light }]} />
          <Text style={[styles.dividerText, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
            veya
          </Text>
          <View style={[styles.dividerLine, { backgroundColor: theme.colors.border.light }]} />
        </View>

        {/* Social Login */}
        <View style={styles.socialSection}>
          <TouchableOpacity style={[styles.socialButton, { borderColor: theme.colors.border.light }]}>
            <Ionicons name="logo-google" size={24} color={theme.colors.text.primary} />
            <Text style={[styles.socialButtonText, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.medium }]}>
              Google ile Kayıt Ol
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.socialButton, { borderColor: theme.colors.border.light }]}>
            <Ionicons name="logo-apple" size={24} color={theme.colors.text.primary} />
            <Text style={[styles.socialButtonText, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.medium }]}>
              Apple ile Kayıt Ol
            </Text>
          </TouchableOpacity>
        </View>

        {/* Login Link */}
        <View style={styles.loginSection}>
          <Text style={[styles.loginText, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
            Zaten hesabın var mı?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.loginLink, { color: theme.colors.primary.main, fontFamily: theme.typography.fontFamily.semiBold }]}>
              Giriş Yap
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 40,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  formSection: {
    marginBottom: 24,
  },
  inputSpacing: {
    marginBottom: 20,
  },
  registerButton: {
    marginTop: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  socialSection: {
    gap: 12,
    marginBottom: 32,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  socialButtonText: {
    fontSize: 16,
  },
  loginSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingBottom: 20,
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
  },
});

export default RegisterScreen;
