import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Ellipse, Line, Path, Rect } from 'react-native-svg';
import FlyingBird from './FlyingBird';
import HoppingRabbit from './HoppingRabbit';
import RunningCat from './RunningCat';
import JumpingFish from './JumpingFish';
import FloatingCloud from './FloatingCloud';

interface DialogPathBackgroundProps {
  width: number;
  height: number;
  dialogCount?: number;
  dialogSpacing?: number;
}

// Çimen tırtıkları - eğik ince çizgiler
const GrassTextureSvg: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const rows = 12;
  const colsPerRow = 25;
  const blades: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
  const startY = 0; // Tüm alan çimen

  for (let r = 0; r < rows; r++) {
    const yBase = startY + (height - startY) * (r / rows) + ((r * 7) % 8);
    for (let c = 0; c < colsPerRow; c++) {
      const x = (width / (colsPerRow + 1)) * (c + 1) + (r % 2 === 0 ? 5 : -5);
      const bladeH = 6 + (r % 3) * 4;
      const angle = (r % 2 === 0 ? 1 : -1) * (75 + (c % 3) * 5);
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
          strokeWidth={1.5}
          opacity={0.5 + (i % 3) * 0.15}
        />
      ))}
    </Svg>
  );
};

// Ağaç - gövde + yuvarlak tepe (ön planda, balıkların üstünde)
const TreeSvg: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <View style={[styles.decorItem, styles.foregroundLayer, { left: x, top: y }]}>
    <Svg width={40 * scale} height={70 * scale} viewBox="0 0 40 70" fill="none">
      <Rect x="16" y="45" width="8" height="25" rx="2" fill="#5D4037" />
      <Ellipse cx="20" cy="25" rx="18" ry="22" fill="#2E7D32" />
      <Ellipse cx="18" cy="28" rx="10" ry="12" fill="#388E3C" opacity={0.8} />
    </Svg>
  </View>
);

// Kaya SVG - düzensiz form
const RockSvg: React.FC<{ x: number; y: number; w: number; h: number; variant?: number }> = ({ x, y, w, h, variant = 0 }) => {
  const paths = [
    'M8 40 Q4 20 20 8 Q36 4 44 24 Q48 36 36 44 Q20 48 8 40 Z',
    'M12 42 Q6 28 22 12 Q38 8 46 26 Q50 38 38 46 Q24 50 12 42 Z',
    'M6 38 Q2 22 18 6 Q34 2 42 20 Q46 34 32 42 Q16 46 6 38 Z',
  ];
  const colors = ['#78909C', '#607D8B', '#546E7A', '#78909C'];
  const darkColors = ['#546E7A', '#455A64', '#37474F', '#546E7A'];
  const i = variant % 3;
  return (
    <View style={[styles.decorItem, { left: x, top: y }]}>
      <Svg width={w} height={h} viewBox="0 0 52 52" fill="none">
        <Path fill={colors[i]} stroke={darkColors[i]} strokeWidth={1} d={paths[i]} />
      </Svg>
    </View>
  );
};

// Maki - bodur Akdeniz çalılığı (yoğun, grimsi yeşil)
const BushSvg: React.FC<{ x: number; y: number; w: number; h: number; variant?: number }> = ({ x, y, w, h, variant = 0 }) => {
  const variants = [
    { main: '#6B8E23', dark: '#556B2F', light: '#9ACD32' },
    { main: '#6B7B46', dark: '#4A5D3A', light: '#8F9A6B' },
    { main: '#5A6B3A', dark: '#3E4E2A', light: '#7A8B5A' },
  ];
  const v = variants[variant % 3];
  return (
    <View style={[styles.decorItem, { left: x, top: y }]}>
      <Svg width={w} height={h} viewBox="0 0 40 28" fill="none">
        {/* Yoğun maki kümeleri - düzensiz organik formlar */}
        <Path fill={v.dark} d="M4 24 Q8 14 16 22 Q24 26 28 20 Q34 24 36 26 L4 26 Z" opacity={0.85} />
        <Path fill={v.main} d="M6 26 Q12 18 20 24 Q28 28 32 26 L8 26 Z" />
        <Path fill={v.light} d="M10 20 Q16 12 24 22 Q28 16 32 22 L28 24 Q18 20 10 24 Z" opacity={0.9} />
        <Path fill={v.dark} d="M2 26 Q6 20 10 26 Z" opacity={0.75} />
        <Path fill={v.main} d="M30 24 Q34 18 38 26 Z" opacity={0.8} />
        <Path fill={v.light} d="M18 22 Q22 16 26 26 Q22 24 18 26 Z" opacity={0.85} />
      </Svg>
    </View>
  );
};

// Böğürtlen bitkisi - yapraklar + mor/siyah meyveler
const BlackberrySvg: React.FC<{ x: number; y: number; w: number; h: number; variant?: number }> = ({ x, y, w, h, variant = 0 }) => {
  const leafColor = '#2E7D32';
  const berryColor = '#4A148C';
  const berryLight = '#6A1B9A';
  return (
    <View style={[styles.decorItem, { left: x, top: y }]}>
      <Svg width={w} height={h} viewBox="0 0 36 32" fill="none">
        {/* Yapraklar */}
        <Path fill={leafColor} d="M8 28 Q12 20 18 26 Q24 20 28 28 L18 32 Z" opacity={0.95} />
        <Path fill="#1B5E20" d="M12 26 Q16 18 22 24 Q20 28 14 30 Z" opacity={0.85} />
        <Path fill={leafColor} d="M20 24 Q24 18 30 26 Q26 30 20 28 Z" opacity={0.9} />
        {/* Böğürtlen salkımları */}
        <Circle cx="14" cy="18" r="3" fill={berryColor} />
        <Circle cx="20" cy="16" r="3" fill={berryColor} />
        <Circle cx="26" cy="18" r="3" fill={berryColor} />
        <Circle cx="17" cy="14" r="2.5" fill={berryLight} />
        <Circle cx="23" cy="14" r="2.5" fill={berryLight} />
        <Circle cx="20" cy="20" r="2" fill={berryColor} />
        <Circle cx="14" cy="22" r="2" fill="#311B92" />
        <Circle cx="26" cy="22" r="2" fill="#311B92" />
      </Svg>
    </View>
  );
};

// Gölet SVG - elips su
const PondSvg: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => (
  <View style={[styles.decorItem, { left: x, top: y }]}>
    <Svg width={w} height={h} viewBox="0 0 100 50" fill="none">
      <Ellipse cx="50" cy="25" rx="48" ry="24" fill="#4FC3F7" opacity={0.5} />
      <Ellipse cx="50" cy="25" rx="45" ry="22" fill="#29B6F6" opacity={0.6} />
      <Ellipse cx="48" cy="23" rx="40" ry="20" fill="#03A9F4" opacity={0.3} />
    </Svg>
  </View>
);

// Dağılım - sol/sağ ve yukarı/aşağı dengeli
const DialogPathBackground: React.FC<DialogPathBackgroundProps> = ({
  width,
  height,
  dialogCount = 0,
  dialogSpacing = height / 3.5,
}) => {
  const pad = 20;
  const rangeX = width - pad * 2 - 60;
  const rangeY = height - pad * 2 - 80;

  const ponds = [
    { x: pad + rangeX * 0.15 - 33, y: pad + rangeY * 0.22 - 17, w: 132, h: 68 },
    { x: pad + rangeX * 0.72 - 30, y: pad + rangeY * 0.48 - 15, w: 120, h: 60 },
    { x: pad + rangeX * 0.35 - 29, y: pad + rangeY * 0.78 - 14.5, w: 116, h: 58 },
    { x: pad + rangeX * 0.85 - 31, y: pad + rangeY * 0.15 - 15.5, w: 124, h: 62 },
  ];

  // Orman öbekleri - her sandığın hizasında 1 öbek, her öbekte 7 ağaç
  const treeClusterOffsets = [[0, 0], [50, -10], [85, 8], [35, 45], [65, 55], [18, 70], [75, 25]];
  const treeClusters = dialogCount > 0
    ? Array.from({ length: dialogCount }, (_, i) => {
        const chestOnLeft = i % 2 === 0;
        const x = chestOnLeft ? width * 0.25 : width * 0.75;
        const y = height - (i * dialogSpacing) - 120;
        const zigzagY = (i % 2 === 0 ? -35 : 35);
        const offsets = chestOnLeft
          ? treeClusterOffsets
          : treeClusterOffsets.map(([dx, dy]) => [-dx, dy]);
        return {
          baseX: chestOnLeft ? x + 95 : x - 95,
          baseY: y - 20 + zigzagY,
          offsets,
        };
      })
    : [
        { baseX: pad + rangeX * 0.02, baseY: pad + rangeY * 0.1, offsets: treeClusterOffsets },
        { baseX: pad + rangeX * 0.02, baseY: pad + rangeY * 0.85, offsets: treeClusterOffsets },
        { baseX: pad + rangeX * 0.5, baseY: pad + rangeY * 0.02, offsets: treeClusterOffsets },
        { baseX: pad + rangeX * 0.88, baseY: pad + rangeY * 0.6, offsets: treeClusterOffsets },
      ];
  const treeW = 40;
  const treeH = 70;
  const isInsidePond = (tx: number, ty: number, s: number) =>
    ponds.some(p => {
      const cx = tx + (treeW * s) / 2;
      const cy = ty + (treeH * s) / 2;
      return cx > p.x && cx < p.x + p.w && cy > p.y && cy < p.y + p.h;
    });
  const trees = treeClusters.flatMap((cluster, ci) =>
    cluster.offsets.map(([dx, dy], i) => ({
      x: cluster.baseX + dx,
      y: cluster.baseY + dy,
      scale: 0.72 + ((ci + i) % 4) * 0.05,
    }))
  ).filter(t => !isInsidePond(t.x, t.y, t.scale));

  const rocks = [
    { x: pad + rangeX * 0.35, y: pad + rangeY * 0.15, w: 28, h: 22, variant: 0 },
    { x: pad + rangeX * 0.58, y: pad + rangeY * 0.3, w: 48, h: 38, variant: 1 },
    { x: pad + rangeX * 0.2, y: pad + rangeY * 0.46, w: 32, h: 26, variant: 2 },
    { x: pad + rangeX * 0.75, y: pad + rangeY * 0.62, w: 42, h: 34, variant: 0 },
    { x: pad + rangeX * 0.12, y: pad + rangeY * 0.26, w: 22, h: 18, variant: 1 },
    { x: pad + rangeX * 0.48, y: pad + rangeY * 0.7, w: 30, h: 24, variant: 2 },
    { x: pad + rangeX * 0.85, y: pad + rangeY * 0.38, w: 20, h: 16, variant: 0 },
    { x: pad + rangeX * 0.05, y: pad + rangeY * 0.82, w: 44, h: 36, variant: 1 },
  ];

  const bushes = [
    { x: pad + rangeX * 0.42, y: pad + rangeY * 0.2, w: 32, h: 24, variant: 0 },
    { x: pad + rangeX * 0.68, y: pad + rangeY * 0.38, w: 28, h: 21, variant: 1 },
    { x: pad + rangeX * 0.22, y: pad + rangeY * 0.55, w: 36, h: 27, variant: 2 },
    { x: pad + rangeX * 0.82, y: pad + rangeY * 0.22, w: 24, h: 18, variant: 0 },
    { x: pad + rangeX * 0.18, y: pad + rangeY * 0.35, w: 30, h: 22, variant: 1 },
    { x: pad + rangeX * 0.55, y: pad + rangeY * 0.58, w: 26, h: 20, variant: 2 },
    { x: pad + rangeX * 0.38, y: pad + rangeY * 0.72, w: 28, h: 21, variant: 0 },
    { x: pad + rangeX * 0.72, y: pad + rangeY * 0.78, w: 24, h: 18, variant: 1 },
    { x: pad + rangeX * 0.92, y: pad + rangeY * 0.55, w: 22, h: 17, variant: 2 },
  ];

  const clouds = [
    { y: height * 0.06, startX: -100, endX: width + 50, duration: 28000, delay: 0, scale: 1.35 },
    { y: height * 0.12, startX: width + 80, endX: -120, duration: 32000, delay: 4000, scale: 1.5 },
    { y: height * 0.22, startX: -80, endX: width + 60, duration: 30000, delay: 2000, scale: 1.2 },
    { y: height * 0.35, startX: width + 100, endX: -100, duration: 35000, delay: 8000, scale: 1.275 },
    { y: height * 0.5, startX: -90, endX: width + 70, duration: 26000, delay: 5000, scale: 1.125 },
    { y: height * 0.65, startX: width + 90, endX: -90, duration: 30000, delay: 10000, scale: 1.35 },
    { y: height * 0.78, startX: -70, endX: width + 80, duration: 28000, delay: 6000, scale: 1.05 },
    { y: height * 0.9, startX: width + 60, endX: -100, duration: 33000, delay: 12000, scale: 1.275 },
  ];

  const blackberries = [
    { x: pad + rangeX * 0.28, y: pad + rangeY * 0.18, w: 28, h: 25 },
    { x: pad + rangeX * 0.62, y: pad + rangeY * 0.52, w: 24, h: 22 },
    { x: pad + rangeX * 0.15, y: pad + rangeY * 0.62, w: 30, h: 27 },
    { x: pad + rangeX * 0.78, y: pad + rangeY * 0.35, w: 26, h: 23 },
    { x: pad + rangeX * 0.45, y: pad + rangeY * 0.82, w: 28, h: 25 },
    { x: pad + rangeX * 0.88, y: pad + rangeY * 0.68, w: 22, h: 20 },
  ];

  const rabbits = useMemo(() => {
    const list: Array<{
      id: string;
      direction: 'left' | 'right';
      startY: number;
      delay: number;
      duration: number;
      size: number;
    }> = [];
    let id = 0;
    const add = (dir: 'left' | 'right', baseY: number, delayMs: number) => {
      list.push({
        id: `rabbit-${id++}`,
        direction: dir,
        startY: baseY,
        delay: delayMs,
        duration: 38000 + (id % 3) * 4000,
        size: 30 + (id % 2) * 6,
      });
    };
    add('right', height * 0.25, 0);
    add('left', height * 0.45, 1500);
    add('right', height * 0.7, 3000);
    add('left', height * 0.15, 4500);
    add('right', height * 0.88, 6000);
    return list;
  }, [height]);

  const cats = useMemo(() => {
    const list: Array<{
      id: string;
      direction: 'left' | 'right';
      startY: number;
      delay: number;
      duration: number;
      size: number;
    }> = [];
    let id = 0;
    const add = (dir: 'left' | 'right', baseY: number, delayMs: number) => {
      list.push({
        id: `cat-${id++}`,
        direction: dir,
        startY: baseY,
        delay: delayMs,
        duration: 22000 + (id % 3) * 3000,
        size: 28 + (id % 2) * 6,
      });
    };
    add('right', height * 0.12, 0);
    add('left', height * 0.38, 2000);
    add('right', height * 0.58, 4000);
    add('left', height * 0.75, 1000);
    add('right', height * 0.92, 5000);
    return list;
  }, [height]);

  const birds = useMemo(() => {
    const list: Array<{
      id: string;
      direction: 'left' | 'right';
      startY: number;
      delay: number;
      duration: number;
      size: number;
    }> = [];
    let id = 0;
    const addFlock = (dir: 'left' | 'right', baseY: number, count: number, baseDelay: number) => {
      for (let i = 0; i < count; i++) {
        list.push({
          id: `bird-${id++}`,
          direction: dir,
          startY: baseY + i * 18,
          delay: baseDelay + i * 250,
          duration: 4000 + (i % 3) * 600,
          size: 28 + (i % 2) * 8,
        });
      }
    };
    addFlock('left', height * 0.08, 3, 0);
    addFlock('right', height * 0.18, 3, 600);
    addFlock('left', height * 0.35, 3, 1200);
    addFlock('right', height * 0.5, 3, 800);
    addFlock('left', height * 0.65, 3, 1400);
    addFlock('right', height * 0.78, 3, 400);
    addFlock('left', height * 0.9, 2, 1000);
    return list;
  }, [height]);

  return (
    <View style={[styles.container, { width, height }]} pointerEvents="none">
      {/* Bulutlar - sağdan sola, soldan sağa yavaşça */}
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

      {/* Tamamen çimen gradient */}
      <LinearGradient
        colors={[
          '#8BC34A', // Açık çimen
          '#7CB342',
          '#689F38',
          '#558B2F', // Koyu çimen
        ]}
        locations={[0, 0.35, 0.65, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Göletler */}
      {ponds.map((p, i) => (
        <PondSvg key={`pond-${i}`} x={p.x} y={p.y} w={p.w} h={p.h} />
      ))}

      {/* Göletlerden zıplayan balıklar */}
      {ponds.map((p, i) => (
        <React.Fragment key={`fish-${i}`}>
          <JumpingFish
            pondX={p.x}
            pondY={p.y}
            pondW={p.w}
            pondH={p.h}
            offsetX={-10}
            offsetY={2}
            delay={i * 400}
            size={18}
          />
          <JumpingFish
            pondX={p.x}
            pondY={p.y}
            pondW={p.w}
            pondH={p.h}
            offsetX={12}
            offsetY={-3}
            delay={i * 400 + 600}
            size={16}
          />
        </React.Fragment>
      ))}

      {/* Ağaçlar - çevrede */}
      {trees.map((t, i) => (
        <TreeSvg key={`tree-${i}`} x={t.x} y={t.y} scale={t.scale} />
      ))}

      {/* Kayalar - etrafta */}
      {rocks.map((r, i) => (
        <RockSvg key={`rock-${i}`} x={r.x} y={r.y} w={r.w} h={r.h} variant={r.variant} />
      ))}

      {/* Bodur bitkiler - çalılar */}
      {bushes.map((b, i) => (
        <BushSvg key={`bush-${i}`} x={b.x} y={b.y} w={b.w} h={b.h} variant={b.variant} />
      ))}

      {/* Böğürtlen bitkileri */}
      {blackberries.map((bb, i) => (
        <BlackberrySvg key={`blackberry-${i}`} x={bb.x} y={bb.y} w={bb.w} h={bb.h} />
      ))}

      {/* Kediler - etrafta koşan */}
      {cats.map((c) => (
        <RunningCat
          key={c.id}
          startX={c.direction === 'right' ? -50 : width + 50}
          endX={c.direction === 'right' ? width + 50 : -50}
          startY={c.startY}
          duration={c.duration}
          delay={c.delay}
          size={c.size}
          direction={c.direction}
        />
      ))}

      {/* Tavşanlar - etrafta dolaşan */}
      {rabbits.map((r) => (
        <HoppingRabbit
          key={r.id}
          startX={r.direction === 'right' ? -50 : width + 50}
          endX={r.direction === 'right' ? width + 50 : -50}
          startY={r.startY}
          duration={r.duration}
          delay={r.delay}
          size={r.size}
          direction={r.direction}
        />
      ))}

      {/* Kuş sürüleri - sağdan sola, soldan sağa */}
      {birds.map((b) => (
        <FlyingBird
          key={b.id}
          startX={b.direction === 'right' ? -50 : width + 50}
          endX={b.direction === 'right' ? width + 50 : -50}
          startY={b.startY}
          duration={b.duration}
          delay={b.delay}
          size={b.size}
          direction={b.direction}
        />
      ))}

      {/* Çimen tırtıkları */}
      <GrassTextureSvg width={width} height={height} />
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
  foregroundLayer: {
    zIndex: 5,
  },
});

export default DialogPathBackground;
