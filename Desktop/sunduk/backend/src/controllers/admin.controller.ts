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

export const updateLanguage = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { code, name, flagIcon } = req.body;
    const language = await prisma.language.update({
      where: { id },
      data: {
        code,
        name,
        flag_icon: flagIcon,
      },
    });
    res.json(language);
  } catch (error) {
    console.error('Update language error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteLanguage = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.language.delete({
      where: { id },
    });
    res.json({ message: 'Language deleted successfully' });
  } catch (error) {
    console.error('Delete language error:', error);
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

export const updateLevel = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { code, order } = req.body;
    const level = await prisma.level.update({
      where: { id },
      data: {
        code,
        order,
      },
    });
    res.json(level);
  } catch (error) {
    console.error('Update level error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteLevel = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.level.delete({
      where: { id },
    });
    res.json({ message: 'Level deleted successfully' });
  } catch (error) {
    console.error('Delete level error:', error);
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

export const updateUnit = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { levelId, order, slug, translations } = req.body;
    
    // Delete existing translations and create new ones
    await prisma.unitTranslation.deleteMany({
      where: { unitId: id },
    });

    const unit = await prisma.unit.update({
      where: { id },
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
    res.json(unit);
  } catch (error) {
    console.error('Update unit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteUnit = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.unit.delete({
      where: { id },
    });
    res.json({ message: 'Unit deleted successfully' });
  } catch (error) {
    console.error('Delete unit error:', error);
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
    const { unitId, order, isFree, passingScore, iconType, translations } = req.body;
    const lesson = await prisma.lesson.create({
      data: {
        unitId,
        order,
        isFree: isFree || false,
        passingScore: passingScore !== undefined ? passingScore : 70,
        iconType: iconType || 'star',
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

export const updateLesson = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { unitId, order, isFree, passingScore, iconType, translations } = req.body;
    
    // Delete existing translations and create new ones
    await prisma.lessonTranslation.deleteMany({
      where: { lessonId: id },
    });

    const lesson = await prisma.lesson.update({
      where: { id },
      data: {
        unitId,
        order,
        isFree: isFree || false,
        passingScore: passingScore !== undefined ? passingScore : 70,
        iconType: iconType || 'star',
        translations: {
          create: translations || [],
        },
      },
      include: {
        translations: true,
      },
    });
    res.json(lesson);
  } catch (error) {
    console.error('Update lesson error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteLesson = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.lesson.delete({
      where: { id },
    });
    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('Delete lesson error:', error);
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
        lesson: {
          include: {
            translations: true,
          },
        },
        prompts: true,
        options: {
          include: {
            translations: true,
          },
          orderBy: { order: 'asc' },
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

export const getExercise = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const exercise = await prisma.exercise.findUnique({
      where: { id },
      include: {
        lesson: {
          include: {
            translations: true,
          },
        },
        prompts: true,
        options: {
          include: {
            translations: true,
          },
          orderBy: { order: 'asc' },
        },
      },
    });
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }
    res.json(exercise);
  } catch (error) {
    console.error('Get exercise error:', error);
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

export const updateExercise = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      lessonId,
      type,
      correctAnswer,
      mediaUrl,
      order,
      prompts,
      options,
    } = req.body;

    // Delete existing prompts, options and their translations
    await prisma.exercisePrompt.deleteMany({
      where: { exerciseId: id },
    });
    
    const existingOptions = await prisma.exerciseOption.findMany({
      where: { exerciseId: id },
    });
    
    for (const opt of existingOptions) {
      await prisma.exerciseOptionTranslation.deleteMany({
        where: { optionId: opt.id },
      });
    }
    
    await prisma.exerciseOption.deleteMany({
      where: { exerciseId: id },
    });

    const exercise = await prisma.exercise.update({
      where: { id },
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
    res.json(exercise);
  } catch (error) {
    console.error('Update exercise error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteExercise = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.exercise.delete({
      where: { id },
    });
    res.json({ message: 'Exercise deleted successfully' });
  } catch (error) {
    console.error('Delete exercise error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Exams CRUD
export const getExams = async (req: AuthRequest, res: Response) => {
  try {
    const { unitId } = req.query;
    const exams = await prisma.exam.findMany({
      where: unitId ? { unitId: unitId as string } : undefined,
      include: {
        unit: {
          include: {
            translations: true,
          },
        },
        translations: true,
        questions: {
          include: {
            prompts: true,
            options: {
              include: {
                translations: true,
              },
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });
    res.json(exams);
  } catch (error) {
    console.error('Get exams error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getExam = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const exam = await prisma.exam.findUnique({
      where: { id },
      include: {
        unit: {
          include: {
            translations: true,
          },
        },
        translations: true,
        questions: {
          include: {
            prompts: true,
            options: {
              include: {
                translations: true,
              },
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    res.json(exam);
  } catch (error) {
    console.error('Get exam error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createExam = async (req: AuthRequest, res: Response) => {
  try {
    const { unitId, order, passingScore, translations } = req.body;

    const exam = await prisma.exam.create({
      data: {
        unitId,
        order: parseInt(order),
        passingScore: passingScore ? parseFloat(passingScore) : 70,
        translations: {
          create: translations?.map((t: any) => ({
            languageId: t.languageId,
            title: t.title,
            description: t.description || null,
          })) || [],
        },
      },
      include: {
        unit: {
          include: {
            translations: true,
          },
        },
        translations: true,
      },
    });
    res.status(201).json(exam);
  } catch (error) {
    console.error('Create exam error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateExam = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { unitId, order, passingScore, translations } = req.body;

    // First, delete existing translations
    await prisma.examTranslation.deleteMany({
      where: { examId: id },
    });

    const exam = await prisma.exam.update({
      where: { id },
      data: {
        unitId,
        order: parseInt(order),
        passingScore: passingScore ? parseFloat(passingScore) : 70,
        translations: {
          create: translations?.map((t: any) => ({
            languageId: t.languageId,
            title: t.title,
            description: t.description || null,
          })) || [],
        },
      },
      include: {
        unit: {
          include: {
            translations: true,
          },
        },
        translations: true,
        questions: {
          include: {
            prompts: true,
            options: {
              include: {
                translations: true,
              },
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });
    res.json(exam);
  } catch (error) {
    console.error('Update exam error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteExam = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.exam.delete({
      where: { id },
    });
    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    console.error('Delete exam error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Exam Questions CRUD
export const createExamQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { examId } = req.params;
    const {
      type,
      order,
      correctAnswer,
      mediaUrl,
      prompts,
      options,
    } = req.body;

    const question = await prisma.examQuestion.create({
      data: {
        examId,
        type,
        order: order || 0,
        correctAnswer,
        mediaUrl,
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
          orderBy: { order: 'asc' },
        },
      },
    });
    res.status(201).json(question);
  } catch (error) {
    console.error('Create exam question error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateExamQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      examId,
      type,
      order,
      correctAnswer,
      mediaUrl,
      prompts,
      options,
    } = req.body;

    // Delete existing prompts and options
    await prisma.examQuestionPrompt.deleteMany({
      where: { questionId: id },
    });
    await prisma.examQuestionOptionTranslation.deleteMany({
      where: {
        option: {
          questionId: id,
        },
      },
    });
    await prisma.examQuestionOption.deleteMany({
      where: { questionId: id },
    });

    const question = await prisma.examQuestion.update({
      where: { id },
      data: {
        examId,
        type,
        order: order || 0,
        correctAnswer,
        mediaUrl,
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
          orderBy: { order: 'asc' },
        },
      },
    });
    res.json(question);
  } catch (error) {
    console.error('Update exam question error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteExamQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.examQuestion.delete({
      where: { id },
    });
    res.json({ message: 'Exam question deleted successfully' });
  } catch (error) {
    console.error('Delete exam question error:', error);
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

