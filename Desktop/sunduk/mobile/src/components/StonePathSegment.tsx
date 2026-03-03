import React from 'react';
import Svg, { Path, G, Ellipse } from 'react-native-svg';

interface StonePathSegmentProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  index: number;
  isDarkMode?: boolean;
}

const getPointOnCurve = (
  t: number,
  x0: number,
  y0: number,
  cx: number,
  cy: number,
  x2: number,
  y2: number
) => {
  const mt = 1 - t;
  const x = mt * mt * x0 + 2 * mt * t * cx + t * t * x2;
  const y = mt * mt * y0 + 2 * mt * t * cy + t * t * y2;
  return { x, y };
};

const getTangentAngle = (
  t: number,
  x0: number,
  y0: number,
  cx: number,
  cy: number,
  x2: number,
  y2: number
) => {
  const dx = 2 * (1 - t) * (cx - x0) + 2 * t * (x2 - cx);
  const dy = 2 * (1 - t) * (cy - y0) + 2 * t * (y2 - cy);
  return Math.atan2(dy, dx);
};

const seeded = (seed: number, min: number, max: number) => {
  const n = Math.sin(seed * 12.9898) * 43758.5453;
  const f = n - Math.floor(n);
  return min + f * (max - min);
};

// Düzensiz taş formu - 8 köşeli çokgen
const createStonePath = (
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  seed: number
): string => {
  const points: string[] = [];
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 + seeded(seed + i, -0.1, 0.1);
    const r = 0.9 + seeded(seed + i * 7, 0, 0.2);
    points.push(`${cx + Math.cos(angle) * rx * r} ${cy + Math.sin(angle) * ry * r}`);
  }
  return 'M ' + points.join(' L ') + ' Z';
};

const StonePathSegment: React.FC<StonePathSegmentProps> = ({
  x1,
  y1,
  x2,
  y2,
  index,
  isDarkMode = false,
}) => {
  const curveOffset = 55;
  const controlX = (x1 + x2) / 2 + (index % 2 === 0 ? curveOffset : -curveOffset);
  const controlY = (y1 + y2) / 2;

  const rowsCount = 26;
  const baseStonesPerRow = 5;
  const rowSpacing = 1 / (rowsCount + 1);
  const pathWidth = 44;

  const stoneColors = isDarkMode
    ? [
        { main: '#5D4E37', dark: '#3D3428', light: '#6B5344' },
        { main: '#4A3C2E', dark: '#2A2118', light: '#5D4E37' },
        { main: '#6B5344', dark: '#4A3C2E', light: '#7A6348' },
        { main: '#5D4E37', dark: '#3D3428', light: '#8B7355' },
      ]
    : [
        { main: '#7A6348', dark: '#5D4E37', light: '#9A8570' },
        { main: '#8B7355', dark: '#6B5344', light: '#A08060' },
        { main: '#6B5344', dark: '#4A3C2E', light: '#8B7355' },
        { main: '#8B7355', dark: '#5D4E37', light: '#B5A088' },
      ];

  const shadowColor = isDarkMode ? '#1a1510' : '#3D3428';

  const stones: Array<{
    x: number;
    y: number;
    rx: number;
    ry: number;
    angle: number;
    colors: { main: string; dark: string; light: string };
    seed: number;
    depthScale: number;
    depthOpacity: number;
  }> = [];

  for (let row = 0; row < rowsCount; row++) {
    const t = rowSpacing * (row + 1);
    const { x: cx, y: cy } = getPointOnCurve(t, x1, y1, controlX, controlY, x2, y2);
    const angle = getTangentAngle(t, x1, y1, controlX, controlY, x2, y2);
    const perpAngle = angle + Math.PI / 2;
    const deg = (angle * 180 / Math.PI) * 0.5;

    const depthScale = 0.28 + t * 0.72;
    const depthOpacity = 0.45 + t * 0.55;
    const stonesPerRow = depthScale < 0.6 ? 3 : baseStonesPerRow;
    const rowPathWidth = pathWidth * depthScale;
    const rowColSpacing = rowPathWidth / Math.max(stonesPerRow - 0.5, 1);

    for (let col = 0; col < stonesPerRow; col++) {
      const offset = (col - (stonesPerRow - 1) / 2) * rowColSpacing;
      const x = cx + Math.cos(perpAngle) * offset;
      const y = cy + Math.sin(perpAngle) * offset;

      const stoneIdx = row * baseStonesPerRow + col;
      const seed = index * 1000 + stoneIdx;
      const baseRx = 10 + seeded(seed, 0, 5);
      const baseRy = 7 + seeded(seed + 1, 0, 4);
      const rx = baseRx * depthScale;
      const ry = baseRy * depthScale;
      const colorIndex = Math.floor(seeded(seed + 2, 0, stoneColors.length)) % stoneColors.length;

      stones.push({
        x, y, rx, ry,
        angle: deg,
        colors: stoneColors[colorIndex],
        seed,
        depthScale,
        depthOpacity,
      });
    }
  }

  const roadColor = isDarkMode ? '#2A2118' : '#4A3C2E';
  const roadColorInner = isDarkMode ? '#3D3428' : '#5D4E37';

  const taperSteps = 24;
  const leftPoints: string[] = [];
  const rightPoints: string[] = [];
  for (let i = 0; i <= taperSteps; i++) {
    const t = i / taperSteps;
    const { x, y } = getPointOnCurve(t, x1, y1, controlX, controlY, x2, y2);
    const angle = getTangentAngle(t, x1, y1, controlX, controlY, x2, y2);
    const perpAngle = angle + Math.PI / 2;
    const depthScale = 0.28 + t * 0.72;
    const halfW = (27 * depthScale);
    leftPoints.push(`${x - Math.cos(perpAngle) * halfW} ${y - Math.sin(perpAngle) * halfW}`);
    rightPoints.push(`${x + Math.cos(perpAngle) * halfW} ${y + Math.sin(perpAngle) * halfW}`);
  }
  const taperedPathD = 'M ' + leftPoints.join(' L ') + ' L ' + rightPoints.slice().reverse().join(' L ') + ' Z';

  return (
    <>
      {/* Yol tabanı - perspektif ile daralan */}
      <Path d={taperedPathD} fill={roadColor} />
      <Path
        d={`M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`}
        stroke={roadColorInner}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.6}
      />
      {stones.map((stone, i) => {
        const d = createStonePath(stone.x, stone.y, stone.rx, stone.ry, stone.seed);
        return (
          <G
            key={`stone-${index}-${i}`}
            opacity={stone.depthOpacity}
            transform={`translate(${stone.x}, ${stone.y}) rotate(${stone.angle}) translate(${-stone.x}, ${-stone.y})`}
          >
            {/* Gölge - sağ alt */}
            <Path
              d={createStonePath(stone.x + 2.5, stone.y + 2.5, stone.rx, stone.ry, stone.seed + 100)}
              fill={shadowColor}
            />
            {/* Taş ana gövde */}
            <Path d={d} fill={stone.colors.main} />
            {/* Koyu kenar - derinlik */}
            <Path d={d} fill="none" stroke={stone.colors.dark} strokeWidth={1.5} />
            {/* Üst yüzey highlight - sol üst */}
            <Ellipse
              cx={stone.x - stone.rx * 0.35}
              cy={stone.y - stone.ry * 0.4}
              rx={stone.rx * 0.35}
              ry={stone.ry * 0.3}
              fill={stone.colors.light}
              opacity={0.6}
            />
          </G>
        );
      })}
    </>
  );
};

export default StonePathSegment;
