import { Level, Unit, Lesson, Exercise } from '../types';

export type PathItemType =
  | 'unit_card'
  | 'lesson_step'
  | 'exercise_step'
  | 'mascot'
  | 'trophy';
export type StepType = 'pass' | 'lock' | 'default' | 'exam';
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

  return items.map(item => {
    // Unlock logic: item is unlocked if previous steps are completed OR this item is already completed
    const isUnlocked = previousStepsCompleted || item.isCompleted;
    
    // Update previousStepsCompleted: if current item is not completed, mark as false
    if (!item.isCompleted) {
      previousStepsCompleted = false;
    }

    // Determine stepType based on completion and unlock status
    let stepType: 'pass' | 'lock' | 'default' | 'exam' = 'default';
    if (item.type === 'lesson_step' || item.type === 'exercise_step') {
      if (item.isCompleted) {
        stepType = 'pass'; // Tamamlanmış: sarı (biten.svg)
      } else if (isUnlocked) {
        stepType = 'default'; // Üzerinde çalışılan: mavi/mor (mevcut.svg)
      } else {
        stepType = 'lock'; // Sırası gelmemiş: gri (baslamayan.svg)
      }
    } else if (item.type === 'trophy') {
      stepType = 'exam'; // Trophy için exam type kullanılıyor
    }

    return {
      ...item,
      isUnlocked,
      stepType,
    };
  });
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
  const units = getSortedUnits(levels);

  const items: PathItem[] = [];
  let verticalCursor = 0;
  let zigZagIndex = 0;
  let sequenceOrder = 1;

  units.forEach(unit => {
    const lessons = (unit.lessons || []).slice().sort((a, b) => a.order - b.order);
    if (lessons.length === 0) {
      return;
    }

    lessons.forEach(lesson => {
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

