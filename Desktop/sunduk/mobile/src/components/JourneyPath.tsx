import React from 'react';
import { StyleSheet } from 'react-native';
import Svg from 'react-native-svg';
import VillagePathSegment from './VillagePathSegment';

type GetPositionFn = (index: number) => { x: number; y: number };

interface JourneyPathProps {
  stopCount: number;
  getPosition: GetPositionFn;
  width: number;
  height: number;
  isDarkMode?: boolean;
}

const JourneyPath: React.FC<JourneyPathProps> = ({
  stopCount,
  getPosition,
  width,
  height,
  isDarkMode = false,
}) => {
  if (stopCount < 2) return null;

  const segments: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
  for (let i = 0; i < stopCount - 1; i++) {
    const from = getPosition(i);
    const to = getPosition(i + 1);
    segments.push({
      x1: from.x,
      y1: from.y,
      x2: to.x,
      y2: to.y,
    });
  }

  return (
    <Svg
      style={[StyleSheet.absoluteFill, { width, height }]}
      width={width}
      height={height}
      pointerEvents="none"
    >
      {segments.map((seg, index) => (
        <VillagePathSegment
          key={`path-${index}`}
          x1={seg.x1}
          y1={seg.y1}
          x2={seg.x2}
          y2={seg.y2}
          index={index}
          isDarkMode={isDarkMode}
        />
      ))}
    </Svg>
  );
};

export default JourneyPath;
