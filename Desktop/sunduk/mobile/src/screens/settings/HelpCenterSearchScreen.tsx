import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/useTheme';
import { Card, Input } from '../../components/ui';
import { AppStackParamList } from '../../navigation/AppStack';

type Props = NativeStackScreenProps<AppStackParamList, 'HelpCenterSearch'>;

const HelpCenterSearchScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = [
    'Hesap oluşturma',
    'Şifre sıfırlama',
    'Premium üyelik',
    'Ders çalışma',
    'İlerleme takibi',
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.default }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
          Arama
        </Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.searchContainer}>
        <Input
          placeholder="Sorularınızı arayın..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoFocus
          leftIcon={<Ionicons name="search" size={20} color={theme.colors.text.secondary} />}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {searchQuery ? (
          <View>
            <Text style={[styles.resultsTitle, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.medium }]}>
              Arama Sonuçları
            </Text>
            {searchResults
              .filter(result => result.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((result, index) => (
                <TouchableOpacity key={index}>
                  <Card variant="default" padding="medium" style={styles.resultCard}>
                    <Text style={[styles.resultText, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.regular }]}>
                      {result}
                    </Text>
                    <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
                  </Card>
                </TouchableOpacity>
              ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color={theme.colors.text.secondary} />
            <Text style={[styles.emptyText, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
              Arama yapmak için yukarıdaki alana yazın
            </Text>
          </View>
        )}
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
  searchContainer: { paddingHorizontal: 20, marginBottom: 16 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  resultsTitle: { fontSize: 14, marginBottom: 12 },
  resultCard: { marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resultText: { flex: 1, fontSize: 16 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { marginTop: 16, fontSize: 16, textAlign: 'center' },
});

export default HelpCenterSearchScreen;

