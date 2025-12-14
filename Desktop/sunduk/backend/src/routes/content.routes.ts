import { Router } from 'express';
import {
  getLevels,
  getUnit,
  getLesson,
  getExam,
  getUserProgress,
  updateProgress,
  updateExamProgress,
  getDialogs,
  getDialog,
} from '../controllers/content.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All content routes require authentication
router.use(authMiddleware);

router.get('/levels', getLevels);
router.get('/unit/:unitId', getUnit);
router.get('/lesson/:lessonId', getLesson);
router.get('/exam/:examId', getExam);
router.get('/dialogs', getDialogs);
router.get('/dialog/:dialogId', getDialog);
router.get('/progress', getUserProgress);
router.put('/progress', updateProgress);
router.put('/exam-progress', updateExamProgress);

export default router;

