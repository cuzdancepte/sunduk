import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import { useTheme } from '../../theme/useTheme';
import { Button } from '../../components/ui';

type Props = NativeStackScreenProps<AuthStackParamList, 'ResetPasswordSuccess'>;

// Not: Bu ekran, onboarding'deki Success ekranından daha basit bir
// versiyon; sadece kayıt sonrası "hesabın oluşturuldu" mesajı veriyor.
const RegisterSuccessScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.default },
      ]}
    >
      <View style={styles.content}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: `${theme.colors.primary.main}20` },
          ]}
        >
          <Text
            style={[
              styles.checkmark,
              { color: theme.colors.primary.main },
            ]}
          >
            ✓
          </Text>
        </View>

        <Text
          style={[
            styles.title,
            {
              color: theme.colors.text.primary,
              fontFamily: theme.typography.fontFamily.bold,
            },
          ]}
        >
          Hesap Oluşturuldu!
        </Text>
        <Text
          style={[
            styles.subtitle,
            {
              color: theme.colors.text.secondary,
              fontFamily: theme.typography.fontFamily.regular,
            },
          ]}
        >
          Hesabın başarıyla oluşturuldu. Giriş yaparak öğrenmeye
          başlayabilirsin.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Giriş Yap"
          onPress={() => navigation.navigate('Login')}
          variant="primary"
          size="large"
          fullWidth
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  checkmark: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  buttonContainer: {
    paddingBottom: 40,
  },
});

export default RegisterSuccessScreen;


