import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const roadImage = require('../../assets/images/yol_vector.png');

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ROAD_ASPECT = 3750 / 1625;
export const ROAD_TILE_HEIGHT = Math.round(SCREEN_WIDTH * ROAD_ASPECT);

interface NatureBackgroundProps {
  width: number;
  height: number;
}

const NatureBackground: React.FC<NatureBackgroundProps> = ({ width, height }) => {
  const tileCount = Math.ceil(height / ROAD_TILE_HEIGHT) + 1;
  const totalHeight = tileCount * ROAD_TILE_HEIGHT;

  return (
    <View style={[styles.container, { width, height: totalHeight }]} pointerEvents="none">
      <View style={[StyleSheet.absoluteFill, styles.bgLayer]} />

      {Array.from({ length: tileCount }, (_, i) => (
        <Image
          key={i}
          source={roadImage}
          style={{
            width,
            height: ROAD_TILE_HEIGHT,
          }}
          resizeMode="contain"
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  bgLayer: {
    backgroundColor: '#7DC95E',
  },
});

export default NatureBackground;
