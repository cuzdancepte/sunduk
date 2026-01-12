import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useThemeContext } from '../theme/useTheme';

interface FlyingBirdProps {
  startX?: number;
  endX?: number;
  startY?: number;
  duration?: number;
  delay?: number;
  size?: number;
  direction?: 'left' | 'right';
}

const FlyingBird: React.FC<FlyingBirdProps> = ({
  startX = -50,
  endX = 400,
  startY = 100,
  duration = 3000,
  delay = 0,
  size = 40,
  direction = 'right',
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const { isDarkMode } = useThemeContext();
  const translateX = useRef(new Animated.Value(startX)).current;
  const translateY = useRef(new Animated.Value(startY)).current;
  const wingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const wingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(wingAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(wingAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ])
    );

    const flightAnimation = Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: endX,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(translateY, {
              toValue: startY + 10,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: startY - 10,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        ),
      ]),
    ]);

    wingAnimation.start();
    flightAnimation.start();

    return () => {
      wingAnimation.stop();
      flightAnimation.stop();
    };
  }, [delay, duration, endX, startX, startY, translateX, translateY, wingAnim]);

  const wingRotation = wingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: direction === 'right' ? ['-30deg', '30deg'] : ['30deg', '-30deg'],
  });

  // Gece modunda açık renkler, gündüz modunda koyu renkler
  const birdColor = isDarkMode ? '#FFFFFF' : '#666666';
  const wingColor = isDarkMode ? '#E8E8E8' : '#444444';
  const beakColor = '#FFA500';

  // Daha gerçekçi martı şekli - tüm parçalar
  const bodyPath = direction === 'right'
    ? "M 12,14 C 10,14 9,13 9,12 C 9,11 10,10 12,10 C 14,10 15,11 15,12 C 15,13 14,14 12,14 Z"
    : "M 12,14 C 14,14 15,13 15,12 C 15,11 14,10 12,10 C 10,10 9,11 9,12 C 9,13 10,14 12,14 Z";

  const upperWingPath = direction === 'right'
    ? "M 10,11 C 7,9 4,10 3,11 C 2,12 3,11 5,11 C 7,11 9,11 10,11 Z"
    : "M 14,11 C 17,9 20,10 21,11 C 22,12 21,11 19,11 C 17,11 15,11 14,11 Z";

  const lowerWingPath = direction === 'right'
    ? "M 10,13 C 7,15 4,17 3,18 C 2,19 3,17 5,15 C 7,13 9,13 10,13 Z"
    : "M 14,13 C 17,15 20,17 21,18 C 22,19 21,17 19,15 C 17,13 15,13 14,13 Z";

  const tailPath = direction === 'right'
    ? "M 12,14 L 8,18 L 10,16 L 12,15 L 14,16 L 16,18 L 12,14 Z"
    : "M 12,14 L 16,18 L 14,16 L 12,15 L 10,16 L 8,18 L 12,14 Z";

  const beakPath = direction === 'right'
    ? "M 15,12 L 18,12 L 16.5,13 L 15,12 Z"
    : "M 9,12 L 6,12 L 7.5,13 L 9,12 Z";

  const eyePath = direction === 'right'
    ? "M 13.5,11 A 1,1 0 0 1 14.5,12 A 1,1 0 0 1 13.5,13"
    : "M 10.5,11 A 1,1 0 0 1 9.5,12 A 1,1 0 0 1 10.5,13";

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateX },
            { translateY },
          ],
        },
      ]}
    >
      <Svg width={size} height={size} viewBox="0 0 24 24">
        {/* Kuyruk */}
        <Path d={tailPath} fill={birdColor} opacity={0.7} />
        {/* Gövde */}
        <Path d={bodyPath} fill={birdColor} opacity={0.8} />
        {/* Üst kanat */}
        <Path d={upperWingPath} fill={wingColor} opacity={0.7} />
        {/* Alt kanat - animasyonlu */}
        <Animated.View
          style={{
            position: 'absolute',
            width: size,
            height: size,
            transform: [{ rotate: wingRotation }],
          }}
        >
          <Svg width={size} height={size} viewBox="0 0 24 24">
            <Path d={lowerWingPath} fill={wingColor} opacity={0.8} />
          </Svg>
        </Animated.View>
        {/* Gaga */}
        <Path d={beakPath} fill={beakColor} opacity={0.9} />
        {/* Göz */}
        <Path d={eyePath} fill="#000000" opacity={0.9} />
      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1,
  },
});

export default FlyingBird;
