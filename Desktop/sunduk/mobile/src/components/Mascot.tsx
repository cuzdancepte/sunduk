import React from 'react';
import { View, StyleSheet } from 'react-native';
import Character from './Character';
import CompletedCharacter from './CompletedCharacter';

interface MascotProps {
  type?: 'default' | 'completed' | 'spirit' | 'happy' | 'thinking' | 'cool' | 'meditation';
  size?: number;
  style?: any;
}

const Mascot: React.FC<MascotProps> = ({ type = 'default', size = 120, style }) => {
  const renderMascot = () => {
    const aspectRatio = 1.16; // height = width * 1.16
    
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
    <View style={[styles.container, { width: size, height: size }, style]}>
      {renderMascot()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Mascot;

