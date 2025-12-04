import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/useTheme';
import { Button, Input, Card } from '../../components/ui';
import { AppStackParamList } from '../../navigation/AppStack';

type Props = NativeStackScreenProps<AppStackParamList, 'HelpCenterContact'>;

const HelpCenterContactScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!subject || !message) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }
    // TODO: API call to send message
    Alert.alert('Başarılı', 'Mesajınız gönderildi. En kısa sürede size dönüş yapacağız.');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.default }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
          İletişim
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card variant="default" padding="large" style={styles.infoCard}>
          <Ionicons name="mail-outline" size={48} color={theme.colors.primary.main} />
          <Text style={[styles.infoTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
            Bize Ulaşın
          </Text>
          <Text style={[styles.infoText, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
            Sorularınız, önerileriniz veya sorunlarınız için bize yazabilirsiniz. En kısa sürede size dönüş yapacağız.
          </Text>
        </Card>

        <Input
          label="Konu"
          placeholder="Konu başlığı"
          value={subject}
          onChangeText={setSubject}
          containerStyle={styles.inputSpacing}
        />

        <Input
          label="Mesaj"
          placeholder="Mesajınızı buraya yazın..."
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={6}
          containerStyle={styles.inputSpacing}
          inputStyle={styles.textArea}
        />
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title="Gönder"
          onPress={handleSend}
          variant="primary"
          size="large"
          fullWidth
          disabled={!subject || !message}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  placeholder: { width: 40 },
  scrollContent: { padding: 20, paddingBottom: 100 },
  infoCard: { alignItems: 'center', marginBottom: 24, gap: 12 },
  infoTitle: { fontSize: 20, marginTop: 8 },
  infoText: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  inputSpacing: { marginBottom: 16 },
  textArea: { minHeight: 120, textAlignVertical: 'top' },
  buttonContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 40, backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#e0e0e0' },
});

export default HelpCenterContactScreen;

