import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse, Level, Unit, Lesson, UserProgress } from '../types';

// For physical device/emulator, use your computer's IP address
// Change this to your computer's IP address (check with: ipconfig)
// WiFi IP: 192.168.1.5
// Alternative: 192.168.137.1
const API_BASE_URL = 'http://192.168.1.5:3001/api';
const TOKEN_KEY = '@sunduk_token';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors (unauthorized)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, remove it
      await removeToken();
      // You can emit an event here to trigger logout in the app
      // For now, the app will handle it on next API call
    }
    return Promise.reject(error);
  }
);

// Token management
export const setToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const removeToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

// Auth API
export const authAPI = {
  register: async (
    email: string,
    password: string,
    username: string,
    nativeLanguageId: string,
    learningLanguageId: string
  ): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', {
      email,
      password,
      username,
      nativeLanguageId,
      learningLanguageId,
    });
    if (response.data.token) {
      await setToken(response.data.token);
    }
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    if (response.data.token) {
      await setToken(response.data.token);
    }
    return response.data;
  },

  logout: async () => {
    await removeToken();
  },
};

// Content API
export const contentAPI = {
  getLevels: async (): Promise<Level[]> => {
    const response = await api.get('/content/levels');
    return response.data;
  },

  getUnit: async (unitId: string): Promise<Unit> => {
    const response = await api.get(`/content/unit/${unitId}`);
    return response.data;
  },

  getLesson: async (lessonId: string): Promise<Lesson> => {
    const response = await api.get(`/content/lesson/${lessonId}`);
    return response.data;
  },

  getUserProgress: async (): Promise<UserProgress> => {
    const response = await api.get('/content/progress');
    return response.data;
  },

  updateProgress: async (
    lessonId: string,
    completed: boolean
  ): Promise<UserProgress> => {
    const response = await api.put('/content/progress', {
      lessonId,
      completed,
    });
    return response.data;
  },
};

export default api;

