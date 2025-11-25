export interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  nativeLanguageId: string;
  learningLanguageId: string;
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
  units?: Unit[];
}

export interface Unit {
  id: string;
  levelId: string;
  order: number;
  slug: string;
  translations?: UnitTranslation[];
  lessons?: Lesson[];
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
  translations?: LessonTranslation[];
  exercises?: Exercise[];
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

export interface UserProgress {
  id: string;
  userId: string;
  currentLessonId?: string;
  completedAt?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

