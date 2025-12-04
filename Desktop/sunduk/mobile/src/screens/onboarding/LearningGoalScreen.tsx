import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../theme/useTheme';
import { Button, Card } from '../../components/ui';
import { OnboardingStackParamList } from '../../navigation/OnboardingStack';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'LearningGoal'>;

const goals = [
  { id: 'travel', title: 'Seyahat', description: 'Türkiye\'de seyahat ederken iletişim kurabilmek' },
  { id: 'work', title: 'İş', description: 'İş hayatında Türkçe kullanabilmek' },
  { id: 'study', title: 'Eğitim', description: 'Türkiye\'de eğitim almak' },
  { id: 'culture', title: 'Kültür', description: 'Türk kültürünü daha iyi anlamak' },
  { id: 'other', title: 'Diğer', description: 'Kişisel nedenler' },
];

const LearningGoalScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.default }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.bold }]}>
            Ne öğrenmek istersin?
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
            Öğrenme hedefini seç
          </Text>
        </View>

        <View style={styles.goalsList}>
          {goals.map((goal) => (
            <TouchableOpacity
              key={goal.id}
              onPress={() => setSelectedGoal(goal.id)}
              activeOpacity={0.7}
            >
              <Card
                variant={selectedGoal === goal.id ? 'outlined' : 'default'}
                padding="large"
                style={[
                  styles.goalCard,
                  selectedGoal === goal.id && {
                    borderColor: theme.colors.primary.main,
                    borderWidth: 2,
                    backgroundColor: `${theme.colors.primary.main}10`,
                  },
                ]}
              >
                <Text style={[styles.goalTitle, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.semiBold }]}>
                  {goal.title}
                </Text>
                <Text style={[styles.goalDescription, { color: theme.colors.text.secondary, fontFamily: theme.typography.fontFamily.regular }]}>
                  {goal.description}
                </Text>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title="Devam Et"
          onPress={async () => {
            if (selectedGoal) {
              // Öğrenme hedefini kaydet
              await AsyncStorage.setItem('onboarding_learningGoal', selectedGoal);
              // Öğrenilen dil ID'sini kaydet (Türkçe için varsayılan)
              // TODO: Gerçek dil ID'sini API'den almak gerekebilir
              await AsyncStorage.setItem('onboarding_learningLanguageId', 'tr'); // Geçici olarak 'tr'
              navigation.navigate('OnboardingCompleted');
            }
          }}
          variant="primary"
          size="large"
          fullWidth
          disabled={!selectedGoal}
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
  goalsList: {
    gap: 16,
  },
  goalCard: {
    marginBottom: 0,
  },
  goalTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 14,
  },
  buttonContainer: {
    padding: 24,
    paddingBottom: 40,
  },
});

export default LearningGoalScreen;

