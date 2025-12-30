import { Response } from 'express';
import prisma from '../utils/db';
import { AuthRequest } from '../middleware/auth.middleware';

export const getLevels = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    // Get user's native language
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { nativeLanguageId: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const levels = await prisma.level.findMany({
      orderBy: { order: 'asc' },
      include: {
        units: {
          orderBy: { order: 'asc' },
          include: {
            translations: {
              where: {
                languageId: user.nativeLanguageId,
              },
            },
            lessons: {
              orderBy: { order: 'asc' },
              include: {
                translations: {
                  where: {
                    languageId: user.nativeLanguageId,
                  },
                },
              },
            },
            exams: {
              orderBy: { order: 'asc' },
              include: {
                translations: {
                  where: {
                    languageId: user.nativeLanguageId,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Get lesson completions for all lessons in all units
    const allLessonIds = levels.flatMap((level) =>
      level.units.flatMap((unit) => unit.lessons.map((lesson) => lesson.id))
    );

    const lessonCompletions = await prisma.userLessonCompletion.findMany({
      where: {
        userId,
        lessonId: {
          in: allLessonIds,
        },
      },
    });

    // Map completions by lessonId
    const completionsMap = new Map(
      lessonCompletions.map((completion) => [completion.lessonId, completion])
    );

    // Get exam completions for all exams in all units
    const allExamIds = levels.flatMap((level) =>
      level.units.flatMap((unit) => (unit.exams || []).map((exam) => exam.id))
    );

    const examCompletions = await prisma.userExamCompletion.findMany({
      where: {
        userId,
        examId: {
          in: allExamIds,
        },
      },
    });

    // Map exam completions by examId
    const examCompletionsMap = new Map(
      examCompletions.map((completion) => [completion.examId, completion])
    );

    // Add completion status to each lesson and exam
    const levelsWithCompletions = levels.map((level) => ({
      ...level,
      units: level.units.map((unit) => ({
        ...unit,
        lessons: unit.lessons.map((lesson) => ({
          ...lesson,
          completion: completionsMap.get(lesson.id) || null,
        })),
        exams: (unit.exams || []).map((exam) => ({
          ...exam,
          completion: examCompletionsMap.get(exam.id) || null,
        })),
      })),
    }));

    res.json(levelsWithCompletions);
  } catch (error) {
    console.error('Get levels error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUnit = async (req: AuthRequest, res: Response) => {
  try {
    const { unitId } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    // Get user's native language
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { nativeLanguageId: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const unit = await prisma.unit.findUnique({
      where: { id: unitId },
      include: {
        level: true,
        translations: {
          where: {
            languageId: user.nativeLanguageId,
          },
        },
        lessons: {
          orderBy: { order: 'asc' },
          include: {
            translations: {
              where: {
                languageId: user.nativeLanguageId,
              },
            },
          },
        },
        exams: {
          orderBy: { order: 'asc' },
          include: {
            translations: {
              where: {
                languageId: user.nativeLanguageId,
              },
            },
          },
        },
      },
    });

    if (!unit) {
      return res.status(404).json({ error: 'Unit not found' });
    }

    // Get lesson completions for this user (only if there are lessons)
    let lessonsWithCompletion = unit.lessons || [];
    
    if (lessonsWithCompletion.length > 0) {
      try {
        const lessonCompletions = await prisma.userLessonCompletion.findMany({
          where: {
            userId,
            lessonId: {
              in: lessonsWithCompletion.map((lesson) => lesson.id),
            },
          },
        });

        // Map completions by lessonId for easy lookup
        const completionsMap = new Map(
          lessonCompletions.map((completion) => [completion.lessonId, completion])
        );

        // Add completion status to each lesson
        lessonsWithCompletion = lessonsWithCompletion.map((lesson) => ({
          ...lesson,
          completion: completionsMap.get(lesson.id) || null,
        }));
      } catch (error) {
        console.error('Error fetching lesson completions:', error);
        // Continue without completions if there's an error
      }
    }

    // Get exam completions for this user (only if there are exams)
    let examsWithCompletion = unit.exams || [];
    
    if (examsWithCompletion.length > 0) {
      try {
        const examCompletions = await prisma.userExamCompletion.findMany({
          where: {
            userId,
            examId: {
              in: examsWithCompletion.map((exam) => exam.id),
            },
          },
        });

        // Map completions by examId for easy lookup
        const examCompletionsMap = new Map(
          examCompletions.map((completion) => [completion.examId, completion])
        );

        // Add completion status to each exam
        examsWithCompletion = examsWithCompletion.map((exam) => ({
          ...exam,
          completion: examCompletionsMap.get(exam.id) || null,
        }));
      } catch (error) {
        console.error('Error fetching exam completions:', error);
        // Continue without completions if there's an error
      }
    }

    res.json({
      ...unit,
      lessons: lessonsWithCompletion,
      exams: examsWithCompletion,
    });
  } catch (error) {
    console.error('Get unit error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getLesson = async (req: AuthRequest, res: Response) => {
  try {
    const { lessonId } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    // Get user's native language
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { nativeLanguageId: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const nativeLanguageId = user.nativeLanguageId;

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
                translations: true, // Get all translations, frontend will filter by native language
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

export const getExam = async (req: AuthRequest, res: Response) => {
  try {
    const { examId } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    // Get user's native language
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { nativeLanguageId: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      include: {
        unit: {
          include: {
            level: true,
          },
        },
        translations: {
          where: {
            languageId: user.nativeLanguageId,
          },
        },
        questions: {
          orderBy: { order: 'asc' },
          include: {
            prompts: {
              where: {
                languageId: user.nativeLanguageId,
              },
            },
            options: {
              orderBy: { order: 'asc' },
              include: {
                translations: true, // Get all translations, frontend will filter by native language
              },
            },
          },
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

export const updateProgress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { lessonId, completed, score, correctCount, totalCount } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    // Update general user progress
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

    // Save lesson completion record
    if (lessonId && score !== undefined && correctCount !== undefined && totalCount !== undefined) {
      await prisma.userLessonCompletion.upsert({
        where: {
          userId_lessonId: {
            userId,
            lessonId,
          },
        },
        update: {
          score,
          correctCount,
          totalCount,
          completed,
          completedAt: completed ? new Date() : null,
        },
        create: {
          userId,
          lessonId,
          score,
          correctCount,
          totalCount,
          completed,
          completedAt: completed ? new Date() : null,
        },
      });
    }

    res.json(progress);
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateExamProgress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { examId, completed, score, correctCount, totalCount } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    // Save exam completion record
    if (examId && score !== undefined && correctCount !== undefined && totalCount !== undefined) {
      await prisma.userExamCompletion.upsert({
        where: {
          userId_examId: {
            userId,
            examId,
          },
        },
        update: {
          score,
          correctCount,
          totalCount,
          completed,
          completedAt: completed ? new Date() : null,
        },
        create: {
          userId,
          examId,
          score,
          correctCount,
          totalCount,
          completed,
          completedAt: completed ? new Date() : null,
        },
      });
    }

    res.json({ message: 'Exam progress updated successfully' });
  } catch (error) {
    console.error('Update exam progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getDialogs = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    // Get user's native language
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { nativeLanguageId: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const dialogs = await prisma.dialog.findMany({
      orderBy: { order: 'asc' },
      include: {
        translations: {
          where: {
            languageId: user.nativeLanguageId,
          },
        },
        characters: {
          include: {
            translations: {
              where: {
                languageId: user.nativeLanguageId,
              },
            },
          },
          orderBy: { order: 'asc' },
        },
        messages: {
          include: {
            character: {
              include: {
                translations: {
                  where: {
                    languageId: user.nativeLanguageId,
                  },
                },
              },
            },
            translations: {
              where: {
                languageId: user.nativeLanguageId,
              },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    res.json(dialogs);
  } catch (error) {
    console.error('Get dialogs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getDialog = async (req: AuthRequest, res: Response) => {
  try {
    const { dialogId } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'User authentication required' });
    }

    // Get user's native language and learning language
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { nativeLanguageId: true, learningLanguageId: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const dialog = await prisma.dialog.findUnique({
      where: { id: dialogId },
      include: {
        unit: {
          include: {
            translations: {
              where: {
                languageId: user.nativeLanguageId,
              },
            },
          },
        },
        lesson: {
          include: {
            translations: {
              where: {
                languageId: user.nativeLanguageId,
              },
            },
          },
        },
        level: true,
        translations: {
          where: {
            languageId: user.nativeLanguageId,
          },
        },
        characters: {
          include: {
            translations: {
              where: {
                languageId: user.nativeLanguageId,
              },
            },
          },
          orderBy: { order: 'asc' },
        },
        messages: {
          include: {
            character: {
              include: {
                translations: {
                  where: {
                    languageId: user.nativeLanguageId,
                  },
                },
              },
            },
            translations: true, // Tüm çevirileri al (hem öğrenilen dil hem native language)
          },
          orderBy: { order: 'asc' },
        },
        questions: {
          include: {
            prompts: {
              where: {
                languageId: user.nativeLanguageId,
              },
            },
            options: {
              include: {
                translations: {
                  where: {
                    languageId: user.nativeLanguageId,
                  },
                },
              },
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!dialog) {
      return res.status(404).json({ error: 'Dialog not found' });
    }

    // Check if dialog is free or user has active subscription
    if (!dialog.isFree) {
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
          error: 'Premium subscription required for this dialog',
        });
      }
    }

    res.json(dialog);
  } catch (error) {
    console.error('Get dialog error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

