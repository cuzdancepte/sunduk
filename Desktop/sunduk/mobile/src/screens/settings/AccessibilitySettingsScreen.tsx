import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Switch } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/useTheme';
import { Card } from '../../components/ui';
import { AppStackParamList } from '../../navigation/AppStack';

type Props = NativeStackScreenProps<AppStackParamList, 'AccessibilitySettings'>;

const AccessibilitySettingsScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.default }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
          Erişilebilirlik
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card variant="default" padding="medium" style={styles.settingCard}>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.semiBold }]}>
              Büyük Metin
            </Text>
            <Text style={[styles.settingDescription, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
              Metin boyutunu büyüt
            </Text>
          </View>
          <Switch value={largeText} onValueChange={setLargeText} trackColor={{ false: theme.colors.grey[400], true: theme.colors.primary.main }} thumbColor={theme.colors.text.white} />
        </Card>

        <Card variant="default" padding="medium" style={styles.settingCard}>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.semiBold }]}>
              Yüksek Kontrast
            </Text>
            <Text style={[styles.settingDescription, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
              Daha yüksek kontrastlı renkler kullan
            </Text>
          </View>
          <Switch value={highContrast} onValueChange={setHighContrast} trackColor={{ false: theme.colors.grey[400], true: theme.colors.primary.main }} thumbColor={theme.colors.text.white} />
        </Card>

        <Card variant="default" padding="medium" style={styles.settingCard}>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.semiBold }]}>
              Ekran Okuyucu Desteği
            </Text>
            <Text style={[styles.settingDescription, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
              Ekran okuyucular için optimize et
            </Text>
          </View>
          <Switch value={screenReader} onValueChange={setScreenReader} trackColor={{ false: theme.colors.grey[400], true: theme.colors.primary.main }} thumbColor={theme.colors.text.white} />
        </Card>

        <Card variant="default" padding="medium" style={styles.settingCard}>
          <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.semiBold }]}>
              Hareketi Azalt
            </Text>
            <Text style={[styles.settingDescription, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
              Animasyonları azalt
            </Text>
          </View>
          <Switch value={reduceMotion} onValueChange={setReduceMotion} trackColor={{ false: theme.colors.grey[400], true: theme.colors.primary.main }} thumbColor={theme.colors.text.white} />
        </Card>
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
  settingContent: { flex: 1, marginRight: 16 },
  settingTitle: { fontSize: 16, marginBottom: 4 },
  settingDescription: { fontSize: 14 },
});

export default AccessibilitySettingsScreen;

