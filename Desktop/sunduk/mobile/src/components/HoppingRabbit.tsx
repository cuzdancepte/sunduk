import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import Svg, { Ellipse, Path } from 'react-native-svg';

interface HoppingRabbitProps {
  startX?: number;
  endX?: number;
  startY?: number;
  duration?: number;
  delay?: number;
  size?: number;
  direction?: 'left' | 'right';
}

const HoppingRabbit: React.FC<HoppingRabbitProps> = ({
  startX = -40,
  endX = 400,
  startY = 200,
  duration = 40000,
  delay = 0,
  size = 36,
  direction = 'right',
}) => {
  const translateX = useRef(new Animated.Value(startX)).current;
  const hopAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const hopCycle = Animated.loop(
      Animated.sequence([
        Animated.timing(hopAnim, {
          toValue: 1,
          duration: 320,
          useNativeDriver: true,
        }),
        Animated.timing(hopAnim, {
          toValue: 0,
          duration: 320,
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
        hopCycle,
      ]),
    ]);

    walkAnimation.start();

    return () => {
      hopCycle.stop();
      walkAnimation.stop();
    };
  }, [delay, duration, endX, startX, hopAnim, translateX]);

  const hopTranslate = hopAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const bodyColor = '#8B7355';
  const earColor = '#6B5344';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateX },
            { translateY: startY },
            { translateY: hopTranslate },
          ],
        },
      ]}
    >
      {/* Önden görünüm - yüz kullanıcıya dönük */}
      <Svg width={size} height={size * 1.15} viewBox="0 0 24 28" fill="none">
        {/* Kulaklar - üstte yukarı */}
        <Ellipse cx="8" cy="4" rx="2.5" ry="7" fill={earColor} />
        <Ellipse cx="16" cy="4" rx="2.5" ry="7" fill={earColor} />
        {/* Kafa - yuvarlak */}
        <Ellipse cx="12" cy="12" rx="8" ry="8" fill={bodyColor} />
        {/* Gövde */}
        <Ellipse cx="12" cy="22" rx="6" ry="5" fill={bodyColor} />
        {/* Gözler */}
        <Ellipse cx="9" cy="11" rx="1.2" ry="1.5" fill="#2C1810" />
        <Ellipse cx="15" cy="11" rx="1.2" ry="1.5" fill="#2C1810" />
        {/* Burun */}
        <Ellipse cx="12" cy="14" rx="1.5" ry="1.2" fill="#6B5344" />
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

export default HoppingRabbit;
