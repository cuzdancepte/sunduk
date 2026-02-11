import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import Svg, { Ellipse, Path } from 'react-native-svg';

interface RunningCatProps {
  startX?: number;
  endX?: number;
  startY?: number;
  duration?: number;
  delay?: number;
  size?: number;
  direction?: 'left' | 'right';
}

const RunningCat: React.FC<RunningCatProps> = ({
  startX = -40,
  endX = 400,
  startY = 200,
  duration = 25000,
  delay = 0,
  size = 32,
  direction = 'right',
}) => {
  const translateX = useRef(new Animated.Value(startX)).current;
  const runAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const runCycle = Animated.loop(
      Animated.sequence([
        Animated.timing(runAnim, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(runAnim, {
          toValue: 0,
          duration: 120,
          useNativeDriver: true,
        }),
      ])
    );

    const walkAnimation = Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.loop(
          Animated.sequence([
            Animated.timing(translateX, {
              toValue: endX,
              duration: duration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(translateX, {
              toValue: startX,
              duration: duration / 2,
              useNativeDriver: true,
            }),
          ])
        ),
        runCycle,
      ]),
    ]);

    walkAnimation.start();

    return () => {
      runCycle.stop();
      walkAnimation.stop();
    };
  }, [delay, duration, endX, startX, runAnim, translateX]);

  const bounceY = runAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -6],
  });

  const bodyColor = '#D4A574';
  const earColor = '#8B6914';
  const stripeColor = '#A07850';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateX },
            { translateY: startY },
            { translateY: bounceY },
          ],
        },
      ]}
    >
      <Svg width={size} height={size * 1.2} viewBox="0 0 24 29" fill="none">
        {/* Kulaklar - üçgen */}
        <Path d="M 8 6 L 5 14 L 11 10 Z" fill={earColor} />
        <Path d="M 16 6 L 19 14 L 13 10 Z" fill={earColor} />
        {/* Kafa */}
        <Ellipse cx="12" cy="13" rx="8" ry="7" fill={bodyColor} />
        {/* Gövde */}
        <Ellipse cx="12" cy="23" rx="6" ry="5" fill={bodyColor} />
        {/* Gözler - badem şekli */}
        <Path d="M 9 11 L 11 13 L 9 15 Z" fill="#2C1810" />
        <Path d="M 15 11 L 13 13 L 15 15 Z" fill="#2C1810" />
        {/* Burun */}
        <Path d="M 12 15 L 11 17 L 13 17 Z" fill="#E67E6B" />
        {/* Bıyıklar */}
        <Path d="M 5 14 L 8 14" stroke="#5C4033" strokeWidth="0.4" opacity={0.9} />
        <Path d="M 16 14 L 19 14" stroke="#5C4033" strokeWidth="0.4" opacity={0.9} />
        <Path d="M 4 16 L 7 15" stroke="#5C4033" strokeWidth="0.4" opacity={0.9} />
        <Path d="M 20 16 L 17 15" stroke="#5C4033" strokeWidth="0.4" opacity={0.9} />
      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 2,
  },
});

export default RunningCat;
