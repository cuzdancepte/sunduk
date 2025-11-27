import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';
import { upload, uploadImage } from '../controllers/upload.controller';

const router = Router();

// All upload routes require authentication and admin role
router.use(authMiddleware);
router.use(adminMiddleware);

router.post('/image', upload.single('image'), uploadImage);

export default router;

