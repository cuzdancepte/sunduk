import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../theme/useTheme';
import { Button, Card } from '../../components/ui';
import { AppStackParamList } from '../../navigation/AppStack';

type Props = NativeStackScreenProps<AppStackParamList, 'Premium'>;

const PremiumScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const features = [
    { icon: '📚', titleKey: 'premium.features.unlimitedWords', descKey: 'premium.features.unlimitedWordsDesc' },
    { icon: '💬', titleKey: 'premium.features.unlimitedDialogs', descKey: 'premium.features.unlimitedDialogsDesc' },
    { icon: '🎯', titleKey: 'premium.features.allLevels', descKey: 'premium.features.allLevelsDesc' },
    { icon: '🇹🇷', titleKey: 'premium.features.turkeyInfo', descKey: 'premium.features.turkeyInfoDesc' },
    { icon: '🗣️', titleKey: 'premium.features.unlimitedPhrases', descKey: 'premium.features.unlimitedPhrasesDesc' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.default }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="close" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
          {t('premium.title')}
        </Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.crownContainer}>
            <Text style={styles.crownIcon}>👑</Text>
          </View>
          <Text style={[styles.heroTitle, { color: '#FFFFFF', fontFamily: theme.typography.fontFamily.bold }]}>
            {t('premium.title')}
          </Text>
          <Text style={[styles.heroSubtitle, { color: '#FFFFFF', fontFamily: theme.typography.fontFamily.regular }]}>
            {t('premium.subtitle')}
          </Text>
        </View>

        {/* Features List */}
        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.semiBold }]}>
                  {t(feature.titleKey)}
                </Text>
                <Text style={[styles.featureDescription, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
                  {t(feature.descKey)}
                </Text>
              </View>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            </View>
          ))}
        </View>

        {/* Pricing Cards */}
        <View style={styles.pricingContainer}>
          <Card variant="elevated" padding="large" style={[styles.pricingCard, { backgroundColor: theme.colors.background.paper }]}>
            <Text style={[styles.pricingLabel, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
              {t('premium.monthly')}
            </Text>
            <View style={styles.pricingRow}>
              <Text style={[styles.pricingAmount, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
                ₺99
              </Text>
              <Text style={[styles.pricingPeriod, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
                /{t('premium.perMonth')}
              </Text>
            </View>
            <Button
              title={t('premium.select')}
              onPress={() => navigation.navigate('SelectPaymentMethod', { planId: 'monthly' })}
              variant="primary"
              size="medium"
              fullWidth
              style={styles.pricingButton}
            />
          </Card>

          <Card variant="elevated" padding="large" style={[styles.pricingCard, styles.pricingCardRecommended, { backgroundColor: theme.colors.background.paper }]}>
            <View style={styles.recommendedBadge}>
              <Text style={[styles.recommendedText, { fontFamily: theme.typography.fontFamily.medium }]}>
                {t('premium.recommended')}
              </Text>
            </View>
            <Text style={[styles.pricingLabel, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
              {t('premium.yearly')}
            </Text>
            <View style={styles.pricingRow}>
              <Text style={[styles.pricingAmount, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
                ₺799
              </Text>
              <Text style={[styles.pricingPeriod, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
                /{t('premium.perYear')}
              </Text>
            </View>
            <Text style={[styles.pricingSavings, { color: '#4CAF50', fontFamily: theme.typography.fontFamily.medium }]}>
              {t('premium.savings')}
            </Text>
            <Button
              title={t('premium.select')}
              onPress={() => navigation.navigate('SelectPaymentMethod', { planId: 'yearly' })}
              variant="primary"
              size="medium"
              fullWidth
              style={styles.pricingButton}
            />
          </Card>
        </View>

        {/* Terms */}
        <Text style={[styles.termsText, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
          {t('premium.terms')}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerPlaceholder: {
    width: 40,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    backgroundColor: '#0d9cdd',
    padding: 32,
    alignItems: 'center',
    marginBottom: 32,
  },
  crownContainer: {
    marginBottom: 16,
  },
  crownIcon: {
    fontSize: 64,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.9,
  },
  featuresContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  featureIcon: {
    fontSize: 32,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
  },
  pricingContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 16,
  },
  pricingCard: {
    position: 'relative',
  },
  pricingCardRecommended: {
    borderWidth: 2,
    borderColor: '#0d9cdd',
  },
  recommendedBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    backgroundColor: '#0d9cdd',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendedText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  pricingLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  pricingRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  pricingAmount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  pricingPeriod: {
    fontSize: 16,
    marginLeft: 4,
  },
  pricingSavings: {
    fontSize: 12,
    marginBottom: 16,
  },
  pricingButton: {
    marginTop: 8,
    backgroundColor: '#0d9cdd',
  },
  termsText: {
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 18,
  },
});

export default PremiumScreen;

