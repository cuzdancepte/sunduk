import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../../theme/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Input, Card } from '../../components/ui';
import { AppStackParamList } from '../../navigation/AppStack';
import { authAPI } from '../../services/api';

type Props = NativeStackScreenProps<AppStackParamList, 'PersonalInfo'>;

const PersonalInfoScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [language, setLanguage] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setInitialLoading(true);
        const userData = await authAPI.getCurrentUser();
        setName(userData.username || '');
        setEmail(userData.email || '');
        setLanguage(userData.nativeLanguage?.name || 'Türkçe');
        // birthDate is not in user model yet
        setBirthDate(null);
      } catch (error: any) {
        console.error('Error loading user data:', error);
        // If API fails, try to get user from login response or use defaults
        // This prevents infinite loading state
        setName('');
        setEmail('');
        setLanguage('Türkçe');
      } finally {
        setInitialLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Hata', 'Ad Soyad ve Email alanları zorunludur');
      return;
    }

    setLoading(true);
    try {
      await authAPI.updateProfile({
        username: name.trim(),
        email: email.trim(),
        // nativeLanguageId can be added when language selection is implemented
      });
      Alert.alert('Başarılı', 'Bilgileriniz güncellendi', [
        { text: 'Tamam', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      console.error('Update profile error:', error);
      Alert.alert(
        'Hata',
        error.response?.data?.error || 'Bilgiler güncellenirken bir hata oluştu'
      );
    } finally {
      setLoading(false);
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
          Kişisel Bilgiler
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 160 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <Card variant="default" padding="large" style={styles.avatarCard}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: theme.colors.primary.main }]}>
              <Text style={[styles.avatarText, { color: theme.colors.text.white, fontFamily: theme.typography.fontFamily.bold }]}>
                {name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <TouchableOpacity style={[styles.editAvatarButton, { backgroundColor: theme.colors.primary.main, borderColor: theme.colors.background.paper }]}>
              <Ionicons name="camera" size={20} color={theme.colors.text.white} />
            </TouchableOpacity>
          </View>
        </Card>

        <View style={styles.formContainer}>
          <Input
            label="Ad Soyad"
            placeholder="Ad Soyad"
            value={name}
            onChangeText={setName}
            containerStyle={styles.inputSpacing}
          />

          <Input
            label="Email"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.inputSpacing}
          />

          <View style={styles.inputSpacing}>
            <Text style={[styles.inputLabel, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
              Doğum Tarihi
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={[styles.dateInputContainer, {
                backgroundColor: theme.colors.background.paper,
                borderColor: theme.colors.border.light,
              }]}
            >
              <Text style={[styles.dateInputText, {
                color: birthDate ? theme.colors.text.primary : theme.colors.text.secondary,
                fontFamily: theme.typography.fontFamily.regular,
              }]}>
                {birthDate
                  ? birthDate.toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })
                  : 'YYYY-MM-DD'}
              </Text>
              <Ionicons name="calendar-outline" size={20} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          </View>

          <Input
            label="Ana Dil"
            placeholder="Ana Dil"
            value={language}
            onChangeText={setLanguage}
            containerStyle={styles.inputSpacing}
          />
        </View>
      </ScrollView>

      <View style={[styles.buttonContainer, { 
        backgroundColor: theme.colors.background.paper, 
        borderTopColor: theme.colors.border.light,
        paddingBottom: 40 + insets.bottom,
      }]}>
        <Button
          title="Kaydet"
          onPress={handleSave}
          variant="primary"
          size="large"
          fullWidth
          loading={loading}
          disabled={loading || !name.trim() || !email.trim()}
        />
      </View>

      {Platform.OS === 'ios' ? (
        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.colors.background.paper }]}>
              <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border.light }]}>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={[styles.modalButton, { color: theme.colors.primary.main }]}>İptal</Text>
                </TouchableOpacity>
                <Text style={[styles.modalTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
                  Doğum Tarihi Seç
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowDatePicker(false);
                  }}
                >
                  <Text style={[styles.modalButton, { color: theme.colors.primary.main }]}>Tamam</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={birthDate || new Date()}
                mode="date"
                display="spinner"
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                    setBirthDate(selectedDate);
                  }
                }}
                maximumDate={new Date()}
                locale="tr-TR"
                style={styles.datePicker}
              />
            </View>
          </View>
        </Modal>
      ) : (
        showDatePicker && (
          <DateTimePicker
            value={birthDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setBirthDate(selectedDate);
              }
            }}
            maximumDate={new Date()}
            locale="tr-TR"
          />
        )
      )}
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
    paddingBottom: 140, // Button container height (20 + 56 + 40) + extra space
  },
  avatarCard: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
  },
  formContainer: {
    gap: 16,
  },
  inputSpacing: {
    marginBottom: 0,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 48,
  },
  dateInputText: {
    fontSize: 16,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
  },
  modalButton: {
    fontSize: 16,
    fontFamily: 'System',
  },
  datePicker: {
    height: 200,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
  },
});

export default PersonalInfoScreen;

