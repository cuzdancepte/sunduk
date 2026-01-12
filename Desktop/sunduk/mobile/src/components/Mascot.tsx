import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Animated } from 'react-native';
import Character from './Character';
import CompletedCharacter from './CompletedCharacter';

interface MascotProps {
  type?: 'default' | 'completed' | 'spirit' | 'happy' | 'thinking' | 'cool' | 'meditation';
  size?: number;
  style?: any;
  usePNG?: boolean; // PNG kullanmak için yeni prop (varsayılan: true)
  animated?: boolean; // Yeni prop: animasyon aktif mi?
}

const Mascot: React.FC<MascotProps> = ({ 
  type = 'default', 
  size = 120, 
  style,
  usePNG = true, // Varsayılan olarak PNG kullan
  animated = true // Varsayılan olarak animasyonlu
}) => {
  // Floating animasyonu (yukarı-aşağı)
  const floatAnim = useRef(new Animated.Value(0)).current;
  // Gentle sway animasyonu (sağa-sola)
  const swayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      // Floating: yukarı-aşağı hareket (2 saniyede bir döngü)
      const floatingAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );

      // Sway: sağa-sola hafif sallanma (3 saniyede bir döngü)
      const swayAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(swayAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(swayAnim, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      );

      floatingAnimation.start();
      swayAnimation.start();

      return () => {
        floatingAnimation.stop();
        swayAnimation.stop();
      };
    }
  }, [animated, floatAnim, swayAnim]);

  // Animasyon değerlerini transform'a çevir
  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20], // 20px yukarı-aşağı (daha belirgin)
  });

  const translateX = swayAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 8], // 8px sağa-sola (daha belirgin)
  });

  const animatedStyle = animated ? {
    transform: [
      { translateY },
      { translateX },
    ],
  } : {};
  // PNG kullanılıyorsa
  if (usePNG) {
    const maskotImage = require('../../assets/images/maskot.png');
    
    return (
      <Animated.View 
        style={[
          styles.container, 
          { 
            width: size, 
            height: size,
            backgroundColor: 'transparent', // Container'ı transparent yap
          }, 
          style,
          animatedStyle
        ]}
      >
        <Image
          source={maskotImage}
          style={{
            width: size,
            height: size,
            resizeMode: 'contain', // Görselin oranını korur
            backgroundColor: 'transparent', // Image'ın arka planını transparent yap
          }}
        />
      </Animated.View>
    );
  }
  
  // SVG kullanılıyorsa (eski sistem - geriye dönük uyumluluk için)
  const aspectRatio = 1.16; // height = width * 1.16
  
  const renderMascot = () => {
    switch (type) {
      case 'completed':
        return <CompletedCharacter width={size} height={size * aspectRatio} />;
      case 'spirit':
      case 'happy':
      case 'thinking':
      case 'cool':
      case 'meditation':
        // Şimdilik default Character kullanıyoruz
        // Design system'den SVG path'leri çıkarıldığında bu expression'lar için özel component'ler eklenecek
        return <Character width={size} height={size * aspectRatio} />;
      case 'default':
      default:
        return <Character width={size} height={size * aspectRatio} />;
    }
  };

  return (
    <Animated.View 
      style={[
        styles.container, 
        { width: size, height: size * aspectRatio }, 
        style,
        animatedStyle
      ]}
    >
      {renderMascot()}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent', // Container'ı transparent yap
  },
});

export default Mascot;

