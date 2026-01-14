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
  TextInput,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../theme/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Card } from '../../components/ui';
import { AppStackParamList } from '../../navigation/AppStack';
import { authAPI } from '../../services/api';
import BackButton from '../../components/BackButton';

type Props = NativeStackScreenProps<AppStackParamList, 'PersonalInfo'>;

const PersonalInfoScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const getLocale = () => {
    const lang = i18n.language || 'tr';
    if (lang.startsWith('tr')) return 'tr-TR';
    if (lang.startsWith('ru')) return 'ru-RU';
    return 'en-US';
  };

  // Ekran açıldığında seçilen dili yükle
  useEffect(() => {
    const loadSelectedLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('onboarding_appLanguageId');
        if (savedLanguage && ['tr', 'en', 'ru'].includes(savedLanguage) && i18n.language !== savedLanguage) {
          await i18n.changeLanguage(savedLanguage);
        }
      } catch (error) {
        console.error('Error loading language:', error);
      }
    };
    loadSelectedLanguage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setInitialLoading(true);
        const userData = await authAPI.getCurrentUser();
        setName(userData.username || '');
        setEmail(userData.email || '');
        // birthDate is not in user model yet
        setBirthDate(null);
      } catch (error: any) {
        console.error('Error loading user data:', error);
        // If API fails, try to get user from login response or use defaults
        // This prevents infinite loading state
        setName('');
        setEmail('');
      } finally {
        setInitialLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert(t('settings.error'), t('settings.errorMessage'));
      return;
    }

    setLoading(true);
    try {
      await authAPI.updateProfile({
        username: name.trim(),
        email: email.trim(),
        // nativeLanguageId can be added when language selection is implemented
      });
      Alert.alert(t('settings.success'), t('settings.successMessage'), [
        { text: t('common.confirm'), onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      console.error('Update profile error:', error);
      Alert.alert(
        t('settings.error'),
        error.response?.data?.error || t('settings.updateErrorMessage')
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
          <BackButton width={28} height={28} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
          {t('settings.personalInfo')}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 200 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <Card variant="default" padding="large" style={styles.avatarCard}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: '#0d9cdd' }]}>
              <Text style={[styles.avatarText, { color: theme.colors.text.white, fontFamily: theme.typography.fontFamily.bold }]}>
                {name.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <TouchableOpacity style={[styles.editAvatarButton, { backgroundColor: '#0d9cdd', borderColor: theme.colors.background.paper }]}>
              <Ionicons name="camera" size={20} color={theme.colors.text.white} />
            </TouchableOpacity>
          </View>
        </Card>

        <View style={styles.formContainer}>
          {/* Full Name Input */}
          <View style={styles.inputSection}>
            <Text style={[styles.inputLabel, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
              {t('settings.fullName')}
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}
                placeholder={t('settings.fullNamePlaceholder')}
                placeholderTextColor={theme.colors.text.secondary}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
              <View style={styles.inputUnderline} />
            </View>
          </View>

          {/* Email Input */}
          <View style={styles.inputSection}>
            <Text style={[styles.inputLabel, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
              {t('settings.email')}
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}
                placeholder={t('settings.emailPlaceholder')}
                placeholderTextColor={theme.colors.text.secondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <View style={styles.inputUnderline} />
            </View>
          </View>

          {/* Birth Date Input */}
          <View style={styles.inputSection}>
            <Text style={[styles.inputLabel, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
              {t('settings.birthDate')}
            </Text>
            <View style={styles.inputWrapper}>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.dateInputContainer}
              >
                <Text style={[styles.dateInputText, {
                  color: birthDate ? theme.colors.text.primary : theme.colors.text.secondary,
                  fontFamily: theme.typography.fontFamily.bold,
                }]}>
                  {birthDate
                    ? birthDate.toLocaleDateString(getLocale(), {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : t('settings.birthDatePlaceholder')}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#0d9cdd" />
              </TouchableOpacity>
              <View style={styles.inputUnderline} />
            </View>
          </View>

          {/* Change Password */}
          <TouchableOpacity
            onPress={() => Alert.alert(t('settings.changePassword'), t('settings.changePasswordComingSoon'))}
            style={styles.changePasswordButton}
          >
            <View style={styles.changePasswordContent}>
              <Ionicons name="lock-closed-outline" size={24} color="#0d9cdd" />
              <View style={styles.changePasswordText}>
                <Text style={[styles.changePasswordTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
                  {t('settings.changePassword')}
                </Text>
                <Text style={[styles.changePasswordDesc, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
                  {t('settings.changePasswordDesc')}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={[styles.buttonContainer, { 
        backgroundColor: theme.colors.background.paper, 
        borderTopColor: theme.colors.border.light,
        paddingBottom: 40 + insets.bottom,
      }]}>
        <Button
          title={t('settings.save')}
          onPress={handleSave}
          variant="primary"
          size="large"
          fullWidth
          loading={loading}
          disabled={loading || !name.trim() || !email.trim()}
          style={styles.saveButton}
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
                  <Text style={[styles.modalButton, { color: '#0d9cdd' }]}>{t('common.cancel')}</Text>
                </TouchableOpacity>
                <Text style={[styles.modalTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
                  {t('settings.selectBirthDate')}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowDatePicker(false);
                  }}
                >
                  <Text style={[styles.modalButton, { color: '#0d9cdd' }]}>{t('common.confirm')}</Text>
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
                locale={getLocale()}
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
            locale={getLocale()}
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
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 200, // Button container için alan
  },
  avatarCard: {
    alignItems: 'center',
    marginBottom: 32,
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
    gap: 0,
    paddingHorizontal: 0,
  },
  inputSection: {
    gap: 16,
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22.4,
    letterSpacing: 0.2,
  },
  inputWrapper: {
    gap: 8,
  },
  input: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 38.4,
    letterSpacing: 0,
    paddingVertical: 0,
    minHeight: 38.4,
  },
  inputUnderline: {
    height: 1,
    backgroundColor: '#0d9cdd',
    borderRadius: 100,
    width: '100%',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 0,
    minHeight: 38.4,
  },
  dateInputText: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 38.4,
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
    paddingHorizontal: 32,
    paddingTop: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
  },
  saveButton: {
    backgroundColor: '#0d9cdd',
    borderRadius: 100,
    paddingVertical: 15,
    paddingHorizontal: 16,
    shadowColor: '#0d9cdd',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
  },
  changePasswordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    marginTop: 16,
  },
  changePasswordContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  changePasswordText: {
    flex: 1,
  },
  changePasswordTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  changePasswordDesc: {
    fontSize: 14,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default PersonalInfoScreen;

