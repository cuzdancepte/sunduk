import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Share,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../theme/useTheme';
import { Card, Button } from '../../components/ui';
import { AppStackParamList } from '../../navigation/AppStack';

type Props = NativeStackScreenProps<AppStackParamList, 'InviteFriend'>;

const InviteFriendScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  // Referans kodu - gerçek uygulamada kullanıcıdan gelecek
  const referralCode = 'SUNDUK2024';
  const referralLink = `https://sunduk.app/invite/${referralCode}`;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Sunduk uygulamasını denemek ister misin? Referans kodum: ${referralCode}\n\n${referralLink}`,
        title: 'Sunduk\'a Katıl',
      });
    } catch (error) {
      Alert.alert('Hata', 'Paylaşım yapılamadı');
    }
  };

  const handleCopyCode = () => {
    // Clipboard API kullanılabilir
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    Alert.alert('Kopyalandı', `Referans kodu: ${referralCode}`);
  };

  const benefits = [
    {
      icon: 'gift',
      title: 'Her Davet İçin Ödül',
      description: 'Arkadaşını davet et, ikiniz de özel ödüller kazanın',
    },
    {
      icon: 'trophy',
      title: 'Ekstra XP Puanları',
      description: 'Davet ettiğin her arkadaş için bonus XP kazan',
    },
    {
      icon: 'star',
      title: 'Premium Avantajları',
      description: 'Belirli sayıda davet sonrası premium özellikler',
    },
  ];

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.default },
      ]}
      edges={['top']}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back-outline"
            size={24}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.headerTitle,
            {
              color: theme.colors.text.primary,
              fontFamily: theme.typography.fontFamily.bold,
            },
          ]}
        >
          {t('settings.inviteFriend')}
        </Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <Card variant="elevated" padding="large" style={styles.heroCard}>
          <View style={styles.heroContent}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: theme.colors.primary.light + '20' },
              ]}
            >
              <Ionicons
                name="person-add"
                size={48}
                color={theme.colors.primary.main}
              />
            </View>
            <Text
              style={[
                styles.heroTitle,
                {
                  color: theme.colors.text.primary,
                  fontFamily: theme.typography.fontFamily.bold,
                },
              ]}
            >
              Arkadaşını Davet Et
            </Text>
            <Text
              style={[
                styles.heroDescription,
                {
                  color: theme.colors.text.secondary,
                  fontFamily: theme.typography.fontFamily.regular,
                },
              ]}
            >
              Arkadaşlarını davet ederek hem onlara hem de kendine avantajlar
              sağla!
            </Text>
          </View>
        </Card>

        {/* Referral Code */}
        <Card variant="default" padding="large" style={styles.codeCard}>
          <Text
            style={[
              styles.codeLabel,
              {
                color: theme.colors.text.secondary,
                fontFamily: theme.typography.fontFamily.medium,
              },
            ]}
          >
            Referans Kodun
          </Text>
          <TouchableOpacity
            onPress={handleCopyCode}
            style={[
              styles.codeContainer,
              {
                backgroundColor: theme.colors.background.light,
                borderColor: theme.colors.border.light,
              },
            ]}
          >
            <Text
              style={[
                styles.codeText,
                {
                  color: theme.colors.text.primary,
                  fontFamily: theme.typography.fontFamily.bold,
                },
              ]}
            >
              {referralCode}
            </Text>
            <Ionicons
              name={copied ? 'checkmark' : 'copy-outline'}
              size={20}
              color={
                copied
                  ? theme.colors.success.main
                  : theme.colors.text.secondary
              }
            />
          </TouchableOpacity>
        </Card>

        {/* Benefits */}
        <View style={styles.benefitsSection}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.text.primary,
                fontFamily: theme.typography.fontFamily.bold,
              },
            ]}
          >
            Avantajlar
          </Text>
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              variant="default"
              padding="medium"
              style={styles.benefitCard}
            >
              <View
                style={[
                  styles.benefitIconContainer,
                  { backgroundColor: theme.colors.primary.light + '20' },
                ]}
              >
                <Ionicons
                  name={benefit.icon as any}
                  size={24}
                  color={theme.colors.primary.main}
                />
              </View>
              <View style={styles.benefitContent}>
                <Text
                  style={[
                    styles.benefitTitle,
                    {
                      color: theme.colors.text.primary,
                      fontFamily: theme.typography.fontFamily.bold,
                    },
                  ]}
                >
                  {benefit.title}
                </Text>
                <Text
                  style={[
                    styles.benefitDescription,
                    {
                      color: theme.colors.text.secondary,
                      fontFamily: theme.typography.fontFamily.regular,
                    },
                  ]}
                >
                  {benefit.description}
                </Text>
              </View>
            </Card>
          ))}
        </View>

        {/* Share Button */}
        <Button
          title="Arkadaşını Davet Et"
          onPress={handleShare}
          variant="primary"
          size="large"
          fullWidth
          style={styles.shareButton}
        />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerPlaceholder: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  heroCard: {
    marginBottom: 24,
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  heroDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  codeCard: {
    marginBottom: 24,
  },
  codeLabel: {
    fontSize: 14,
    marginBottom: 12,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  codeText: {
    fontSize: 20,
    letterSpacing: 2,
  },
  benefitsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 16,
  },
  benefitIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  shareButton: {
    marginTop: 8,
  },
});

export default InviteFriendScreen;
