import { Router } from 'express';
import {
  getLevels,
  getUnit,
  getLesson,
  getUserProgress,
  updateProgress,
} from '../controllers/content.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All content routes require authentication
router.use(authMiddleware);

router.get('/levels', getLevels);
router.get('/unit/:unitId', getUnit);
router.get('/lesson/:lessonId', getLesson);
router.get('/progress', getUserProgress);
router.put('/progress', updateProgress);

export default router;

