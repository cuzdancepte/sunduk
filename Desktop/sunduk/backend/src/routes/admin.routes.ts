import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';
import {
  getLanguages,
  createLanguage,
  getLevels,
  createLevel,
  getUnits,
  createUnit,
  getLessons,
  createLesson,
  getExercises,
  createExercise,
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

// Levels
router.get('/levels', getLevels);
router.post('/levels', createLevel);

// Units
router.get('/units', getUnits);
router.post('/units', createUnit);

// Lessons
router.get('/lessons', getLessons);
router.post('/lessons', createLesson);

// Exercises
router.get('/exercises', getExercises);
router.post('/exercises', createExercise);

// Users
router.get('/users', getUsers);

// Subscriptions
router.get('/subscriptions', getUserSubscriptions);
router.post('/subscriptions', createSubscription);

export default router;

