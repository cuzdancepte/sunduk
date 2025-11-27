export interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  nativeLanguageId: string;
  learningLanguageId: string;
  createdAt: string;
}

export interface Language {
  id: string;
  code: string;
  name: string;
  flag_icon?: string;
}

export interface Level {
  id: string;
  code: string;
  order: number;
}

export interface Unit {
  id: string;
  levelId: string;
  order: number;
  slug: string;
  level?: Level;
  translations?: UnitTranslation[];
}

export interface UnitTranslation {
  id: string;
  unitId: string;
  languageId: string;
  title: string;
  description?: string;
}

export interface Lesson {
  id: string;
  unitId: string;
  order: number;
  isFree: boolean;
  unit?: Unit;
  translations?: LessonTranslation[];
}

export interface LessonTranslation {
  id: string;
  lessonId: string;
  languageId: string;
  title: string;
  contentMd: string;
}

export interface Exercise {
  id: string;
  lessonId: string;
  type: string;
  correctAnswer?: string;
  mediaUrl?: string;
  order: number;
  lesson?: Lesson;
  prompts?: ExercisePrompt[];
  options?: ExerciseOption[];
}

export interface ExercisePrompt {
  id: string;
  exerciseId: string;
  languageId: string;
  questionText: string;
}

export interface ExerciseOption {
  id: string;
  exerciseId: string;
  order: number;
  translations?: ExerciseOptionTranslation[];
}

export interface ExerciseOptionTranslation {
  id: string;
  optionId: string;
  languageId: string;
  optionText: string;
}

export interface UserSubscription {
  id: string;
  userId: string;
  startDate: string;
  endDate: string;
  status: string;
  user?: User;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

