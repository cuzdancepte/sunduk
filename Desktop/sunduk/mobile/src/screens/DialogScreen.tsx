import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTheme } from '../theme/useTheme';
import { Card, EmptyState } from '../components/ui';

const DialogScreen = () => {
  const theme = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background.light }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { backgroundColor: theme.colors.background.default, borderBottomColor: theme.colors.border.light }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
          Dialog
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
          Konuşma pratiği
        </Text>
      </View>

      <View style={[styles.content, { padding: theme.spacing.lg }]}>
        <EmptyState
          title="Yakında..."
          description="Dialog içeriği yakında eklenecek"
        />
      </View>
    </ScrollView>
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
  content: {
    // Padding handled inline with theme
  },
});

export default DialogScreen;

