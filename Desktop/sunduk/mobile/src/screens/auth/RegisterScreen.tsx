import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { authAPI } from '../../services/api';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [nativeLanguageId, setNativeLanguageId] = useState('');
  const [learningLanguageId, setLearningLanguageId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !username || !nativeLanguageId || !learningLanguageId) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    setLoading(true);
    try {
      await authAPI.register(
        email,
        password,
        username,
        nativeLanguageId,
        learningLanguageId
      );
      Alert.alert('Başarılı', 'Kayıt başarıyla tamamlandı', [
        {
          text: 'Tamam',
          onPress: () => navigation.navigate('Login'),
        },
      ]);
    } catch (error: any) {
      console.error('Register error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Kayıt yapılamadı';
      Alert.alert(
        'Kayıt Hatası',
        errorMessage
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Kayıt Ol</Text>

      <TextInput
        style={styles.input}
        placeholder="Kullanıcı Adı"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Ana Dil ID (örn: clx789def012)"
        value={nativeLanguageId}
        onChangeText={setNativeLanguageId}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Öğrenilen Dil ID (örn: clx123abc456)"
        value={learningLanguageId}
        onChangeText={setLearningLanguageId}
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Kayıt Ol</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.linkText}>Zaten hesabınız var mı? Giriş yapın</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 30,
    color: '#6200ee',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6200ee',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 40,
  },
  linkText: {
    color: '#6200ee',
    fontSize: 14,
  },
});

export default RegisterScreen;

