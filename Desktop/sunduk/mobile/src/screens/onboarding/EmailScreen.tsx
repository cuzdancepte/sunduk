import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../../theme/useTheme';
import { Button, Input } from '../../components/ui';
import { OnboardingStackParamList } from '../../navigation/OnboardingStack';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Email'>;

const EmailScreen: React.FC<Props> = ({ route, navigation }) => {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const name = route.params?.name || '';

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.default }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
            Email adresin nedir? 📧
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
            Hesabını oluşturmak için email adresine ihtiyacımız var
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Input
            label="Email"
            placeholder="ornek@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoFocus
            error={email && !validateEmail(email) ? 'Geçerli bir email adresi girin' : undefined}
          />
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title="Devam Et"
          onPress={() => navigation.navigate('Password', { name, email })}
          variant="primary"
          size="large"
          fullWidth
          disabled={!email.trim() || !validateEmail(email)}
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

export default EmailScreen;

