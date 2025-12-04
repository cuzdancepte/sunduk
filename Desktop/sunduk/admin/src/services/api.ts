import axios from 'axios';
import { AuthResponse } from '../types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
export const setToken = (token: string) => {
  localStorage.setItem('admin_token', token);
};

export const getToken = (): string | null => {
  return localStorage.getItem('admin_token');
};

export const removeToken = () => {
  localStorage.removeItem('admin_token');
};

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      setToken(response.data.token);
    }
    return response.data;
  },
  logout: () => {
    removeToken();
  },
};

// Admin API
export const adminAPI = {
  // Languages
  getLanguages: () => api.get('/admin/languages'),
  createLanguage: (data: { code: string; name: string; flagIcon?: string }) =>
    api.post('/admin/languages', data),
  updateLanguage: (id: string, data: { code: string; name: string; flagIcon?: string }) =>
    api.put(`/admin/languages/${id}`, data),
  deleteLanguage: (id: string) => api.delete(`/admin/languages/${id}`),

  // Levels
  getLevels: () => api.get('/admin/levels'),
  createLevel: (data: { code: string; order: number }) =>
    api.post('/admin/levels', data),
  updateLevel: (id: string, data: { code: string; order: number }) =>
    api.put(`/admin/levels/${id}`, data),
  deleteLevel: (id: string) => api.delete(`/admin/levels/${id}`),

  // Units
  getUnits: (levelId?: string) =>
    api.get('/admin/units', { params: { levelId } }),
  createUnit: (data: {
    levelId: string;
    order: number;
    slug: string;
    translations?: Array<{
      languageId: string;
      title: string;
      description?: string;
    }>;
  }) => api.post('/admin/units', data),
  updateUnit: (
    id: string,
    data: {
      levelId: string;
      order: number;
      slug: string;
      translations?: Array<{
        languageId: string;
        title: string;
        description?: string;
      }>;
    }
  ) => api.put(`/admin/units/${id}`, data),
  deleteUnit: (id: string) => api.delete(`/admin/units/${id}`),

  // Lessons
  getLessons: (unitId?: string) =>
    api.get('/admin/lessons', { params: { unitId } }),
  createLesson: (data: {
    unitId: string;
    order: number;
    isFree: boolean;
    passingScore?: number;
    iconType?: string;
    translations?: Array<{
      languageId: string;
      title: string;
      contentMd: string;
    }>;
  }) => api.post('/admin/lessons', data),
  updateLesson: (
    id: string,
    data: {
      unitId: string;
      order: number;
      isFree: boolean;
      passingScore?: number;
      iconType?: string;
      translations?: Array<{
        languageId: string;
        title: string;
        contentMd: string;
      }>;
    }
  ) => api.put(`/admin/lessons/${id}`, data),
  deleteLesson: (id: string) => api.delete(`/admin/lessons/${id}`),

  // Exercises
  getExercises: (lessonId?: string) =>
    api.get('/admin/exercises', { params: { lessonId } }),
  getExercise: (id: string) => api.get(`/admin/exercises/${id}`),
  createExercise: (data: {
    lessonId: string;
    type: string;
    correctAnswer?: string;
    mediaUrl?: string;
    order: number;
    prompts?: Array<{
      languageId: string;
      questionText: string;
    }>;
    options?: Array<{
      order: number;
      translations?: Array<{
        languageId: string;
        optionText: string;
      }>;
    }>;
  }) => api.post('/admin/exercises', data),
  updateExercise: (
    id: string,
    data: {
      lessonId: string;
      type: string;
      correctAnswer?: string;
      mediaUrl?: string;
      order: number;
      prompts?: Array<{
        languageId: string;
        questionText: string;
      }>;
      options?: Array<{
        order: number;
        translations?: Array<{
          languageId: string;
          optionText: string;
        }>;
      }>;
    }
  ) => api.put(`/admin/exercises/${id}`, data),
  deleteExercise: (id: string) => api.delete(`/admin/exercises/${id}`),

  // Exams
  getExams: (unitId?: string) =>
    api.get('/admin/exams', { params: { unitId } }),
  getExam: (id: string) => api.get(`/admin/exams/${id}`),
  createExam: (data: {
    unitId: string;
    order: number;
    passingScore?: number;
    translations?: Array<{
      languageId: string;
      title: string;
      description?: string;
    }>;
  }) => api.post('/admin/exams', data),
  updateExam: (
    id: string,
    data: {
      unitId: string;
      order: number;
      passingScore?: number;
      translations?: Array<{
        languageId: string;
        title: string;
        description?: string;
      }>;
    }
  ) => api.put(`/admin/exams/${id}`, data),
  deleteExam: (id: string) => api.delete(`/admin/exams/${id}`),

  // Exam Questions
  createExamQuestion: (examId: string, data: {
    type: string;
    order: number;
    correctAnswer?: string;
    mediaUrl?: string;
    prompts?: Array<{
      languageId: string;
      questionText: string;
    }>;
    options?: Array<{
      order: number;
      translations?: Array<{
        languageId: string;
        optionText: string;
      }>;
    }>;
  }) => api.post(`/admin/exams/${examId}/questions`, data),
  updateExamQuestion: (
    id: string,
    data: {
      examId: string;
      type: string;
      order: number;
      correctAnswer?: string;
      mediaUrl?: string;
      prompts?: Array<{
        languageId: string;
        questionText: string;
      }>;
      options?: Array<{
        order: number;
        translations?: Array<{
          languageId: string;
          optionText: string;
        }>;
      }>;
    }
  ) => api.put(`/admin/exam-questions/${id}`, data),
  deleteExamQuestion: (id: string) => api.delete(`/admin/exam-questions/${id}`),

  // Upload
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    const token = getToken();
    // Use proxy path instead of direct localhost
    const response = await axios.post('/api/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    return response.data;
  },

  // Users
  getUsers: () => api.get('/admin/users'),

  // Subscriptions
  getSubscriptions: (userId?: string) =>
    api.get('/admin/subscriptions', { params: { userId } }),
  createSubscription: (data: {
    userId: string;
    startDate: string;
    endDate: string;
    status?: string;
  }) => api.post('/admin/subscriptions', data),
};

export default api;

