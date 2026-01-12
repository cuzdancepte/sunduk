import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing, useWindowDimensions } from 'react-native';

interface ConfettiPiece {
  id: number;
  color: string;
  size: number;
  startX: number;
  fallDuration: number;
  delay: number;
  rotationSpeed: number;
}

interface ConfettiProps {
  count?: number;
  colors?: string[];
}

const Confetti: React.FC<ConfettiProps> = ({ 
  count = 50, 
  colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2']
}) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const translateYAnims = useRef<Animated.Value[]>([]);
  const rotateAnims = useRef<Animated.Value[]>([]);

  useEffect(() => {
    // Konfeti parçalarını oluştur - sadece bir kez
    const newPieces = Array.from({ length: count }, (_, i) => ({
      id: i,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 6,
      startX: Math.random() * screenWidth,
      fallDuration: Math.random() * 3000 + 4000, // 4-7 saniye arası (daha yavaş)
      delay: Math.random() * 500,
      rotationSpeed: 2000 + Math.random() * 2000, // Daha yavaş rotasyon
    }));

    setPieces(newPieces);

    // Animated value'ları oluştur
    translateYAnims.current = newPieces.map(() => new Animated.Value(-100));
    rotateAnims.current = newPieces.map(() => new Animated.Value(0));

    // Animasyonları hemen başlat
    newPieces.forEach((piece, index) => {
      const translateY = translateYAnims.current[index];
      const rotate = rotateAnims.current[index];

      if (!translateY || !rotate) return;

      // Rotasyon animasyonu (sürekli dönsün)
      Animated.loop(
        Animated.timing(rotate, {
          toValue: 1,
          duration: piece.rotationSpeed,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      // Düşme animasyonu - aşağıya kadar düşsün
      Animated.timing(translateY, {
        toValue: screenHeight + 200, // Daha aşağıya düşsün
        duration: piece.fallDuration,
        delay: piece.delay,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Sadece mount'ta çalışsın - sonsuz döngüyü önlemek için

  if (pieces.length === 0) {
    return null;
  }

  return (
    <View 
      style={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
        },
        styles.container
      ]} 
      pointerEvents="none"
    >
      {pieces.map((piece, index) => {
        const translateY = translateYAnims.current[index];
        const rotate = rotateAnims.current[index];
        
        if (!translateY || !rotate) return null;
        
        const rotation = rotate.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        });

        return (
          <Animated.View
            key={piece.id}
            style={[
              styles.confettiPiece,
              {
                left: piece.startX,
                width: piece.size,
                height: piece.size,
                backgroundColor: piece.color,
                transform: [
                  { translateY },
                  { rotate: rotation },
                ],
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1000, // Üstte görünsün
  },
  confettiPiece: {
    position: 'absolute',
    borderRadius: 2,
  },
});

export default Confetti;
