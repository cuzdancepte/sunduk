import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  Alert,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/useTheme';
import { contentAPI } from '../services/api';
import { Level, Unit } from '../types';
import { LoadingSpinner, EmptyState } from '../components/ui';
import TopBar from '../components/TopBar';
import PathSegmentItem, {
  SEGMENT_HEIGHT,
  getEnterX,
  getExitX,
} from '../components/PathSegmentItem';
import InfinitePathSegment from '../components/InfinitePathSegment';
import NatureBackground from '../components/NatureBackground';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

type UnitStatus = 'completed' | 'current' | 'locked';

interface JourneyUnit {
  unit: Unit;
  status: UnitStatus;
}

const getSortedUnits = (levels: Level[]): Unit[] => {
  return levels
    .slice()
    .sort((a, b) => a.order - b.order)
    .flatMap(level =>
      (level.units || []).slice().sort((a, b) => a.order - b.order),
    );
};

const isUnitCompleted = (unit: Unit): boolean => {
  const lessons = unit.lessons || [];
  return lessons.length > 0 && lessons.every(l => l.completion?.completed);
};

const createJourneyStops = (levels: Level[]): JourneyUnit[] => {
  const units = getSortedUnits(levels);
  let foundCurrent = false;

  return units.map(unit => {
    const completed = isUnitCompleted(unit);
    if (completed) {
      return { unit, status: 'completed' as UnitStatus };
    }
    if (!foundCurrent) {
      foundCurrent = true;
      return { unit, status: 'current' as UnitStatus };
    }
    return { unit, status: 'locked' as UnitStatus };
  });
};

const FADE_COUNT = 3;

const FadingRoad: React.FC<{
  startIndex: number;
  count: number;
  width: number;
  direction: 'up' | 'down';
}> = React.memo(({ startIndex, count, width, direction }) => {
  const segments = [];
  for (let i = 0; i < count; i++) {
    const idx = startIndex + (direction === 'up' ? i : -(i + 1));
    const enterX = getEnterX(Math.abs(idx) % 1000, width);
    const exitX = getExitX(Math.abs(idx) % 1000, width);
    const opacity = Math.max(0.15, 1 - (i + 1) * 0.3);
    segments.push(
      <View key={i} style={{ width, height: SEGMENT_HEIGHT, opacity }}>
        <InfinitePathSegment
          width={width}
          enterX={idx >= 0 ? enterX : exitX}
          exitX={idx >= 0 ? exitX : enterX}
          segmentIndex={2000 + Math.abs(idx)}
        />
      </View>,
    );
  }
  return <>{segments}</>;
});

const HomeScreen = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);

  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const journeyStops = createJourneyStops(levels);
  const totalCount = journeyStops.length;
  const contentHeight = (totalCount + FADE_COUNT * 2 + 2) * SEGMENT_HEIGHT;
  const currentIndex = journeyStops.findIndex(s => s.status === 'current');
  const allCompleted = totalCount > 0 && journeyStops.every(s => s.status === 'completed');

  useEffect(() => {
    if (totalCount === 0 || currentIndex < 0 || !flatListRef.current) return;
    const offset = currentIndex * SEGMENT_HEIGHT;
    setTimeout(() => {
      flatListRef.current?.scrollToOffset({ offset, animated: false });
    }, 250);
  }, [totalCount, currentIndex]);

  const handleUnitPress = useCallback(
    (stop: JourneyUnit) => {
      if (stop.status === 'locked') return;
      navigation.navigate('App', {
        screen: 'UnitDetail',
        params: { unitId: stop.unit.id },
      });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: JourneyUnit; index: number }) => (
      <PathSegmentItem
        item={item}
        index={index}
        totalCount={totalCount}
        isCurrent={index === currentIndex}
        onPress={() => handleUnitPress(item)}
      />
    ),
    [totalCount, currentIndex, handleUnitPress],
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: SEGMENT_HEIGHT,
      offset: SEGMENT_HEIGHT * index,
      index,
    }),
    [],
  );

  const keyExtractor = useCallback((item: JourneyUnit) => item.unit.id, []);

  const topFade = useMemo(
    () =>
      totalCount > 0 ? (
        <FadingRoad
          startIndex={totalCount}
          count={FADE_COUNT}
          width={width}
          direction="up"
        />
      ) : null,
    [totalCount, width],
  );

  const bottomFade = null;

  if (loading && totalCount === 0) {
    return <LoadingSpinner fullScreen text={t('common.loading')} />;
  }

  if (error || totalCount === 0) {
    return (
      <View style={[styles.container, { backgroundColor: '#706898' }]}>
        <View style={[styles.topBarContainer, { paddingTop: insets.top }]}>
          <TopBar
            width={screenWidth}
            height={48}
            language={{ code: 'EN' }}
            challengeCount={4}
            diamondCount={957}
          />
        </View>
        <View style={styles.emptyContainer}>
          <EmptyState
            title={t('home.title')}
            description={error || t('home.emptyDescription')}
          />
        </View>
      </View>
    );
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

      <View style={styles.listContainer}>
        <View style={[styles.backgroundWrapper, { height: contentHeight }]}>
          <NatureBackground width={width} height={contentHeight} />
        </View>

        <FlatList
          ref={flatListRef}
          data={journeyStops}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          inverted
          removeClippedSubviews={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          style={styles.flatList}
          ListFooterComponent={topFade}
          ListHeaderComponent={bottomFade}
        />

        {allCompleted && (
          <View style={styles.completionBadge}>
            <Ionicons name="trophy" size={64} color="#FFD700" />
            <Text
              style={[
                styles.completionTitle,
                {
                  color: theme.colors.text.primary,
                  fontFamily: theme.typography.fontFamily.bold,
                },
              ]}
            >
              {t('home.congratulations')}
            </Text>
            <Text
              style={[
                styles.completionText,
                {
                  color: theme.colors.text.secondary,
                  fontFamily: theme.typography.fontFamily.regular,
                },
              ]}
            >
              {t('home.allUnitsCompleted')}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#706898',
  },
  topBarContainer: {
    backgroundColor: '#8878a0',
    zIndex: 100,
  },
  listContainer: {
    flex: 1,
    position: 'relative',
  },
  backgroundWrapper: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    zIndex: 0,
  },
  flatList: {
    flex: 1,
    zIndex: 1,
  },
  listContent: {
    overflow: 'visible',
  },
  completionBadge: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 12,
    padding: 24,
    marginHorizontal: 24,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  completionTitle: {
    fontSize: 24,
  },
  completionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
