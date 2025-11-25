import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';

const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [dailyGoal, setDailyGoal] = React.useState(5);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ayarlar</Text>
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Bildirimler</Text>
            <Text style={styles.settingDescription}>
              Günlük hatırlatmalar al
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#ccc', true: '#6200ee' }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* Daily Goal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Günlük Hedef</Text>
        <View style={styles.goalContainer}>
          <TouchableOpacity
            style={[
              styles.goalButton,
              dailyGoal === 3 && styles.goalButtonActive,
            ]}
            onPress={() => setDailyGoal(3)}
          >
            <Text
              style={[
                styles.goalButtonText,
                dailyGoal === 3 && styles.goalButtonTextActive,
              ]}
            >
              3 Ders
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.goalButton,
              dailyGoal === 5 && styles.goalButtonActive,
            ]}
            onPress={() => setDailyGoal(5)}
          >
            <Text
              style={[
                styles.goalButtonText,
                dailyGoal === 5 && styles.goalButtonTextActive,
              ]}
            >
              5 Ders
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.goalButton,
              dailyGoal === 10 && styles.goalButtonActive,
            ]}
            onPress={() => setDailyGoal(10)}
          >
            <Text
              style={[
                styles.goalButtonText,
                dailyGoal === 10 && styles.goalButtonTextActive,
              ]}
            >
              10 Ders
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hakkında</Text>
        <View style={styles.aboutCard}>
          <Text style={styles.aboutText}>Sunduk v1.0.0</Text>
          <Text style={styles.aboutSubtext}>
            Türkçe öğrenme uygulaması
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  settingItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingContent: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
  goalContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  goalButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalButtonActive: {
    borderColor: '#6200ee',
    backgroundColor: '#f3e5f5',
  },
  goalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  goalButtonTextActive: {
    color: '#6200ee',
  },
  aboutCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  aboutText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  aboutSubtext: {
    fontSize: 14,
    color: '#666',
  },
});

export default SettingsScreen;

