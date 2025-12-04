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

type Props = NativeStackScreenProps<AppStackParamList, 'ChooseSubscriptionPlan'>;

interface Plan {
  id: string;
  name: string;
  price: number;
  period: 'monthly' | 'yearly';
  savings?: number;
  features: string[];
  popular?: boolean;
}

const ChooseSubscriptionPlanScreen: React.FC<Props> = ({ route, navigation }) => {
  const theme = useTheme();
  const initialPlan = route.params?.plan || 'monthly';
  const [selectedPlan, setSelectedPlan] = useState<string>(initialPlan);

  const plans: Plan[] = [
    {
      id: 'monthly',
      name: 'Aylık Plan',
      price: 99,
      period: 'monthly',
      features: [
        'Reklamsız deneyim',
        'Sınırsız ders erişimi',
        'Detaylı istatistikler',
        'Özel hedefler',
      ],
    },
    {
      id: 'yearly',
      name: 'Yıllık Plan',
      price: 799,
      period: 'yearly',
      savings: 33,
      popular: true,
      features: [
        'Reklamsız deneyim',
        'Sınırsız ders erişimi',
        'Detaylı istatistikler',
        'Özel hedefler',
        'Premium destek',
        'Özel temalar',
      ],
    },
  ];

  const handleContinue = () => {
    const plan = plans.find(p => p.id === selectedPlan);
    if (plan) {
      navigation.navigate('SelectPaymentMethod', { planId: plan.id });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.default }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
          Abonelik Planı Seç
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
          İhtiyacına en uygun planı seç
        </Text>

        <View style={styles.plansContainer}>
          {plans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              onPress={() => setSelectedPlan(plan.id)}
              activeOpacity={0.7}
            >
              <Card
                variant="default"
                padding="large"
                style={[
                  styles.planCard,
                  selectedPlan === plan.id && {
                    borderColor: theme.colors.primary.main,
                    borderWidth: 2,
                    backgroundColor: `${theme.colors.primary.main}10`,
                  },
                  plan.popular && styles.popularCard,
                ]}
              >
                {plan.popular && (
                  <View style={[styles.popularBadge, { backgroundColor: theme.colors.primary.main }]}>
                    <Text style={[styles.popularText, { color: theme.colors.text.white, fontFamily: theme.typography.fontFamily.medium }]}>
                      EN POPÜLER
                    </Text>
                  </View>
                )}

                <View style={styles.planHeader}>
                  <Text style={[styles.planName, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
                    {plan.name}
                  </Text>
                  {plan.savings && (
                    <View style={[styles.savingsBadge, { backgroundColor: theme.colors.success.light }]}>
                      <Text style={[styles.savingsText, { color: theme.colors.success.dark, fontFamily: theme.typography.fontFamily.medium }]}>
                        %{plan.savings} Tasarruf
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.priceContainer}>
                  <Text style={[styles.price, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
                    ₺{plan.price}
                  </Text>
                  <Text style={[styles.pricePeriod, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
                    /{plan.period === 'monthly' ? 'ay' : 'yıl'}
                  </Text>
                </View>

                {plan.period === 'yearly' && (
                  <Text style={[styles.monthlyEquivalent, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
                    Aylık ₺{Math.round(plan.price / 12)} olarak
                  </Text>
                )}

                <View style={styles.featuresList}>
                  {plan.features.map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                      <Ionicons name="checkmark-circle" size={20} color={theme.colors.success.main} />
                      <Text style={[styles.featureText, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.regular }]}>
                        {feature}
                      </Text>
                    </View>
                  ))}
                </View>

                {selectedPlan === plan.id && (
                  <View style={[styles.selectedIndicator, { backgroundColor: theme.colors.primary.main }]}>
                    <Ionicons name="checkmark" size={20} color={theme.colors.text.white} />
                  </View>
                )}
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.termsText, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
          Aboneliği istediğin zaman iptal edebilirsin. Otomatik yenilenir.
        </Text>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title="Devam Et"
          onPress={handleContinue}
          variant="primary"
          size="large"
          fullWidth
          disabled={!selectedPlan}
        />
      </View>
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
  placeholder: {
    width: 40,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  plansContainer: {
    gap: 16,
    marginBottom: 24,
  },
  planCard: {
    position: 'relative',
  },
  popularCard: {
    borderWidth: 2,
    borderColor: '#6949ff',
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 10,
    fontWeight: '600',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  savingsBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  savingsText: {
    fontSize: 10,
    fontWeight: '600',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  pricePeriod: {
    fontSize: 16,
    marginLeft: 4,
  },
  monthlyEquivalent: {
    fontSize: 14,
    marginBottom: 16,
  },
  featuresList: {
    marginTop: 16,
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  termsText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});

export default ChooseSubscriptionPlanScreen;

