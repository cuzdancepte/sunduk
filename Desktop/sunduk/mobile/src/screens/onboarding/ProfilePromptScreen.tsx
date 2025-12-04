import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../theme/useTheme';
import { Button } from '../../components/ui';
import { OnboardingStackParamList } from '../../navigation/OnboardingStack';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'ProfilePrompt'>;

const ProfilePromptScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();

  const handleCreateProfile = () => {
    navigation.navigate('Name');
  };

  const handleSkip = async () => {
    // Skip butonuna basıldığında onboarding'i tamamla ama kayıt yapma
    await AsyncStorage.setItem('onboarding_completed', 'true');
    // Ana ekrana yönlendir (AppNavigator otomatik olarak AuthStack'e yönlendirecek)
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.default }]}>
      <View style={styles.content}>
        <View style={styles.characterContainer}>
          <Text style={styles.characterEmoji}>😊</Text>
        </View>

        <Text style={[styles.title, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
          Harika!
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
          Profil oluşturarak ilerlemeni kaydedebilir ve arkadaşlarınla bağlantı kurabilirsin. İstersen atlayabilirsin.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="PROFİL OLUŞTUR"
          onPress={handleCreateProfile}
          variant="primary"
          size="large"
          fullWidth
          style={styles.createButton}
        />
        <Button
          title="ATLA"
          onPress={handleSkip}
          variant="outlined"
          size="large"
          fullWidth
          style={styles.skipButton}
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
  characterContainer: {
    marginBottom: 32,
  },
  characterEmoji: {
    fontSize: 120,
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
    gap: 12,
  },
  createButton: {
    marginBottom: 0,
  },
  skipButton: {
    marginTop: 0,
  },
});

export default ProfilePromptScreen;

