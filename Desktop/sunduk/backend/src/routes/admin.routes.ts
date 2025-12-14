import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';
import {
  getLanguages,
  createLanguage,
  updateLanguage,
  deleteLanguage,
  getLevels,
  createLevel,
  updateLevel,
  deleteLevel,
  getUnits,
  createUnit,
  updateUnit,
  deleteUnit,
  getLessons,
  createLesson,
  updateLesson,
  deleteLesson,
  getExercises,
  getExercise,
  createExercise,
  updateExercise,
  deleteExercise,
  getExams,
  getExam,
  createExam,
  updateExam,
  deleteExam,
  createExamQuestion,
  updateExamQuestion,
  deleteExamQuestion,
  getDialogs,
  getDialog,
  createDialog,
  updateDialog,
  deleteDialog,
  createDialogQuestion,
  updateDialogQuestion,
  deleteDialogQuestion,
  getUsers,
  getUserSubscriptions,
  createSubscription,
} from '../controllers/admin.controller';

const router = Router();

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(adminMiddleware);

// Languages
router.get('/languages', getLanguages);
router.post('/languages', createLanguage);
router.put('/languages/:id', updateLanguage);
router.delete('/languages/:id', deleteLanguage);

// Levels
router.get('/levels', getLevels);
router.post('/levels', createLevel);
router.put('/levels/:id', updateLevel);
router.delete('/levels/:id', deleteLevel);

// Units
router.get('/units', getUnits);
router.post('/units', createUnit);
router.put('/units/:id', updateUnit);
router.delete('/units/:id', deleteUnit);

// Lessons
router.get('/lessons', getLessons);
router.post('/lessons', createLesson);
router.put('/lessons/:id', updateLesson);
router.delete('/lessons/:id', deleteLesson);

// Exercises
router.get('/exercises', getExercises);
router.get('/exercises/:id', getExercise);
router.post('/exercises', createExercise);
router.put('/exercises/:id', updateExercise);
router.delete('/exercises/:id', deleteExercise);

// Exams
router.get('/exams', getExams);
router.get('/exams/:id', getExam);
router.post('/exams', createExam);
router.put('/exams/:id', updateExam);
router.delete('/exams/:id', deleteExam);

// Exam Questions
router.post('/exams/:examId/questions', createExamQuestion);
router.put('/exam-questions/:id', updateExamQuestion);
router.delete('/exam-questions/:id', deleteExamQuestion);

// Dialogs
router.get('/dialogs', getDialogs);
router.get('/dialogs/:id', getDialog);
router.post('/dialogs', createDialog);
router.put('/dialogs/:id', updateDialog);
router.delete('/dialogs/:id', deleteDialog);

// Dialog Questions
router.post('/dialogs/:dialogId/questions', createDialogQuestion);
router.put('/dialog-questions/:id', updateDialogQuestion);
router.delete('/dialog-questions/:id', deleteDialogQuestion);

// Users
router.get('/users', getUsers);

// Subscriptions
router.get('/subscriptions', getUserSubscriptions);
router.post('/subscriptions', createSubscription);

export default router;

