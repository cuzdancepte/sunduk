import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../../theme/useTheme';
import { Button, Card } from '../../components/ui';
import { OnboardingStackParamList } from '../../navigation/OnboardingStack';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'StudyTarget'>;

const targets = [
  { id: '5', minutes: 5, label: '5 dakika/gün' },
  { id: '10', minutes: 10, label: '10 dakika/gün' },
  { id: '15', minutes: 15, label: '15 dakika/gün' },
  { id: '20', minutes: 20, label: '20 dakika/gün' },
  { id: '30', minutes: 30, label: '30 dakika/gün' },
];

const StudyTargetScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.default }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
            Günlük çalışma hedefin ne?
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
            Her gün ne kadar zaman ayırmak istiyorsun?
          </Text>
        </View>

        <View style={styles.targetsList}>
          {targets.map((target) => (
            <TouchableOpacity
              key={target.id}
              onPress={() => setSelectedTarget(target.id)}
              activeOpacity={0.7}
            >
              <Card
                variant={selectedTarget === target.id ? 'outlined' : 'default'}
                padding="large"
                style={[
                  styles.targetCard,
                  selectedTarget === target.id && {
                    borderColor: theme.colors.primary.main,
                    borderWidth: 2,
                    backgroundColor: `${theme.colors.primary.main}10`,
                  },
                ]}
              >
                <Text style={[styles.targetLabel, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.semiBold }]}>
                  {target.label}
                </Text>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title="Devam Et"
          onPress={() => navigation.navigate('OnboardingCompleted')}
          variant="primary"
          size="large"
          fullWidth
          disabled={!selectedTarget}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  targetsList: {
    gap: 16,
  },
  targetCard: {
    marginBottom: 0,
  },
  targetLabel: {
    fontSize: 18,
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 24,
    paddingBottom: 40,
  },
});

export default StudyTargetScreen;

