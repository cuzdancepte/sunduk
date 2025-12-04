import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../../theme/useTheme';
import { Button } from '../../components/ui';
import { AppStackParamList } from '../../navigation/AppStack';

type Props = NativeStackScreenProps<AppStackParamList, 'SubscriptionSuccess'>;

const SubscriptionSuccessScreen: React.FC<Props> = ({ route, navigation }) => {
  const theme = useTheme();
  const { planId } = route.params;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.default }]}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.success.main}20` }]}>
          <Text style={styles.successIcon}>🎉</Text>
        </View>

        <Text style={[styles.title, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
          Abonelik Başarılı!
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
          Premium üyeliğin aktif. Artık tüm premium özelliklere erişebilirsin!
        </Text>

        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={[styles.featureText, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.regular }]}>
              Reklamsız deneyim
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={[styles.featureText, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.regular }]}>
              Sınırsız ders erişimi
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={[styles.featureText, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.regular }]}>
              Detaylı istatistikler
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Başlayalım"
          onPress={() => {
            // Navigate to home or main screen
            navigation.getParent()?.goBack();
          }}
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
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  successIcon: {
    fontSize: 64,
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
    marginBottom: 32,
  },
  featuresList: {
    width: '100%',
    paddingHorizontal: 20,
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkmark: {
    fontSize: 20,
    color: '#1bac4b',
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 16,
  },
  buttonContainer: {
    paddingBottom: 40,
  },
});

export default SubscriptionSuccessScreen;

