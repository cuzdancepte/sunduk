import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { contentAPI } from '../services/api';
import { Dialog } from '../types';
import { useTheme } from '../theme/useTheme';
import { Card, EmptyState, LoadingSpinner, Badge } from '../components/ui';

const DialogScreen = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [dialogs, setDialogs] = useState<Dialog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDialogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await contentAPI.getDialogs();
      setDialogs(data);
    } catch (err: any) {
      const message = err.response?.data?.error || 'Dialog\'lar yüklenemedi';
      setError(message);
      console.error('Load dialogs error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDialogs();
  }, [loadDialogs]);

  useFocusEffect(
    useCallback(() => {
      loadDialogs();
    }, [loadDialogs])
  );

  const handleDialogPress = (dialog: Dialog) => {
    navigation.navigate('App', {
      screen: 'DialogDetail',
      params: { dialogId: dialog.id },
    });
  };

  const renderDialog = ({ item: dialog }: { item: Dialog }) => {
    const translation = dialog.translations?.[0];
    const characterCount = dialog.characters?.length || 0;
    const messageCount = dialog.messages?.length || 0;

    return (
      <TouchableOpacity
        onPress={() => handleDialogPress(dialog)}
        activeOpacity={0.7}
      >
        <Card
          variant="default"
          padding="large"
          style={[styles.dialogCard, { backgroundColor: theme.colors.background.paper, marginBottom: 12 }]}
        >
          <View style={styles.dialogHeader}>
            <Text
              style={[
                styles.dialogTitle,
                {
                  color: theme.colors.text.primary,
                  fontFamily: theme.typography.fontFamily.bold,
                },
              ]}
            >
              {translation?.title || 'Dialog'}
            </Text>
            {!dialog.isFree && (
              <Badge
                label={t('premium.title')}
                variant="warning"
                size="small"
              />
            )}
          </View>
          {translation?.description && (
            <Text
              style={[
                styles.dialogDescription,
                {
                  color: theme.colors.text.secondary,
                  fontFamily: theme.typography.fontFamily.regular,
                },
              ]}
            >
              {translation.description}
            </Text>
          )}
          <View style={styles.dialogStats}>
            <Text
              style={[
                styles.statText,
                {
                  color: theme.colors.text.secondary,
                  fontFamily: theme.typography.fontFamily.regular,
                },
              ]}
            >
              {characterCount} {t('dialog.character')} • {messageCount} {t('dialog.message')}
            </Text>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.default }]} edges={['top']}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoBox}>
              <Ionicons
                name="chatbubbles-outline"
                size={18}
                color="#0d9cdd"
              />
            </View>
            <View>
              <Text
                style={[
                  styles.headerTitle,
                  {
                    color: theme.colors.text.primary,
                    fontFamily: theme.typography.fontFamily.bold,
                  },
                ]}
              >
                {t('dialog.title')}
              </Text>
              <Text
                style={[
                  styles.headerSubtitle,
                  {
                    color: theme.colors.text.secondary,
                    fontFamily: theme.typography.fontFamily.regular,
                  },
                ]}
              >
                {t('dialog.subtitle')}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <LoadingSpinner fullScreen text={t('common.loading')} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.default }]} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoBox}>
            <Ionicons
              name="chatbubbles-outline"
              size={18}
              color="#0d9cdd"
            />
          </View>
          <View>
            <Text
              style={[
                styles.headerTitle,
                {
                  color: theme.colors.text.primary,
                  fontFamily: theme.typography.fontFamily.bold,
                },
              ]}
            >
              {t('dialog.title')}
            </Text>
            <Text
              style={[
                styles.headerSubtitle,
                {
                  color: theme.colors.text.secondary,
                  fontFamily: theme.typography.fontFamily.regular,
                },
              ]}
            >
              {t('dialog.subtitle')}
            </Text>
          </View>
        </View>
      </View>

      {dialogs.length > 0 ? (
        <FlatList
          data={dialogs}
          renderItem={renderDialog}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <EmptyState
            title={t('dialog.emptyTitle')}
            description={t('dialog.emptyDescription')}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0d9cdd',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    flexShrink: 0,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dialogCard: {
    borderRadius: 12,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  dialogDescription: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  dialogStats: {
    marginTop: 4,
  },
  statText: {
    fontSize: 12,
  },
});

export default DialogScreen;

