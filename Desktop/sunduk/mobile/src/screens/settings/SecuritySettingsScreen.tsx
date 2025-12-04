import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/useTheme';
import { Card } from '../../components/ui';
import { AppStackParamList } from '../../navigation/AppStack';

type Props = NativeStackScreenProps<AppStackParamList, 'SecuritySettings'>;

const SecuritySettingsScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.default }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
          Güvenlik
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity>
          <Card variant="default" padding="medium" style={styles.settingCard}>
            <View style={styles.settingContent}>
              <Ionicons name="lock-closed-outline" size={24} color={theme.colors.primary.main} />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.semiBold }]}>
                  Şifreyi Değiştir
                </Text>
                <Text style={[styles.settingDescription, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
                  Hesap şifreni güncelle
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
          </Card>
        </TouchableOpacity>

        <TouchableOpacity>
          <Card variant="default" padding="medium" style={styles.settingCard}>
            <View style={styles.settingContent}>
              <Ionicons name="finger-print-outline" size={24} color={theme.colors.primary.main} />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.semiBold }]}>
                  İki Faktörlü Doğrulama
                </Text>
                <Text style={[styles.settingDescription, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
                  Hesabını ekstra güvenlikle koru
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
          </Card>
        </TouchableOpacity>

        <TouchableOpacity>
          <Card variant="default" padding="medium" style={styles.settingCard}>
            <View style={styles.settingContent}>
              <Ionicons name="phone-portrait-outline" size={24} color={theme.colors.primary.main} />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.semiBold }]}>
                  Aktif Oturumlar
                </Text>
                <Text style={[styles.settingDescription, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
                  Tüm cihazlardaki oturumları görüntüle
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
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
  placeholder: { width: 40 },
  scrollContent: { padding: 20, paddingBottom: 40, gap: 12 },
  settingCard: { marginBottom: 0 },
  settingContent: { flexDirection: 'row', alignItems: 'center', gap: 16, flex: 1 },
  settingText: { flex: 1 },
  settingTitle: { fontSize: 16, marginBottom: 4 },
  settingDescription: { fontSize: 14 },
});

export default SecuritySettingsScreen;

