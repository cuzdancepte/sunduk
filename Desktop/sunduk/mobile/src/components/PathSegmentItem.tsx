import React from 'react';
import { View, Text, Image, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { SEGMENT_HEIGHT } from './InfinitePathSegment';
import LessonMilestone, { getPlaceName } from './LessonMilestone';
import WalkingMascot from './WalkingMascot';
import { useTheme } from '../theme/useTheme';
import { ROAD_TILE_HEIGHT } from './NatureBackground';

const roadImage = require('../../assets/images/yol_vector.png');

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

export const getEnterX = (_index: number, width: number) => width / 2;
export const getExitX = (_index: number, width: number) => width / 2;

const PathSegmentItem: React.FC<PathSegmentItemProps> = ({
  item,
  index,
  totalCount,
  isCurrent,
  onPress,
}) => {
  const { width } = useWindowDimensions();
  const theme = useTheme();

  // Yol ortadan geçiyor; ikonlar sağa ve sola dönüşümlü yerleşiyor
  const isRight = index % 2 === 0;
  const iconX = isRight ? width * 0.62 - 32 : width * 0.18 - 32;
  const iconY = SEGMENT_HEIGHT / 2 - 32;

  const isLocked = item.status === 'locked';
  const showPlayIcon = item.status === 'current';

  const title = item.unit.translations?.[0]?.title || getPlaceName(index);

  // Inverted FlatList: yüksek index yukarıda, yol aşağı doğru ilerlemeli
  const roadStartY = (((- index * SEGMENT_HEIGHT) % ROAD_TILE_HEIGHT) + ROAD_TILE_HEIGHT) % ROAD_TILE_HEIGHT;
  const roadOffsetY = -roadStartY;
  const needsSecondTile = roadStartY + SEGMENT_HEIGHT > ROAD_TILE_HEIGHT;

  return (
    <View style={[styles.container, { width, height: SEGMENT_HEIGHT }]}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#7DC95E' }]} />
        <Image
          source={roadImage}
          style={{
            position: 'absolute',
            top: roadOffsetY,
            width,
            height: ROAD_TILE_HEIGHT,
          }}
          resizeMode="contain"
        />
        {needsSecondTile && (
          <Image
            source={roadImage}
            style={{
              position: 'absolute',
              top: roadOffsetY + ROAD_TILE_HEIGHT,
              width,
              height: ROAD_TILE_HEIGHT,
            }}
            resizeMode="contain"
          />
        )}
      </View>
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

      <View style={[styles.labelWrapper, { left: iconX - 14, top: iconY + 72 }]}>
        <Text
          style={[
            styles.label,
            {
              color: '#333333',
              fontFamily: theme.typography.fontFamily.bold,
              textShadowColor: 'rgba(255,255,255,0.8)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 2,
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
            { left: iconX - 44, top: iconY - 36 },
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
    overflow: 'hidden',
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
