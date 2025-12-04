import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/useTheme';
import { Button, Input } from '../../components/ui';
import { OnboardingStackParamList } from '../../navigation/OnboardingStack';
import { authAPI } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Password'>;

const PasswordScreen: React.FC<Props> = ({ route, navigation }) => {
  const theme = useTheme();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const name = route.params?.name || '';
  const email = route.params?.email || '';

  const validatePassword = (pwd: string) => {
    // En az 6 karakter
    return pwd.length >= 6;
  };

  const handleRegister = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Hata', 'Lütfen şifre alanlarını doldurun');
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
      // TODO: Bu bilgileri onboarding sırasında kaydetmek gerekebilir
      // Şimdilik basit bir kayıt yapıyoruz
      // nativeLanguageId ve learningLanguageId'yi AsyncStorage'dan alabiliriz veya varsayılan değerler kullanabiliriz
      
      // Onboarding sırasında kaydedilen dil bilgilerini al
      const nativeLanguageId = await AsyncStorage.getItem('onboarding_nativeLanguageId') || '';
      const learningLanguageId = await AsyncStorage.getItem('onboarding_learningLanguageId') || '';

      if (!nativeLanguageId || !learningLanguageId) {
        Alert.alert('Hata', 'Dil bilgileri eksik. Lütfen onboarding\'i tekrar başlatın.');
        setLoading(false);
        return;
      }

      // TODO: nativeLanguageId ve learningLanguageId gerçek dil ID'leri olmalı
      // Şimdilik code'ları kullanıyoruz, API'den gerçek ID'leri almak gerekebilir

      await authAPI.register(
        email,
        password,
        name,
        nativeLanguageId,
        learningLanguageId
      );

      // Onboarding tamamlandı
      await AsyncStorage.setItem('onboarding_completed', 'true');
      
      // Success ekranına yönlendir
      navigation.navigate('Success');
    } catch (error: any) {
      console.error('Register error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Kayıt yapılamadı';
      Alert.alert('Kayıt Hatası', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.default }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
            Şifre oluştur 🔐
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
            Güvenli bir şifre seç
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Input
            label="Şifre"
            placeholder="En az 6 karakter"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoFocus
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
            containerStyle={{ marginTop: 16 }}
          />
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title="Onayla"
          onPress={handleRegister}
          variant="primary"
          size="large"
          fullWidth
          loading={loading}
          disabled={!password || !confirmPassword || !validatePassword(password) || password !== confirmPassword || loading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24, // Figma spacing.lg
  },
  header: {
    marginTop: 60, // Figma spacing değeri
    marginBottom: 40, // Figma spacing.xxl
  },
  title: {
    fontSize: 32, // Figma typography.h1
    fontWeight: '700',
    marginBottom: 8, // Figma spacing.sm
  },
  subtitle: {
    fontSize: 16, // Figma typography.body1
  },
  inputContainer: {
    marginTop: 20, // Figma spacing değeri
  },
  buttonContainer: {
    padding: 24, // Figma spacing.lg
    paddingBottom: 40, // Figma spacing.xxl
  },
});

export default PasswordScreen;

