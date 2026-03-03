import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import Mascot from './Mascot';

interface WalkingMascotProps {
  size?: number;
  /** Yürüme animasyonu aktif mi */
  walking?: boolean;
}

/**
 * Yolda yürüyormuş gibi hafif zıplama animasyonu ile maskot.
 */
const WalkingMascot: React.FC<WalkingMascotProps> = ({
  size = 180,
  walking = true,
}) => {
  const stepAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!walking) return;

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(stepAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(stepAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [walking, stepAnim]);

  const bounceY = stepAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12],
  });

  return (
    <Animated.View
      style={{
        transform: [{ translateY: bounceY }],
      }}
    >
      <Mascot size={size} animated={false} usePNG />
    </Animated.View>
  );
};

export default WalkingMascot;
