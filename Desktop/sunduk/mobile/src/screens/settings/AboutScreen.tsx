import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/useTheme';
import { Card } from '../../components/ui';
import { AppStackParamList } from '../../navigation/AppStack';

type Props = NativeStackScreenProps<AppStackParamList, 'About'>;

const AboutScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.default }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
          Hakkında
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card variant="default" padding="large" style={styles.logoCard}>
          <Text style={[styles.appName, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
            Sunduk
          </Text>
          <Text style={[styles.version, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
            Versiyon 1.0.0
          </Text>
        </Card>

        <Card variant="default" padding="large" style={styles.infoCard}>
          <Text style={[styles.infoTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
            Hakkında Sunduk
          </Text>
          <Text style={[styles.infoText, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
            Sunduk, Türkçe öğrenmek isteyenler için tasarlanmış modern ve etkileşimli bir dil öğrenme uygulamasıdır. 
            Eğlenceli dersler, interaktif alıştırmalar ve kişiselleştirilmiş öğrenme deneyimi sunar.
          </Text>
        </Card>

        <View style={styles.links}>
          <TouchableOpacity style={styles.linkItem}>
            <Text style={[styles.linkText, { color: theme.colors.primary.main, fontFamily: theme.typography.fontFamily.medium }]}>
              Kullanım Koşulları
            </Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkItem}>
            <Text style={[styles.linkText, { color: theme.colors.primary.main, fontFamily: theme.typography.fontFamily.medium }]}>
              Gizlilik Politikası
            </Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkItem}>
            <Text style={[styles.linkText, { color: theme.colors.primary.main, fontFamily: theme.typography.fontFamily.medium }]}>
              Lisans Bilgileri
            </Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  placeholder: { width: 40 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  logoCard: { alignItems: 'center', marginBottom: 24 },
  appName: { fontSize: 32, fontWeight: 'bold', marginBottom: 8 },
  version: { fontSize: 14 },
  infoCard: { marginBottom: 24 },
  infoTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  infoText: { fontSize: 14, lineHeight: 22 },
  links: { gap: 12 },
  linkItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  linkText: { fontSize: 16 },
});

export default AboutScreen;

