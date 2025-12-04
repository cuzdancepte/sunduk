import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/useTheme';
import { Card, Input } from '../../components/ui';
import { AppStackParamList } from '../../navigation/AppStack';

type Props = NativeStackScreenProps<AppStackParamList, 'HelpCenterFAQ'>;

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const HelpCenterFAQScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const faqs: FAQItem[] = [
    { id: '1', question: 'Nasıl hesap oluşturabilirim?', answer: 'Ana sayfada "Kayıt Ol" butonuna tıklayarak hesap oluşturabilirsiniz.' },
    { id: '2', question: 'Şifremi unuttum, ne yapmalıyım?', answer: 'Giriş ekranında "Şifremi Unuttum" linkine tıklayarak şifrenizi sıfırlayabilirsiniz.' },
    { id: '3', question: 'Premium üyelik nedir?', answer: 'Premium üyelik ile reklamsız deneyim, sınırsız ders erişimi ve daha fazlasına sahip olabilirsiniz.' },
    { id: '4', question: 'Aboneliğimi nasıl iptal edebilirim?', answer: 'Ayarlar > Premium bölümünden aboneliğinizi iptal edebilirsiniz.' },
    { id: '5', question: 'Dersler nasıl çalışır?', answer: 'Dersler interaktif alıştırmalar içerir. Her dersi tamamlayarak ilerleme kaydedebilirsiniz.' },
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.default }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
          Yardım Merkezi
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('HelpCenterSearch')}>
          <Ionicons name="search" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Input
          placeholder="Sorularınızı arayın..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Ionicons name="search" size={20} color={theme.colors.text.secondary} />}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredFAQs.map((faq) => (
          <Card key={faq.id} variant="default" padding="medium" style={styles.faqCard}>
            <TouchableOpacity
              onPress={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
              style={styles.faqHeader}
            >
              <Text style={[styles.faqQuestion, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.semiBold }]}>
                {faq.question}
              </Text>
              <Ionicons
                name={expandedId === faq.id ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={theme.colors.text.secondary}
              />
            </TouchableOpacity>
            {expandedId === faq.id && (
              <Text style={[styles.faqAnswer, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
                {faq.answer}
              </Text>
            )}
          </Card>
        ))}

        <TouchableOpacity
          onPress={() => navigation.navigate('HelpCenterContact')}
          style={styles.contactButton}
        >
          <Card variant="elevated" padding="large" style={styles.contactCard}>
            <Ionicons name="mail-outline" size={32} color={theme.colors.primary.main} />
            <Text style={[styles.contactText, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.semiBold }]}>
              Sorunuz mu var? Bize ulaşın
            </Text>
          </Card>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  searchContainer: { paddingHorizontal: 20, marginBottom: 16 },
  scrollContent: { padding: 20, paddingBottom: 40, gap: 12 },
  faqCard: { marginBottom: 0 },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  faqQuestion: { flex: 1, fontSize: 16 },
  faqAnswer: { marginTop: 12, fontSize: 14, lineHeight: 20 },
  contactButton: { marginTop: 8 },
  contactCard: { alignItems: 'center', gap: 12 },
  contactText: { fontSize: 16, textAlign: 'center' },
});

export default HelpCenterFAQScreen;

