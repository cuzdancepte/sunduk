import React, { useState } from 'react';
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
import { useTheme } from '../../theme/useTheme';
import { Button, Card } from '../../components/ui';
import { AppStackParamList } from '../../navigation/AppStack';

type Props = NativeStackScreenProps<AppStackParamList, 'Premium'>;

const PremiumScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [selectedVersion, setSelectedVersion] = useState<1 | 2>(1);

  const features = [
    { icon: '🚫', title: 'Reklamsız Deneyim', description: 'Hiç reklam görmeden öğren' },
    { icon: '♾️', title: 'Sınırsız Ders', description: 'Tüm derslere sınırsız erişim' },
    { icon: '📊', title: 'Detaylı İstatistikler', description: 'İlerlemeni detaylı takip et' },
    { icon: '🎯', title: 'Özel Hedefler', description: 'Kişisel öğrenme hedefleri belirle' },
    { icon: '💬', description: 'Premium Destek', description: '7/24 öncelikli destek' },
    { icon: '🎨', title: 'Özel Temalar', description: 'Uygulamayı kişiselleştir' },
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
          Premium'a Geç
        </Text>
        <TouchableOpacity
          onPress={() => setSelectedVersion(selectedVersion === 1 ? 2 : 1)}
          style={styles.versionToggle}
        >
          <Text style={[styles.versionText, { color: theme.colors.primary.main, fontFamily: theme.typography.fontFamily.medium }]}>
            V{selectedVersion}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={[styles.heroSection, { backgroundColor: theme.colors.primary.main }]}>
          <View style={styles.crownContainer}>
            <Text style={styles.crownIcon}>👑</Text>
          </View>
          <Text style={[styles.heroTitle, { color: theme.colors.text.white, fontFamily: theme.typography.fontFamily.bold }]}>
            Premium'a Geç
          </Text>
          <Text style={[styles.heroSubtitle, { color: theme.colors.text.white, fontFamily: theme.typography.fontFamily.regular }]}>
            Türkçe öğrenme deneyimini bir üst seviyeye taşı
          </Text>
        </View>

        {/* Features List */}
        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.semiBold }]}>
                  {feature.title}
                </Text>
                <Text style={[styles.featureDescription, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
                  {feature.description}
                </Text>
              </View>
              <Ionicons name="checkmark-circle" size={24} color={theme.colors.success.main} />
            </View>
          ))}
        </View>

        {/* Pricing Cards (Version 1) */}
        {selectedVersion === 1 && (
          <View style={styles.pricingContainer}>
            <Card variant="elevated" padding="large" style={styles.pricingCard}>
              <Text style={[styles.pricingLabel, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
                Aylık
              </Text>
              <View style={styles.pricingRow}>
                <Text style={[styles.pricingAmount, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
                  ₺99
                </Text>
                <Text style={[styles.pricingPeriod, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
                  /ay
                </Text>
              </View>
              <Button
                title="Seç"
                onPress={() => navigation.navigate('ChooseSubscriptionPlan', { plan: 'monthly' })}
                variant="primary"
                size="medium"
                fullWidth
                style={styles.pricingButton}
              />
            </Card>

            <Card variant="elevated" padding="large" style={[styles.pricingCard, styles.pricingCardRecommended]}>
              <View style={styles.recommendedBadge}>
                <Text style={[styles.recommendedText, { color: theme.colors.text.white, fontFamily: theme.typography.fontFamily.medium }]}>
                  ÖNERİLEN
                </Text>
              </View>
              <Text style={[styles.pricingLabel, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
                Yıllık
              </Text>
              <View style={styles.pricingRow}>
                <Text style={[styles.pricingAmount, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
                  ₺799
                </Text>
                <Text style={[styles.pricingPeriod, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
                  /yıl
                </Text>
              </View>
              <Text style={[styles.pricingSavings, { color: theme.colors.success.main, fontFamily: theme.typography.fontFamily.medium }]}>
                %33 tasarruf
              </Text>
              <Button
                title="Seç"
                onPress={() => navigation.navigate('ChooseSubscriptionPlan', { plan: 'yearly' })}
                variant="primary"
                size="medium"
                fullWidth
                style={styles.pricingButton}
              />
            </Card>
          </View>
        )}

        {/* Version 2 Layout */}
        {selectedVersion === 2 && (
          <Card variant="elevated" padding="large" style={styles.version2Card}>
            <Text style={[styles.version2Title, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
              Abonelik Planları
            </Text>
            <View style={styles.version2Plans}>
              <TouchableOpacity
                style={styles.version2PlanItem}
                onPress={() => navigation.navigate('ChooseSubscriptionPlan', { plan: 'monthly' })}
              >
                <Text style={[styles.version2PlanName, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.semiBold }]}>
                  Aylık
                </Text>
                <Text style={[styles.version2PlanPrice, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
                  ₺99/ay
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.version2PlanItem, styles.version2PlanItemRecommended]}
                onPress={() => navigation.navigate('ChooseSubscriptionPlan', { plan: 'yearly' })}
              >
                <Text style={[styles.version2PlanName, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.semiBold }]}>
                  Yıllık
                </Text>
                <Text style={[styles.version2PlanPrice, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
                  ₺799/yıl
                </Text>
                <Text style={[styles.version2PlanSavings, { color: theme.colors.success.main, fontFamily: theme.typography.fontFamily.medium }]}>
                  %33 tasarruf
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}

        {/* Terms */}
        <Text style={[styles.termsText, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
          Aboneliği istediğin zaman iptal edebilirsin. Otomatik yenilenir.
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
  versionToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  versionText: {
    fontSize: 12,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
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
    borderColor: '#6949ff',
  },
  recommendedBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    backgroundColor: '#6949ff',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendedText: {
    fontSize: 10,
    fontWeight: '600',
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
  },
  version2Card: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  version2Title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  version2Plans: {
    gap: 12,
  },
  version2PlanItem: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  version2PlanItemRecommended: {
    borderColor: '#6949ff',
    borderWidth: 2,
  },
  version2PlanName: {
    fontSize: 16,
    marginBottom: 4,
  },
  version2PlanPrice: {
    fontSize: 24,
  },
  version2PlanSavings: {
    fontSize: 12,
    marginTop: 4,
  },
  termsText: {
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 18,
  },
});

export default PremiumScreen;

