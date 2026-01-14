import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../theme/useTheme';
import { Button, Card } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { AppStackParamList } from '../../navigation/AppStack';

type Props = NativeStackScreenProps<AppStackParamList, 'LogoutModal'>;

const LogoutModalScreen: React.FC<Props> = ({ navigation, route }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { logout, isAuthenticated } = useAuth();
  const [visible, setVisible] = useState(route.params?.visible ?? true);

  // Logout sonrası isAuthenticated false olduğunda modal'ı kapat
  useEffect(() => {
    if (!isAuthenticated && visible) {
      setVisible(false);
      // Navigation otomatik olarak AuthStack'e geçecek
      // Modal'ı kapatmak için goBack() çağrısı yapmaya gerek yok
    }
  }, [isAuthenticated, visible]);

  const handleLogout = () => {
    try {
      // Logout işlemini yap (async değil, await gerekmez)
      logout();
      // Modal'ı kapat - navigation otomatik olarak AuthStack'e geçecek
      // goBack() çağrısı yapmaya gerek yok, çünkü logout sonrası navigation yapısı değişiyor
      setVisible(false);
    } catch (error) {
      console.error('Logout error:', error);
      // Hata durumunda modal'ı kapatmayı dene
      setVisible(false);
    }
  };

  const handleClose = () => {
    setVisible(false);
    // Modal kapandığında navigation'ı geri al
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <Card variant="elevated" padding="large" style={[styles.modalContent, { backgroundColor: theme.colors.background.paper }]}>
          <Text style={[styles.modalTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
            {t('logout.title')}
          </Text>
          <Text style={[styles.modalText, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
            {t('logout.message')}
          </Text>

          <View style={styles.buttonRow}>
            <Button
              title={t('common.cancel')}
              onPress={handleClose}
              variant="outlined"
              size="medium"
              style={[styles.button, styles.cancelButton]}
            />
            <Button
              title={t('logout.confirm')}
              onPress={handleLogout}
              variant="primary"
              size="medium"
              style={[styles.button, styles.logoutButton]}
            />
          </View>
        </Card>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
  },
  cancelButton: {
    borderColor: '#0d9cdd',
  },
  logoutButton: {
    backgroundColor: '#0d9cdd',
  },
});

export default LogoutModalScreen;

