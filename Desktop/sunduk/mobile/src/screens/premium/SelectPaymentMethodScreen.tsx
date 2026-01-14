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
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../theme/useTheme';
import { Button, Card, Input } from '../../components/ui';
import { AppStackParamList } from '../../navigation/AppStack';
import BackButton from '../../components/BackButton';

type Props = NativeStackScreenProps<AppStackParamList, 'SelectPaymentMethod'>;

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  type: 'card' | 'apple' | 'google';
}

const SelectPaymentMethodScreen: React.FC<Props> = ({ route, navigation }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { planId } = route.params;
  const [selectedMethod, setSelectedMethod] = useState<string>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const paymentMethods: PaymentMethod[] = [
    { id: 'card', name: t('payment.creditCard'), icon: '💳', type: 'card' },
    { id: 'apple', name: 'Apple Pay', icon: '🍎', type: 'apple' },
    { id: 'google', name: 'Google Pay', icon: '📱', type: 'google' },
  ];

  const handlePayment = () => {
    // TODO: API call to process payment
    navigation.navigate('SubscriptionSuccess', { planId });
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.slice(0, 19);
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.default }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <BackButton width={28} height={28} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
          {t('payment.title')}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
          {t('payment.selectMethod')}
        </Text>

        {/* Payment Methods */}
        <View style={styles.methodsContainer}>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              onPress={() => setSelectedMethod(method.id)}
              activeOpacity={0.7}
            >
              <Card
                variant="default"
                padding="medium"
                style={[
                  styles.methodCard,
                  { backgroundColor: theme.colors.background.paper },
                  selectedMethod === method.id && styles.methodCardSelected,
                ]}
              >
                <View style={styles.methodContent}>
                  <Text style={styles.methodIcon}>{method.icon}</Text>
                  <Text style={[styles.methodName, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.semiBold }]}>
                    {method.name}
                  </Text>
                  {selectedMethod === method.id && (
                    <Ionicons name="checkmark-circle" size={24} color="#0d9cdd" />
                  )}
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Card Details Form */}
        {selectedMethod === 'card' && (
          <Card variant="default" padding="large" style={[styles.cardForm, { backgroundColor: theme.colors.background.paper }]}>
            <Text style={[styles.formTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
              {t('payment.cardDetails')}
            </Text>

            <Input
              label={t('payment.cardNumber')}
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChangeText={(text) => setCardNumber(formatCardNumber(text))}
              keyboardType="number-pad"
              maxLength={19}
              containerStyle={styles.inputSpacing}
            />

            <Input
              label={t('payment.cardHolder')}
              placeholder={t('payment.cardHolderPlaceholder')}
              value={cardHolder}
              onChangeText={setCardHolder}
              autoCapitalize="words"
              containerStyle={styles.inputSpacing}
            />

            <View style={styles.rowInputs}>
              <Input
                label={t('payment.expiryDate')}
                placeholder="MM/YY"
                value={expiryDate}
                onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                keyboardType="number-pad"
                maxLength={5}
                containerStyle={[styles.inputSpacing, styles.halfInput]}
              />
              <Input
                label="CVV"
                placeholder="123"
                value={cvv}
                onChangeText={(text) => setCvv(text.replace(/\D/g, '').slice(0, 3))}
                keyboardType="number-pad"
                maxLength={3}
                secureTextEntry
                containerStyle={[styles.inputSpacing, styles.halfInput]}
              />
            </View>
          </Card>
        )}

        {/* Summary */}
        <Card variant="default" padding="medium" style={[styles.summaryCard, { backgroundColor: theme.colors.background.paper }]}>
          <Text style={[styles.summaryTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
            {t('payment.summary')}
          </Text>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
              {t('payment.plan')}
            </Text>
            <Text style={[styles.summaryValue, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.semiBold }]}>
              {planId === 'monthly' ? t('premium.monthly') : t('premium.yearly')}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
              {t('payment.amount')}
            </Text>
            <Text style={[styles.summaryValue, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
              ₺{planId === 'monthly' ? '99' : '799'}
            </Text>
          </View>
        </Card>
      </ScrollView>

      <View style={[styles.buttonContainer, { backgroundColor: theme.colors.background.default }]}>
        <Button
          title={t('payment.complete')}
          onPress={handlePayment}
          variant="primary"
          size="large"
          fullWidth
          style={styles.payButton}
          disabled={selectedMethod === 'card' && (!cardNumber || !cardHolder || !expiryDate || !cvv)}
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
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 28,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  methodsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  methodCard: {
    marginBottom: 0,
  },
  methodCardSelected: {
    borderColor: '#0d9cdd',
    borderWidth: 2,
    backgroundColor: 'rgba(13, 156, 221, 0.08)',
  },
  methodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  methodIcon: {
    fontSize: 24,
  },
  methodName: {
    flex: 1,
    fontSize: 16,
  },
  cardForm: {
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputSpacing: {
    marginBottom: 16,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  summaryCard: {
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 16,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  payButton: {
    backgroundColor: '#0d9cdd',
  },
});

export default SelectPaymentMethodScreen;

