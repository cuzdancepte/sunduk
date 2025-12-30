import { Level, Unit, Lesson, Exercise, Exam } from '../types';

export type PathItemType =
  | 'unit_card'
  | 'lesson_step'
  | 'exercise_step'
  | 'mascot'
  | 'trophy';
export type StepType = 'pass' | 'lock' | 'default';
export type StepIcon =
  | 'checkmark'
  | 'document'
  | 'microphone'
  | 'edit'
  | 'star'
  | 'lock';

export interface PathItem {
  id: string;
  type: PathItemType;
  unitId?: string;
  lessonId?: string;
  exerciseId?: string;
  stepType?: StepType;
  icon?: StepIcon;
  mascotType?: 'spirit' | 'happy' | 'thinking' | 'cool' | 'meditation';
  trophyNumber?: number;
  position: {
    top: number;
    left: number;
    size?: number;
  };
  order: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  isActive?: boolean; // İlk açık ve tamamlanmamış ders için true
  metadata?: {
    backgroundColor?: string;
    title?: string;
    lessonNumber?: number;
  };
}

const STEP_SIZE = 120;
const STEP_VERTICAL_GAP = 180;
const UNIT_SECTION_GAP = 220;

const unitColors = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#FFA07A',
  '#98D8C8',
  '#F7DC6F',
  '#BB8FCE',
  '#85C1E2',
  '#F8B739',
  '#6C5CE7',
];

const exerciseTypeToIcon: Record<string, StepIcon> = {
  multiple_choice: 'checkmark',
  listening: 'microphone',
  writing: 'edit',
  reading: 'document',
  speaking: 'microphone',
  translation: 'edit',
  fill_blank: 'checkmark',
};

const getExerciseIcon = (exerciseType: string): StepIcon =>
  exerciseTypeToIcon[exerciseType] || 'checkmark';

const getUnitColor = (order: number): string =>
  unitColors[(order - 1) % unitColors.length];

const getLessonTitle = (lesson: Lesson, fallback: string) =>
  lesson.translations?.[0]?.title || fallback;

const collectCompletedLessons = (levels: Level[]): Set<string> => {
  const completed = new Set<string>();

  levels.forEach(level => {
    level.units?.forEach(unit => {
      unit.lessons?.forEach(lesson => {
        if (lesson.completion?.completed) {
          completed.add(lesson.id);
        }
      });
    });
  });

  return completed;
};

const collectCompletedExams = (levels: Level[]): Set<string> => {
  const completed = new Set<string>();

  levels.forEach(level => {
    level.units?.forEach(unit => {
      unit.exams?.forEach(exam => {
        if (exam.completion?.completed) {
          completed.add(exam.id);
        }
      });
    });
  });

  return completed;
};

const getSortedUnits = (levels: Level[]): Unit[] => {
  return levels
    .slice()
    .sort((a, b) => a.order - b.order)
    .flatMap(level =>
      (level.units || []).slice().sort((a, b) => a.order - b.order),
    );
};

const getZigZagPosition = (
  index: number,
  screenWidth: number,
  gridPadding: number,
) => {
  const lanes = [
    gridPadding + STEP_SIZE / 2,
    screenWidth - gridPadding - STEP_SIZE / 2,
  ];

  return lanes[index % lanes.length];
};

const normalizePositions = (items: PathItem[]): PathItem[] => {
  if (items.length === 0) {
    return [];
  }

  const maxTop = Math.max(...items.map(item => item.position.top));
  const inverted = items.map(item => ({
    ...item,
    position: {
      ...item.position,
      top: maxTop - item.position.top,
    },
  }));

  const minTop = Math.min(...inverted.map(item => item.position.top));

  return inverted.map(item => ({
    ...item,
    position: {
      ...item.position,
      top: item.position.top - minTop,
    },
  }));
};

const applySequentialUnlocks = (items: PathItem[]): PathItem[] => {
  let previousStepsCompleted = true;
  let firstActiveFound = false; // İlk aktif dersi takip etmek için

  console.log('🔍 ========== APPLY SEQUENTIAL UNLOCKS ==========');
  console.log(`📊 Toplam ${items.length} item işlenecek\n`);

  const result = items.map((item, index) => {
    // 🔍 DEBUG: Önce previousStepsCompleted değerini kaydet (bu item işlenmeden ÖNCE)
    const prevStepsCompletedBefore = previousStepsCompleted;
    
    // Sıralı ilerleme: Bir ders sadece önceki tüm adımlar tamamlanmışsa unlock olmalı
    // Tamamlanmış bir ders bile, önceki dersler tamamlanmamışsa kilitli gösterilmeli
    const isUnlocked = previousStepsCompleted;
    
    // Update previousStepsCompleted: if current item is not completed, mark as false
    if (!item.isCompleted) {
      previousStepsCompleted = false;
    }

    // Determine stepType based on completion and unlock status
    let stepType: 'pass' | 'lock' | 'default' = 'default';
    let isActive = false;

    if (item.type === 'lesson_step' || item.type === 'exercise_step') {
      // Sadece unlock VE tamamlanmışsa sarı göster
      if (item.isCompleted && isUnlocked) {
        stepType = 'pass'; // Tamamlanmış: sarı (biten.svg)
      } else if (isUnlocked) {
        stepType = 'default'; // Üzerinde çalışılan: mavi/mor (mevcut.svg)
        // İlk açık ve tamamlanmamış ders = aktif ders (pulse animasyonu için)
        if (!firstActiveFound) {
          isActive = true;
          firstActiveFound = true;
        }
      } else {
        stepType = 'lock'; // Sırası gelmemiş: gri (baslamayan.svg) - önceki dersler tamamlanmamış
      }
    } else if (item.type === 'trophy') {
      // Exam'ler için de aynı mantık: pass, default, veya lock
      // Sadece unlock VE tamamlanmışsa sarı göster
      if (item.isCompleted && isUnlocked) {
        stepType = 'pass'; // Tamamlanmış: sarı
      } else if (isUnlocked) {
        stepType = 'default'; // Aktif/yapılabilir: mor
        // İlk açık ve tamamlanmamış item = aktif item (pulse animasyonu için)
        if (!firstActiveFound) {
          isActive = true;
          firstActiveFound = true;
        }
      } else {
        stepType = 'lock'; // Kilitli: gri
      }
    } else if (item.type === 'unit_card') {
      // Unit card'lar için de sıralı ilerleme mantığı uygulanmalı
      // Önceki tüm dersler tamamlanmışsa unlock, değilse kilitli
      if (isUnlocked) {
        stepType = 'default'; // Unlock ise normal görünüm
      } else {
        stepType = 'lock'; // Önceki dersler tamamlanmamışsa kilitli
      }
    } else if (item.type === 'mascot') {
      // Mascot'lar için de sıralı ilerleme mantığı uygulanmalı
      // Önceki tüm dersler tamamlanmışsa unlock, değilse kilitli
      if (isUnlocked) {
        stepType = 'default'; // Unlock ise normal görünüm
      } else {
        stepType = 'lock'; // Önceki dersler tamamlanmamışsa kilitli
      }
    }

    // 🔍 DEBUG: TÜM item'lar için detaylı log (lesson_step, exercise_step, unit_card, mascot, trophy)
    const itemTitle = item.metadata?.title || item.lessonId || item.exerciseId || item.id;
    let color = '⚪';
    if (item.type === 'lesson_step' || item.type === 'exercise_step') {
      color = stepType === 'pass' ? '🟡' : stepType === 'default' ? '🟣' : '⚪';
    } else if (item.type === 'trophy') {
      color = stepType === 'pass' ? '🟡' : stepType === 'default' ? '🟣' : '⚪'; // Tamamlanmış: sarı, aktif: mor, kilitli: gri
    } else if (item.type === 'unit_card') {
      color = stepType === 'default' ? '📦' : '⚪'; // Unlock ise normal (📦), kilitli ise gri (⚪)
    } else if (item.type === 'mascot') {
      color = stepType === 'default' ? '🎭' : '⚪'; // Unlock ise normal (🎭), kilitli ise gri (⚪)
    }
    
    console.log(
      `${color} [${index + 1}/${items.length}] ${item.type} | Order: ${item.order} | ${itemTitle}`,
      `\n   isCompleted: ${item.isCompleted}`,
      `| previousStepsCompleted (BEFORE): ${prevStepsCompletedBefore}`,
      `| isUnlocked: ${isUnlocked}`,
      `| stepType: ${stepType}`,
      (item.type === 'lesson_step' || item.type === 'exercise_step' || item.type === 'trophy') ? `| isActive: ${isActive}` : ''
    );

    return {
      ...item,
      isUnlocked,
      stepType,
      isActive,
    };
  });

  console.log('🔍 ===========================================\n');
  return result;
};

export const createPathItems = (
  levels: Level[],
  screenWidth: number,
  gridPadding: number,
): PathItem[] => {
  if (!levels.length) {
    return [];
  }

  const completedLessons = collectCompletedLessons(levels);
  const completedExams = collectCompletedExams(levels);
  const units = getSortedUnits(levels);

  const items: PathItem[] = [];
  let verticalCursor = 0;
  let zigZagIndex = 0;
  let sequenceOrder = 1;

  units.forEach(unit => {
    const lessons = (unit.lessons || []).slice().sort((a, b) => a.order - b.order);
    const exams = (unit.exams || []).slice().sort((a, b) => a.order - b.order);
    
    // Max lesson order'ı bul (exam'ler için unit sonu hesaplaması için)
    const maxLessonOrder = lessons.length > 0 ? Math.max(...lessons.map(l => l.order)) : 0;
    
    // Birleştir ve lessonId'ye göre sırala: lessons ve exams
    type UnitItem = { type: 'lesson' | 'exam'; sortOrder: number; data: Lesson | Exam };
    const unitItems: UnitItem[] = [
      ...lessons.map(lesson => ({ 
        type: 'lesson' as const, 
        sortOrder: lesson.order * 10000, // Lesson'lar: 10000, 20000, 30000...
        data: lesson 
      })),
      ...exams.map(exam => {
        if (exam.lessonId) {
          // Exam bir derse bağlıysa, o dersin order'ından sonra
          const lesson = lessons.find(l => l.id === exam.lessonId);
          const lessonOrder = lesson ? lesson.order : maxLessonOrder;
          return {
            type: 'exam' as const,
            sortOrder: lessonOrder * 10000 + 5000 + exam.order, // Ders sonrası: 15001, 15002...
            data: exam
          };
        } else {
          // Exam unit sonunda
          return {
            type: 'exam' as const,
            sortOrder: maxLessonOrder * 10000 + 100000 + exam.order, // Unit sonu: 100001, 100002...
            data: exam
          };
        }
      }),
    ].sort((a, b) => a.sortOrder - b.sortOrder);

    if (unitItems.length === 0) {
      return;
    }

    unitItems.forEach(item => {
      if (item.type === 'lesson') {
        const lesson = item.data as Lesson;
        const lessonCompleted = completedLessons.has(lesson.id);
        const lessonLeft = getZigZagPosition(
          zigZagIndex++,
          screenWidth,
          gridPadding,
        );

        // Determine step type based on completion and unlock status
        // This will be set correctly after all items are created and unlock logic is applied
        items.push({
          id: `lesson-${lesson.id}`,
          type: 'lesson_step',
          lessonId: lesson.id,
          unitId: unit.id,
          stepType: 'default', // Will be updated based on isCompleted and isUnlocked
          icon: (lesson.iconType as StepIcon) || 'star',
          position: {
            top: verticalCursor,
            left: lessonLeft,
            size: STEP_SIZE,
          },
          order: sequenceOrder++,
          isUnlocked: false, // Will be set by applySequentialUnlocks
          isCompleted: lessonCompleted,
          metadata: {
            title: getLessonTitle(lesson, `Lesson ${lesson.order}`),
            lessonNumber: lesson.order,
          },
        });

        verticalCursor += STEP_VERTICAL_GAP;

        const exercises = (lesson.exercises || [])
          .slice()
          .sort((a, b) => a.order - b.order);

        exercises.forEach(exercise => {
          const exerciseLeft = getZigZagPosition(
            zigZagIndex++,
            screenWidth,
            gridPadding,
          );
          const exerciseCompleted = lessonCompleted;

          items.push({
            id: `exercise-${exercise.id}`,
            type: 'exercise_step',
            exerciseId: exercise.id,
            lessonId: lesson.id,
            unitId: unit.id,
            stepType: 'default', // Will be updated based on isCompleted and isUnlocked
            icon: getExerciseIcon(exercise.type),
            position: {
              top: verticalCursor,
              left: exerciseLeft,
              size: STEP_SIZE,
            },
            order: sequenceOrder++,
            isUnlocked: false, // Will be set by applySequentialUnlocks
            isCompleted: exerciseCompleted,
            metadata: {},
          });

          verticalCursor += STEP_VERTICAL_GAP;
        });
      } else if (item.type === 'exam') {
        const exam = item.data as Exam;
        const examLeft = getZigZagPosition(
          zigZagIndex++,
          screenWidth,
          gridPadding,
        );

        // Exam için trophy tipi kullan
        const examCompleted = completedExams.has(exam.id);
        items.push({
          id: `exam-${exam.id}`,
          type: 'trophy',
          unitId: unit.id,
          stepType: 'default', // Will be updated based on isCompleted and isUnlocked
          trophyNumber: exam.order,
          position: {
            top: verticalCursor,
            left: examLeft,
            size: STEP_SIZE,
          },
          order: sequenceOrder++,
          isUnlocked: false, // Will be set by applySequentialUnlocks
          isCompleted: examCompleted,
          metadata: {
            title: exam.translations?.[0]?.title || `Exam ${exam.order}`,
          },
        });

        verticalCursor += STEP_VERTICAL_GAP;
      }
    });

    const unitCompleted = lessons.every(lesson =>
      completedLessons.has(lesson.id),
    );
    const unitCardTop = verticalCursor + STEP_VERTICAL_GAP / 2;

    items.push({
      id: `unit-${unit.id}`,
      type: 'unit_card',
      unitId: unit.id,
      position: {
        top: unitCardTop,
        left: screenWidth / 2,
      },
      order: sequenceOrder++,
      isUnlocked: true,
      isCompleted: unitCompleted,
      metadata: {
        backgroundColor: getUnitColor(unit.order),
        title: unit.translations?.[0]?.title || `Unit ${unit.order}`,
        lessonNumber: unit.order,
      },
    });

    verticalCursor = unitCardTop + UNIT_SECTION_GAP;
  });

  const normalized = normalizePositions(items);
  return applySequentialUnlocks(normalized);
};

