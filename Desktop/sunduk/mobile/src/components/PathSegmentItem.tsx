import React from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import InfinitePathSegment, { SEGMENT_HEIGHT, getRoadPoint } from './InfinitePathSegment';
import LessonMilestone, { getPlaceName } from './LessonMilestone';
import WalkingMascot from './WalkingMascot';
import { useTheme } from '../theme/useTheme';

export type UnitStatus = 'completed' | 'current' | 'locked';

export interface JourneyUnit {
  unit: { id: string; translations?: Array<{ title: string }> };
  status: UnitStatus;
}

interface PathSegmentItemProps {
  item: JourneyUnit;
  index: number;
  totalCount: number;
  isCurrent: boolean;
  onPress: () => void;
}

export const getEnterX = (index: number, width: number) => {
  if (index === 0) return width / 2;
  return getExitX(index - 1, width);
};

export const getExitX = (index: number, width: number) => {
  return index % 2 === 0 ? width * 0.4 : width * 0.6;
};

const PathSegmentItem: React.FC<PathSegmentItemProps> = ({
  item,
  index,
  totalCount,
  isCurrent,
  onPress,
}) => {
  const { width } = useWindowDimensions();
  const theme = useTheme();

  const enterX = getEnterX(index, width);
  const exitX = getExitX(index, width);

  const roadMid = getRoadPoint(0.5, enterX, exitX);
  const iconX = roadMid.x - 60;
  const iconY = roadMid.y - 50;

  const isLocked = item.status === 'locked';
  const showPlayIcon = item.status === 'current';

  const title = item.unit.translations?.[0]?.title || getPlaceName(index);

  return (
    <View style={[styles.container, { width, height: SEGMENT_HEIGHT }]}>
      <InfinitePathSegment
        width={width}
        enterX={enterX}
        exitX={exitX}
        segmentIndex={index}
      />

      <Pressable
        style={[
          styles.iconTouch,
          {
            left: iconX,
            top: iconY,
            opacity: isLocked ? 0.5 : 1,
          },
        ]}
        onPress={onPress}
        disabled={isLocked}
      >
        <LessonMilestone
          unitIndex={index}
          status={item.status}
          size={64}
          showPlayIcon={showPlayIcon}
        />
      </Pressable>

      <View style={[styles.labelWrapper, { left: iconX - 10, top: iconY + 75 }]}>
        <Text
          style={[
            styles.label,
            {
              color: '#FFFFFF',
              fontFamily: theme.typography.fontFamily.bold,
              textShadowColor: 'rgba(0,0,0,0.6)',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 3,
            },
          ]}
          numberOfLines={2}
        >
          {title}
        </Text>
      </View>

      {isCurrent && (
        <View
          pointerEvents="none"
          style={[
            styles.mascotWrapper,
            { left: iconX - 50, top: iconY - 30 },
          ]}
        >
          <WalkingMascot size={120} walking />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'visible',
  },
  iconTouch: {
    position: 'absolute',
    width: 120,
    alignItems: 'center',
    zIndex: 10,
  },
  labelWrapper: {
    position: 'absolute',
    width: 140,
    alignItems: 'center',
    zIndex: 10,
  },
  label: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '700',
  },
  mascotWrapper: {
    position: 'absolute',
    zIndex: 50,
  },
});

export default PathSegmentItem;
export { SEGMENT_HEIGHT };
