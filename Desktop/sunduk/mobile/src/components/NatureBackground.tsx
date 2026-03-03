import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, RadialGradient, Stop, Ellipse } from 'react-native-svg';

interface NatureBackgroundProps {
  width: number;
  height: number;
}

const seeded = (i: number, min: number, max: number) => {
  const n = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return min + (n - Math.floor(n)) * (max - min);
};

const NatureBackground: React.FC<NatureBackgroundProps> = ({ width, height }) => {
  const elements = useMemo(() => {
    const stars: Array<{
      cx: number;
      cy: number;
      r: number;
      opacity: number;
      color: string;
    }> = [];

    for (let i = 0; i < 50; i++) {
      const cx = seeded(i * 3, 0, width);
      const cy = seeded(i * 3 + 1, 0, height);
      const r = seeded(i * 3 + 2, 0.3, 1.0);
      const opacity = seeded(i * 5, 0.04, 0.2);
      const warm = seeded(i * 7, 0, 1);
      const color = warm > 0.6 ? '#f0e0c8' : '#e0d0c0';
      stars.push({ cx, cy, r, opacity, color });
    }

    const bokeh: Array<{
      cx: number;
      cy: number;
      rx: number;
      ry: number;
      opacity: number;
      color: string;
      id: string;
    }> = [];

    for (let i = 0; i < 8; i++) {
      const cx = seeded(i * 11 + 100, width * 0.05, width * 0.95);
      const cy = seeded(i * 11 + 101, height * 0.02, height * 0.98);
      const size = seeded(i * 11 + 102, 20, 60);
      const opacity = seeded(i * 11 + 103, 0.03, 0.08);
      const warm = seeded(i * 11 + 104, 0, 1);
      const color = warm > 0.5 ? '#e8c8a0' : '#c0a8c0';
      bokeh.push({
        cx,
        cy,
        rx: size,
        ry: size * seeded(i * 11 + 105, 0.7, 1.0),
        opacity,
        color,
        id: `bk${i}`,
      });
    }

    return { stars, bokeh };
  }, [width, height]);

  return (
    <View style={[styles.container, { width, height }]} pointerEvents="none">
      <LinearGradient
        colors={[
          '#ddd0c0',
          '#e0d0be',
          '#dcc8b8',
          '#d4beb0',
          '#c8b0a8',
          '#bca0a0',
          '#b098a0',
          '#a090a0',
          '#9888a0',
          '#8878a0',
          '#7c70a0',
          '#706898',
        ]}
        locations={[0, 0.08, 0.16, 0.24, 0.34, 0.44, 0.54, 0.64, 0.74, 0.84, 0.92, 1]}
        style={StyleSheet.absoluteFill}
      />

      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          {elements.bokeh.map(b => (
            <RadialGradient key={b.id} id={b.id} cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0" stopColor={b.color} stopOpacity="1" />
              <Stop offset="0.5" stopColor={b.color} stopOpacity="0.3" />
              <Stop offset="1" stopColor={b.color} stopOpacity="0" />
            </RadialGradient>
          ))}
        </Defs>

        {elements.bokeh.map(b => (
          <Ellipse
            key={b.id}
            cx={b.cx}
            cy={b.cy}
            rx={b.rx}
            ry={b.ry}
            fill={`url(#${b.id})`}
            opacity={b.opacity}
          />
        ))}

        {elements.stars.map((s, i) => (
          <Circle
            key={i}
            cx={s.cx}
            cy={s.cy}
            r={s.r}
            fill={s.color}
            opacity={s.opacity}
          />
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    overflow: 'hidden',
  },
});

export default NatureBackground;
