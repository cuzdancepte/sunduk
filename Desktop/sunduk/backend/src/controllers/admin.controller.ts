import { Response } from 'express';
import prisma from '../utils/db';
import { AuthRequest } from '../middleware/auth.middleware';

// Languages CRUD
export const getLanguages = async (req: AuthRequest, res: Response) => {
  try {
    const languages = await prisma.language.findMany({
      orderBy: { code: 'asc' },
    });
    res.json(languages);
  } catch (error) {
    console.error('Get languages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createLanguage = async (req: AuthRequest, res: Response) => {
  try {
    const { code, name, flagIcon } = req.body;
    const language = await prisma.language.create({
      data: {
        code,
        name,
        flag_icon: flagIcon,
      },
    });
    res.status(201).json(language);
  } catch (error) {
    console.error('Create language error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Levels CRUD
export const getLevels = async (req: AuthRequest, res: Response) => {
  try {
    const levels = await prisma.level.findMany({
      orderBy: { order: 'asc' },
    });
    res.json(levels);
  } catch (error) {
    console.error('Get levels error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createLevel = async (req: AuthRequest, res: Response) => {
  try {
    const { code, order } = req.body;
    const level = await prisma.level.create({
      data: {
        code,
        order,
      },
    });
    res.status(201).json(level);
  } catch (error) {
    console.error('Create level error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Units CRUD
export const getUnits = async (req: AuthRequest, res: Response) => {
  try {
    const { levelId } = req.query;
    const units = await prisma.unit.findMany({
      where: levelId ? { levelId: levelId as string } : undefined,
      include: {
        level: true,
        translations: true,
      },
      orderBy: { order: 'asc' },
    });
    res.json(units);
  } catch (error) {
    console.error('Get units error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createUnit = async (req: AuthRequest, res: Response) => {
  try {
    const { levelId, order, slug, translations } = req.body;
    const unit = await prisma.unit.create({
      data: {
        levelId,
        order,
        slug,
        translations: {
          create: translations || [],
        },
      },
      include: {
        translations: true,
      },
    });
    res.status(201).json(unit);
  } catch (error) {
    console.error('Create unit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Lessons CRUD
export const getLessons = async (req: AuthRequest, res: Response) => {
  try {
    const { unitId } = req.query;
    const lessons = await prisma.lesson.findMany({
      where: unitId ? { unitId: unitId as string } : undefined,
      include: {
        unit: true,
        translations: true,
      },
      orderBy: { order: 'asc' },
    });
    res.json(lessons);
  } catch (error) {
    console.error('Get lessons error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createLesson = async (req: AuthRequest, res: Response) => {
  try {
    const { unitId, order, isFree, translations } = req.body;
    const lesson = await prisma.lesson.create({
      data: {
        unitId,
        order,
        isFree: isFree || false,
        translations: {
          create: translations || [],
        },
      },
      include: {
        translations: true,
      },
    });
    res.status(201).json(lesson);
  } catch (error) {
    console.error('Create lesson error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Exercises CRUD
export const getExercises = async (req: AuthRequest, res: Response) => {
  try {
    const { lessonId } = req.query;
    const exercises = await prisma.exercise.findMany({
      where: lessonId ? { lessonId: lessonId as string } : undefined,
      include: {
        lesson: true,
        prompts: true,
        options: {
          include: {
            translations: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    });
    res.json(exercises);
  } catch (error) {
    console.error('Get exercises error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createExercise = async (req: AuthRequest, res: Response) => {
  try {
    const {
      lessonId,
      type,
      correctAnswer,
      mediaUrl,
      order,
      prompts,
      options,
    } = req.body;

    const exercise = await prisma.exercise.create({
      data: {
        lessonId,
        type,
        correctAnswer,
        mediaUrl,
        order: order || 0,
        prompts: {
          create: prompts || [],
        },
        options: {
          create:
            options?.map((opt: any) => ({
              order: opt.order || 0,
              translations: {
                create: opt.translations || [],
              },
            })) || [],
        },
      },
      include: {
        prompts: true,
        options: {
          include: {
            translations: true,
          },
        },
      },
    });
    res.status(201).json(exercise);
  } catch (error) {
    console.error('Create exercise error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Users Management
export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        nativeLanguageId: true,
        learningLanguageId: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Subscriptions Management
export const getUserSubscriptions = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.query;
    const subscriptions = await prisma.userSubscription.findMany({
      where: userId ? { userId: userId as string } : undefined,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(subscriptions);
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createSubscription = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, startDate, endDate, status } = req.body;
    const subscription = await prisma.userSubscription.create({
      data: {
        userId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: status || 'active',
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
      },
    });
    res.status(201).json(subscription);
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

