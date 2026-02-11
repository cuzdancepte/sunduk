import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import Svg, { Ellipse } from 'react-native-svg';

interface FloatingCloudProps {
  startX: number;
  endX: number;
  y: number;
  duration?: number;
  delay?: number;
  scale?: number;
}

const FloatingCloud: React.FC<FloatingCloudProps> = ({
  startX,
  endX,
  y,
  duration = 25000,
  delay = 0,
  scale = 1,
}) => {
  const translateX = useRef(new Animated.Value(startX)).current;

  useEffect(() => {
    const animate = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
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
    );
    animate.start();
    return () => animate.stop();
  }, [delay, duration, endX, startX, translateX]);

  const cloudW = 80 * scale;
  const cloudH = 36 * scale;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          left: 0,
          top: y,
          transform: [{ translateX }],
        },
      ]}
    >
      <Svg width={cloudW} height={cloudH} viewBox="0 0 80 36" fill="none">
        <Ellipse cx="20" cy="24" rx="18" ry="10" fill="rgba(255,255,255,0.85)" />
        <Ellipse cx="44" cy="20" rx="24" ry="12" fill="rgba(255,255,255,0.9)" />
        <Ellipse cx="62" cy="24" rx="16" ry="9" fill="rgba(255,255,255,0.85)" />
      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 10,
  },
});

export default FloatingCloud;
