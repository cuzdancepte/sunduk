import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { contentAPI } from '../services/api';
import { Dialog } from '../types';
import { useTheme } from '../theme/useTheme';
import { Card, EmptyState, LoadingSpinner, Badge } from '../components/ui';

const DialogScreen = () => {
  const theme = useTheme();
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
          variant="elevated"
          padding="large"
          style={{ marginBottom: theme.spacing.md }}
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
                label="Premium"
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
              {characterCount} karakter • {messageCount} mesaj
            </Text>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background.light }]}>
        <View
          style={[
            styles.header,
            {
              backgroundColor: theme.colors.background.default,
              borderBottomColor: theme.colors.border.light,
            },
          ]}
        >
          <Text
            style={[
              styles.headerTitle,
              {
                color: theme.colors.text.primary,
                fontFamily: theme.typography.fontFamily.bold,
              },
            ]}
          >
            Dialog
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
            Konuşma pratiği
          </Text>
        </View>
        <View style={styles.loadingContainer}>
          <LoadingSpinner />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.light }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.colors.background.default,
            borderBottomColor: theme.colors.border.light,
          },
        ]}
      >
        <Text
          style={[
            styles.headerTitle,
            {
              color: theme.colors.text.primary,
              fontFamily: theme.typography.fontFamily.bold,
            },
          ]}
        >
          Dialog
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
          Konuşma pratiği
        </Text>
      </View>

      {dialogs.length > 0 ? (
        <FlatList
          data={dialogs}
          renderItem={renderDialog}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.list,
            { padding: theme.spacing.lg },
          ]}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <EmptyState
            title="Henüz dialog yok"
            description="Yakında dialog içerikleri eklenecek"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    // Padding handled inline with theme
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

