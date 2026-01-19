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
import BackButton from '../../components/BackButton';

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
        message: t('invite.shareMessage', { code: referralCode, link: referralLink }),
        title: t('invite.shareTitle'),
      });
    } catch (error) {
      Alert.alert(t('invite.shareError'), t('invite.shareErrorMessage'));
    }
  };

  const handleCopyCode = () => {
    // Clipboard API kullanılabilir
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    Alert.alert(t('invite.copied'), t('invite.copiedMessage', { code: referralCode }));
  };

  const benefits = [
    {
      icon: 'gift',
      titleKey: 'invite.benefits.reward.title',
      descKey: 'invite.benefits.reward.desc',
    },
    {
      icon: 'trophy',
      titleKey: 'invite.benefits.xp.title',
      descKey: 'invite.benefits.xp.desc',
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
          <BackButton width={28} height={28} color={theme.colors.text.primary} />
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
          {t('invite.title')}
        </Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <Card variant="elevated" padding="large" style={[styles.heroCard, { backgroundColor: theme.colors.background.paper }]}>
          <View style={styles.heroContent}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: 'rgba(13, 156, 221, 0.1)' },
              ]}
            >
              <Ionicons
                name="people-outline"
                size={48}
                color="#0d9cdd"
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
              {t('invite.title')}
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
              {t('invite.subtitle')}
            </Text>
          </View>
        </Card>

        {/* Referral Code */}
        <Card variant="default" padding="large" style={[styles.codeCard, { backgroundColor: theme.colors.background.paper }]}>
          <Text
            style={[
              styles.codeLabel,
              {
                color: theme.colors.text.secondary,
                fontFamily: theme.typography.fontFamily.medium,
              },
            ]}
          >
            {t('invite.referralCode')}
          </Text>
          <TouchableOpacity
            onPress={handleCopyCode}
            style={[
              styles.codeContainer,
              {
                backgroundColor: theme.colors.background.light,
                borderColor: '#0d9cdd',
                borderWidth: 1,
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
              name={copied ? 'checkmark-circle' : 'copy-outline'}
              size={20}
              color={
                copied
                  ? '#4CAF50'
                  : '#0d9cdd'
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
            {t('invite.benefits.title')}
          </Text>
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              variant="default"
              padding="medium"
              style={[styles.benefitCard, { backgroundColor: theme.colors.background.paper }]}
            >
              <View
                style={[
                  styles.benefitIconContainer,
                  { backgroundColor: 'rgba(13, 156, 221, 0.1)' },
                ]}
              >
                <Ionicons
                  name={benefit.icon as any}
                  size={24}
                  color="#0d9cdd"
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
                  {t(benefit.titleKey)}
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
                  {t(benefit.descKey)}
                </Text>
              </View>
            </Card>
          ))}
        </View>

        {/* Share Button */}
        <Button
          title={t('invite.shareButton')}
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
  headerPlaceholder: {
    width: 28,
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
    backgroundColor: '#0d9cdd',
  },
});

export default InviteFriendScreen;
