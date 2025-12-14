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
  exams?: Exam[];
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
  passingScore?: number; // Geçme yüzdesi (default: 70)
  iconType?: string; // Ders ikonu tipi (default: 'star')
  translations?: LessonTranslation[];
  exercises?: Exercise[];
  completion?: UserLessonCompletion | null;
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

export interface UserLessonCompletion {
  id: string;
  userId: string;
  lessonId: string;
  score: number;
  correctCount: number;
  totalCount: number;
  completed: boolean;
  completedAt?: string;
}

export interface UserExamCompletion {
  id: string;
  userId: string;
  examId: string;
  score: number;
  correctCount: number;
  totalCount: number;
  completed: boolean;
  completedAt?: string;
}

export interface Exam {
  id: string;
  unitId: string;
  lessonId?: string | null; // Optional: Eğer belirtilirse sınav o dersin sonrasına yerleşir
  order: number;
  passingScore?: number;
  translations?: ExamTranslation[];
  questions?: ExamQuestion[];
  completion?: UserExamCompletion | null;
}

export interface ExamTranslation {
  id: string;
  examId: string;
  languageId: string;
  title: string;
  description?: string;
}

export interface ExamQuestion {
  id: string;
  examId: string;
  order: number;
  type: string;
  correctAnswer?: string;
  mediaUrl?: string;
  prompts?: ExamQuestionPrompt[];
  options?: ExamQuestionOption[];
}

export interface ExamQuestionPrompt {
  id: string;
  questionId: string;
  languageId: string;
  questionText: string;
}

export interface ExamQuestionOption {
  id: string;
  questionId: string;
  order: number;
  translations?: ExamQuestionOptionTranslation[];
}

export interface ExamQuestionOptionTranslation {
  id: string;
  optionId: string;
  languageId: string;
  optionText: string;
}

export interface Dialog {
  id: string;
  unitId?: string | null;
  lessonId?: string | null;
  levelId?: string | null;
  order: number;
  isFree: boolean;
  translations?: DialogTranslation[];
  characters?: DialogCharacter[];
  messages?: DialogMessage[];
  questions?: DialogQuestion[];
}

export interface DialogTranslation {
  id: string;
  dialogId: string;
  languageId: string;
  title: string;
  description?: string;
  scenario?: string;
}

export interface DialogCharacter {
  id: string;
  dialogId: string;
  order: number;
  avatarUrl?: string;
  translations?: DialogCharacterTranslation[];
}

export interface DialogCharacterTranslation {
  id: string;
  characterId: string;
  languageId: string;
  name: string;
}

export interface DialogMessage {
  id: string;
  dialogId: string;
  characterId: string;
  order: number;
  audioUrl?: string;
  character?: DialogCharacter;
  translations?: DialogMessageTranslation[];
}

export interface DialogMessageTranslation {
  id: string;
  messageId: string;
  languageId: string;
  text: string;
}

export interface DialogQuestion {
  id: string;
  dialogId: string;
  order: number;
  type: string;
  correctAnswer?: string;
  mediaUrl?: string;
  prompts?: DialogQuestionPrompt[];
  options?: DialogQuestionOption[];
}

export interface DialogQuestionPrompt {
  id: string;
  questionId: string;
  languageId: string;
  questionText: string;
}

export interface DialogQuestionOption {
  id: string;
  questionId: string;
  order: number;
  translations?: DialogQuestionOptionTranslation[];
}

export interface DialogQuestionOptionTranslation {
  id: string;
  optionId: string;
  languageId: string;
  optionText: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

