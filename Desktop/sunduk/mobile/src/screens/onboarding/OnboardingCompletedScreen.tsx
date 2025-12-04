import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../theme/useTheme';
import { Button } from '../../components/ui';
import { OnboardingStackParamList } from '../../navigation/OnboardingStack';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'OnboardingCompleted'>;

const OnboardingCompletedScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();

  const handleComplete = () => {
    // Hesap oluşturma adımlarına geç
    navigation.navigate('Name');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.default }]}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.success.main}20` }]}>
          <Text style={[styles.checkmark, { color: theme.colors.success.main }]}>✓</Text>
        </View>

        <Text style={[styles.title, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
          Harika!
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
          Artık Türkçe öğrenmeye başlayabilirsin. Hadi başlayalım!
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Başlayalım"
          onPress={handleComplete}
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
  },
  buttonContainer: {
    paddingBottom: 40,
  },
});

export default OnboardingCompletedScreen;

