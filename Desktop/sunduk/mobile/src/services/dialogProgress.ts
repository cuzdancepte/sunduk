import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from './api';

const COMPLETED_DIALOGS_PREFIX = '@sunduk_completed_dialogs';

const getStorageKey = (userId: string) => `${COMPLETED_DIALOGS_PREFIX}_${userId}`;

const getCurrentUserId = async (): Promise<string | null> => {
  try {
    const user = await authAPI.getCurrentUser().catch(() => null);
    return user?.id ?? null;
  } catch {
    return null;
  }
};

export const getCompletedDialogs = async (): Promise<string[]> => {
  try {
    const userId = await getCurrentUserId();
    const key = getStorageKey(userId ?? 'anonymous');
    const stored = await AsyncStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const addCompletedDialog = async (dialogId: string): Promise<void> => {
  try {
    const userId = await getCurrentUserId();
    const key = getStorageKey(userId ?? 'anonymous');
    const stored = await AsyncStorage.getItem(key);
    const completed = stored ? JSON.parse(stored) : [];
    if (!completed.includes(dialogId)) {
      completed.push(dialogId);
      await AsyncStorage.setItem(key, JSON.stringify(completed));
    }
  } catch (e) {
    console.error('Error saving completed dialog:', e);
  }
};
