import { Response } from 'express';
import prisma from '../utils/db';
import { AuthRequest } from '../middleware/auth.middleware';

export const getLevels = async (req: AuthRequest, res: Response) => {
  try {
    const levels = await prisma.level.findMany({
      orderBy: { order: 'asc' },
      include: {
        units: {
          orderBy: { order: 'asc' },
          include: {
            translations: {
              where: {
                languageId: req.user?.nativeLanguageId || '',
              },
            },
          },
        },
      },
    });

    res.json(levels);
  } catch (error) {
    console.error('Get levels error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUnit = async (req: AuthRequest, res: Response) => {
  try {
    const { unitId } = req.params;
    const nativeLanguageId = req.user?.nativeLanguageId;

    if (!nativeLanguageId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    const unit = await prisma.unit.findUnique({
      where: { id: unitId },
      include: {
        level: true,
        translations: {
          where: {
            languageId: nativeLanguageId,
          },
        },
        lessons: {
          orderBy: { order: 'asc' },
          include: {
            translations: {
              where: {
                languageId: nativeLanguageId,
              },
            },
          },
        },
      },
    });

    if (!unit) {
      return res.status(404).json({ error: 'Unit not found' });
    }

    res.json(unit);
  } catch (error) {
    console.error('Get unit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getLesson = async (req: AuthRequest, res: Response) => {
  try {
    const { lessonId } = req.params;
    const nativeLanguageId = req.user?.nativeLanguageId;
    const userId = req.userId;

    if (!nativeLanguageId || !userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    // Check subscription for premium lessons
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        unit: {
          include: {
            level: true,
          },
        },
      },
    });

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    // Check if lesson is free or user has active subscription
    if (!lesson.isFree) {
      const activeSubscription = await prisma.userSubscription.findFirst({
        where: {
          userId,
          status: 'active',
          startDate: { lte: new Date() },
          endDate: { gte: new Date() },
        },
      });

      if (!activeSubscription) {
        return res.status(403).json({
          error: 'Premium subscription required for this lesson',
        });
      }
    }

    // Get lesson with translations and exercises
    const lessonWithContent = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        translations: {
          where: {
            languageId: nativeLanguageId,
          },
        },
        exercises: {
          orderBy: { order: 'asc' },
          include: {
            prompts: {
              where: {
                languageId: nativeLanguageId,
              },
            },
            options: {
              include: {
                translations: {
                  where: {
                    languageId: nativeLanguageId,
                  },
                },
              },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    res.json(lessonWithContent);
  } catch (error) {
    console.error('Get lesson error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserProgress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    const progress = await prisma.userProgress.findUnique({
      where: { userId },
      include: {
        currentLesson: {
          include: {
            unit: {
              include: {
                level: true,
              },
            },
          },
        },
      },
    });

    res.json(progress);
  } catch (error) {
    console.error('Get user progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProgress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { lessonId, completed } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    const progress = await prisma.userProgress.upsert({
      where: { userId },
      update: {
        currentLessonId: lessonId,
        completedAt: completed ? new Date() : null,
      },
      create: {
        userId,
        currentLessonId: lessonId,
        completedAt: completed ? new Date() : null,
      },
    });

    res.json(progress);
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

