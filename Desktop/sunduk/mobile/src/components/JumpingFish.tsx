import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Svg, { Ellipse, Path } from 'react-native-svg';

interface JumpingFishProps {
  pondX: number;
  pondY: number;
  pondW: number;
  pondH: number;
  offsetX?: number;
  offsetY?: number;
  delay?: number;
  size?: number;
}

const JumpingFish: React.FC<JumpingFishProps> = ({
  pondX,
  pondY,
  pondW,
  pondH,
  offsetX = 0,
  offsetY = 0,
  delay = 0,
  size = 21,
}) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const jumpUp = Animated.timing(translateY, {
      toValue: -20,
      duration: 320,
      useNativeDriver: true,
    });
    const fallDown = Animated.timing(translateY, {
      toValue: 0,
      duration: 260,
      useNativeDriver: true,
    });
    const tiltUp = Animated.timing(rotate, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    });
    const tiltDown = Animated.timing(rotate, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    });

    const jumpSequence = Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([jumpUp, tiltUp]),
      Animated.parallel([fallDown, tiltDown]),
    ]);

    const pauseTime = 1000 + (Math.abs(delay) % 600);
    const loopAnimation = Animated.loop(
      Animated.sequence([
        jumpSequence,
        Animated.delay(pauseTime),
      ])
    );

    loopAnimation.start();

    return () => loopAnimation.stop();
  }, [delay, translateY, rotate]);

  const rotation = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-28deg'],
  });

  const waterSurfaceY = pondY + pondH * 0.35;
  const clipHeight = 40;
  const containerTop = waterSurfaceY - clipHeight;
  const fishRestTop = clipHeight - 6;
  const centerX = pondX + pondW / 2 - size / 2 + offsetX;

  return (
    <View
      style={[
        styles.clipContainer,
        {
          left: centerX,
          top: containerTop,
          width: size,
          height: clipHeight,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.fishInner,
          {
            top: fishRestTop,
            width: size,
            height: size,
            transform: [
              { translateY },
              { rotate: rotation },
            ],
          },
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 20 12" fill="none">
          <Ellipse cx="10" cy="6" rx="8" ry="4" fill="#FF6B35" />
          <Path d="M 2 4 L 0 6 L 2 8 Z" fill="#E55A2B" />
          <Ellipse cx="14" cy="5" rx="1.5" ry="1" fill="#2C1810" />
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  clipContainer: {
    position: 'absolute',
    zIndex: 2,
    overflow: 'hidden',
  },
  fishInner: {
    position: 'absolute',
    left: 0,
  },
});

export default JumpingFish;
