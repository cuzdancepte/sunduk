import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Line } from 'react-native-svg';
import { contentAPI } from '../services/api';
import { Level } from '../types';
import { useTheme } from '../theme/useTheme';
import { LoadingSpinner } from '../components/ui';
import TopBar from '../components/TopBar';
import LessonCard from '../components/LessonCard';
import LevelStep from '../components/LevelStep';
import Mascot from '../components/Mascot';
import Trophy from '../components/Trophy';
import { createPathItems, PathItem } from '../utils/learningPathUtils';

const INITIAL_SCROLL_DELAY = 200;
const CONTENT_EXTRA_HEIGHT = 64;

const HomeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const scrollViewRef = useRef<ScrollView>(null);
  const gridPadding = theme.grid.padding.horizontal;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const levelsData = await contentAPI.getLevels();
        setLevels(levelsData);
      } catch (err: any) {
        const message = err.response?.data?.error || 'Veriler yüklenemedi';
        setError(message);
        Alert.alert('Hata', message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const pathItems = useMemo(() => {
    if (!levels.length) {
      return [];
    }

    return createPathItems(levels, screenWidth, gridPadding);
  }, [levels, screenWidth, gridPadding]);

  useEffect(() => {
    if (pathItems.length === 0) {
      return;
    }

    const timeoutId = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: false });
    }, INITIAL_SCROLL_DELAY);

    return () => clearTimeout(timeoutId);
  }, [pathItems.length]);

  const contentHeight = useMemo(() => {
    if (pathItems.length === 0) {
      return screenHeight;
    }

    const maxBottom = Math.max(
      ...pathItems.map(item => item.position.top + (item.position.size || 0)),
    );

    return Math.max(maxBottom + CONTENT_EXTRA_HEIGHT, screenHeight);
  }, [pathItems, screenHeight]);

  const lines = useMemo(() => {
    const stepItems = pathItems.filter(
      item => item.type === 'lesson_step' || item.type === 'exercise_step',
    );

    if (stepItems.length < 2) {
      return [];
    }

    return stepItems.slice(0, -1).map((current, index) => {
      const next = stepItems[index + 1];
      const currentY =
        current.position.top + (current.position.size || 0) / 2;
      const nextY = next.position.top + (next.position.size || 0) / 2;

      return {
        x1: current.position.left,
        y1: currentY,
        x2: next.position.left,
        y2: nextY,
      };
    });
  }, [pathItems]);

  const handlePathItemPress = useCallback(
    (item: PathItem) => {
      if (!item.isUnlocked) {
        Alert.alert('Kilitli', 'Önceki adımları tamamlamanız gerekiyor.');
        return;
      }

      if (item.type === 'unit_card' && item.unitId) {
        navigation.navigate('App', {
          screen: 'UnitDetail',
          params: { unitId: item.unitId },
        });
        return;
      }

      if (
        (item.type === 'lesson_step' || item.type === 'exercise_step') &&
        item.lessonId
      ) {
        navigation.navigate('App', {
          screen: 'Lesson',
          params: { lessonId: item.lessonId },
        });
      }
    },
    [navigation],
  );

  const renderPathItem = useCallback(
    (item: PathItem) => {
      const { position, stepType, icon, metadata } = item;

      switch (item.type) {
        case 'unit_card':
          return (
            <View
              key={item.id}
              style={[
                styles.unitCardWrapper,
                {
                  top: position.top,
                  left: -gridPadding,
                  width: screenWidth + gridPadding * 2,
                },
              ]}
            >
              <LessonCard
                lessonNumber={metadata?.lessonNumber || 0}
                title={metadata?.title || ''}
                backgroundColor={metadata?.backgroundColor || '#6949FF'}
                fullWidth
                onPress={() => handlePathItemPress(item)}
              />
            </View>
          );

        case 'lesson_step':
        case 'exercise_step':
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.stepWrapper,
                {
                  top: position.top,
                  left: position.left - (position.size || 0) / 2,
                },
              ]}
              onPress={() => handlePathItemPress(item)}
              disabled={!item.isUnlocked}
              activeOpacity={item.isUnlocked ? 0.7 : 1}
            >
              <LevelStep
                type={stepType || (item.isUnlocked ? 'default' : 'lock')}
                icon={icon || 'star'}
                size={position.size || 0}
              />
            </TouchableOpacity>
          );

        case 'mascot':
          return (
            <View
              key={item.id}
              style={[
                styles.mascotWrapper,
                {
                  top: position.top,
                  left: position.left - (position.size || 0) / 2,
                },
              ]}
            >
              <Mascot type={item.mascotType || 'default'} size={position.size || 0} />
            </View>
          );

        case 'trophy':
          return (
            <View
              key={item.id}
              style={[
                styles.trophyWrapper,
                {
                  top: position.top,
                  left: position.left - 64,
                },
              ]}
            >
              <Trophy number={item.trophyNumber || 0} active={item.isCompleted} size={128} />
            </View>
          );

        default:
          return null;
      }
    },
    [handlePathItemPress, gridPadding, screenWidth],
  );

  if (loading && pathItems.length === 0) {
    return <LoadingSpinner fullScreen text="Yükleniyor..." />;
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.primary.main}
        translucent={false}
      />

      <View style={[styles.topBarContainer, { paddingTop: insets.top }]}>
        <TopBar
          width={screenWidth}
          height={48}
          language={{ code: 'EN' }}
          challengeCount={4}
          diamondCount={957}
        />
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            minHeight: contentHeight,
            paddingTop: 24,
            paddingBottom: CONTENT_EXTRA_HEIGHT,
          },
        ]}
        showsVerticalScrollIndicator
      >
        <View
          style={[
            styles.contentContainer,
            {
              width: screenWidth,
              minHeight: contentHeight,
              paddingHorizontal: gridPadding,
            },
          ]}
        >
          {lines.length > 0 && (
            <Svg
              style={StyleSheet.absoluteFill}
              width={screenWidth}
              height={contentHeight}
            >
              {lines.map((line, index) => (
                <Line
                  key={`line-${index}`}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke={theme.pathStyles.default.strokeColor}
                  strokeWidth={theme.pathStyles.default.strokeWidth}
                  strokeDasharray={theme.pathStyles.default.strokeDasharray.join(' ')}
                  opacity={theme.pathStyles.default.opacity}
                />
              ))}
            </Svg>
          )}

          {pathItems.map(renderPathItem)}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBarContainer: {
    backgroundColor: '#6949FF',
    zIndex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {},
  contentContainer: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
  },
  unitCardWrapper: {
    position: 'absolute',
    width: '100%',
  },
  stepWrapper: {
    position: 'absolute',
  },
  mascotWrapper: {
    position: 'absolute',
  },
  trophyWrapper: {
    position: 'absolute',
  },
});

export default HomeScreen;
