import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Ellipse, Path, Line, Rect } from 'react-native-svg';
import FloatingCloud from './FloatingCloud';

interface LearningPathBackgroundProps {
  width: number;
  height: number;
  stopCount?: number;
  stopSpacing?: number;
}

// Minare silüeti - Türkiye
const MinaretSvg: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <View style={[styles.decorItem, { left: x, top: y }]}>
    <Svg width={16 * scale} height={50 * scale} viewBox="0 0 16 50" fill="none">
      <Rect x="6" y="0" width="4" height="50" fill="#5D4037" />
      <Ellipse cx="8" cy="0" rx="6" ry="4" fill="#6D4C41" />
      <Rect x="5" y="42" width="6" height="8" rx="1" fill="#4E342E" />
    </Svg>
  </View>
);

// Zeytin ağacı - Akdeniz
const OliveTreeSvg: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <View style={[styles.decorItem, { left: x, top: y }]}>
    <Svg width={45 * scale} height={55 * scale} viewBox="0 0 45 55" fill="none">
      <Path d="M22 35 L22 55" stroke="#5D4037" strokeWidth="3" />
      <Ellipse cx="22" cy="18" rx="18" ry="22" fill="#558B2F" />
      <Ellipse cx="18" cy="22" rx="12" ry="14" fill="#6B8E23" opacity={0.9} />
    </Svg>
  </View>
);

// Lale - Türkiye simgesi
const TulipSvg: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => (
  <View style={[styles.decorItem, { left: x, top: y }]}>
    <Svg width={w} height={h} viewBox="0 0 24 32" fill="none">
      <Path d="M12 32 L12 14 Q8 8 12 4 Q16 8 12 14" fill="#E53935" />
      <Path d="M12 14 L12 32" stroke="#2E7D32" strokeWidth="2" />
    </Svg>
  </View>
);

// Peri bacası - Kapadokya
const FairyChimneySvg: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => (
  <View style={[styles.decorItem, { left: x, top: y }]}>
    <Svg width={w} height={h} viewBox="0 0 40 55" fill="none">
      <Path
        d="M8 55 L12 25 Q20 8 28 25 L32 55 Z"
        fill="#8D6E63"
        stroke="#6D4C41"
        strokeWidth="1"
      />
      <Path
        d="M14 55 L16 35 Q20 22 24 35 L26 55 Z"
        fill="#A1887F"
        stroke="#6D4C41"
        strokeWidth="0.5"
      />
    </Svg>
  </View>
);

// Çimen tırtıkları
const GrassTextureSvg: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const blades: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
  for (let r = 0; r < 10; r++) {
    const yBase = (height / 10) * r + (r * 5) % 12;
    for (let c = 0; c < 20; c++) {
      const x = (width / 21) * (c + 1) + (r % 2) * 8;
      const bladeH = 5 + (c % 3) * 3;
      const angle = (r % 2 === 0 ? 1 : -1) * (70 + (c % 4) * 5);
      const rad = (angle * Math.PI) / 180;
      blades.push({
        x1: x,
        y1: yBase,
        x2: x + Math.cos(rad) * bladeH,
        y2: yBase - Math.sin(rad) * bladeH,
      });
    }
  }
  return (
    <Svg width={width} height={height} style={{ position: 'absolute', left: 0, top: 0 }}>
      {blades.map((b, i) => (
        <Line
          key={i}
          x1={b.x1}
          y1={b.y1}
          x2={b.x2}
          y2={b.y2}
          stroke="#558B2F"
          strokeWidth={1.2}
          opacity={0.4 + (i % 3) * 0.12}
        />
      ))}
    </Svg>
  );
};

const LearningPathBackground: React.FC<LearningPathBackgroundProps> = ({
  width,
  height,
  stopCount = 0,
  stopSpacing = height / 3.5,
}) => {
  const pad = 20;
  const rangeX = width - pad * 2 - 40;
  const rangeY = height - pad * 2 - 60;

  const oliveTreeClusters = stopCount > 0
    ? Array.from({ length: stopCount }, (_, i) => {
        const isLeft = i % 2 === 0;
        const x = isLeft ? width * 0.2 : width * 0.78;
        const y = height - (i * stopSpacing) - 100;
        return { x: x + (isLeft ? -30 : 20), y: y - 20, scale: 0.6 + (i % 3) * 0.15 };
      })
    : [
        { x: pad + rangeX * 0.1, y: pad + rangeY * 0.2, scale: 0.7 },
        { x: pad + rangeX * 0.85, y: pad + rangeY * 0.5, scale: 0.65 },
        { x: pad + rangeX * 0.15, y: pad + rangeY * 0.75, scale: 0.6 },
        { x: pad + rangeX * 0.8, y: pad + rangeY * 0.15, scale: 0.55 },
      ];

  const tulips = [
    { x: pad + rangeX * 0.25, y: pad + rangeY * 0.3, w: 18, h: 24 },
    { x: pad + rangeX * 0.7, y: pad + rangeY * 0.45, w: 16, h: 22 },
    { x: pad + rangeX * 0.35, y: pad + rangeY * 0.7, w: 20, h: 26 },
    { x: pad + rangeX * 0.82, y: pad + rangeY * 0.25, w: 14, h: 20 },
  ];

  const chimneys = [
    { x: pad + rangeX * 0.12, y: pad + rangeY * 0.55, w: 32, h: 44 },
    { x: pad + rangeX * 0.72, y: pad + rangeY * 0.68, w: 28, h: 38 },
  ];

  const minarets = [
    { x: pad + rangeX * 0.05, y: pad + rangeY * 0.35, scale: 0.8 },
    { x: pad + rangeX * 0.92, y: pad + rangeY * 0.6, scale: 0.7 },
  ];

  const clouds = [
    { y: height * 0.08, startX: -80, endX: width + 60, duration: 28000, delay: 0, scale: 1.2 },
    { y: height * 0.18, startX: width + 70, endX: -90, duration: 32000, delay: 3000, scale: 1.35 },
    { y: height * 0.45, startX: -60, endX: width + 80, duration: 26000, delay: 6000, scale: 1.1 },
    { y: height * 0.72, startX: width + 50, endX: -70, duration: 30000, delay: 2000, scale: 1.25 },
  ];

  return (
    <View style={[styles.container, { width, height }]} pointerEvents="none">
      <LinearGradient
        colors={['#87CEEB', '#B0E0E6', '#98D8C8', '#7CB342', '#689F38']}
        locations={[0, 0.25, 0.5, 0.75, 1]}
        style={StyleSheet.absoluteFill}
      />

      {clouds.map((c, i) => (
        <FloatingCloud
          key={`cloud-${i}`}
          startX={c.startX}
          endX={c.endX}
          y={c.y}
          duration={c.duration}
          delay={c.delay}
          scale={c.scale}
        />
      ))}

      <GrassTextureSvg width={width} height={height} />

      {oliveTreeClusters.map((t, i) => (
        <OliveTreeSvg key={`olive-${i}`} x={t.x} y={t.y} scale={t.scale} />
      ))}

      {tulips.map((t, i) => (
        <TulipSvg key={`tulip-${i}`} x={t.x} y={t.y} w={t.w} h={t.h} />
      ))}

      {chimneys.map((c, i) => (
        <FairyChimneySvg key={`chimney-${i}`} x={c.x} y={c.y} w={c.w} h={c.h} />
      ))}

      {minarets.map((m, i) => (
        <MinaretSvg key={`minaret-${i}`} x={m.x} y={m.y} scale={m.scale} />
      ))}
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
  decorItem: {
    position: 'absolute',
  },
});

export default LearningPathBackground;
