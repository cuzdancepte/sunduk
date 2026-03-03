import React from 'react';
import Svg, { Path, G, Ellipse } from 'react-native-svg';

interface VillagePathSegmentProps {
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

const createSteppingStone = (
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  seed: number
): string => {
  const points: string[] = [];
  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2 + seeded(seed + i, -0.08, 0.08);
    const r = 0.92 + seeded(seed + i * 7, 0, 0.15);
    points.push(`${cx + Math.cos(angle) * rx * r} ${cy + Math.sin(angle) * ry * r}`);
  }
  return 'M ' + points.join(' L ') + ' Z';
};

const VillagePathSegment: React.FC<VillagePathSegmentProps> = ({
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

  const rowsCount = 22;
  const rowSpacing = 1 / (rowsCount + 1);
  const pathWidth = 48;

  const stoneColors = isDarkMode
    ? [
        { main: '#D4C4A8', dark: '#B5A088', light: '#F5EDE0' },
        { main: '#C4B59A', dark: '#A8987A', light: '#E8DCC8' },
        { main: '#E0D4BC', dark: '#C4B59A', light: '#F8F2E8' },
        { main: '#D8CCB4', dark: '#B8A88C', light: '#F0E6D8' },
      ]
    : [
        { main: '#E8DCC8', dark: '#C4B59A', light: '#F5EDE0' },
        { main: '#D4C4A8', dark: '#B5A088', light: '#F8F2E8' },
        { main: '#E0D4BC', dark: '#C4B59A', light: '#F5EDE0' },
        { main: '#D8CCB4', dark: '#B8A88C', light: '#F0E6D8' },
      ];

  const shadowColor = isDarkMode ? '#2A2520' : '#3D3428';
  const roadBaseColor = isDarkMode ? '#8B7B6B' : '#C4B59A';

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
    const deg = (angle * 180 / Math.PI) * 0.4;

    const depthScale = 0.35 + t * 0.65;
    const depthOpacity = 0.7 + t * 0.3;
    const stonesPerRow = depthScale < 0.55 ? 3 : 4;
    const rowPathWidth = pathWidth * depthScale;
    const rowColSpacing = rowPathWidth / Math.max(stonesPerRow - 0.5, 1);

    for (let col = 0; col < stonesPerRow; col++) {
      const offset = (col - (stonesPerRow - 1) / 2) * rowColSpacing;
      const x = cx + Math.cos(perpAngle) * offset;
      const y = cy + Math.sin(perpAngle) * offset;

      const stoneIdx = row * 4 + col;
      const seed = index * 1000 + stoneIdx;
      const baseRx = 11 + seeded(seed, 0, 4);
      const baseRy = 8 + seeded(seed + 1, 0, 3);
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

  const taperSteps = 24;
  const leftPoints: string[] = [];
  const rightPoints: string[] = [];
  for (let i = 0; i <= taperSteps; i++) {
    const t = i / taperSteps;
    const { x, y } = getPointOnCurve(t, x1, y1, controlX, controlY, x2, y2);
    const angle = getTangentAngle(t, x1, y1, controlX, controlY, x2, y2);
    const perpAngle = angle + Math.PI / 2;
    const depthScale = 0.35 + t * 0.65;
    const halfW = 30 * depthScale;
    leftPoints.push(`${x - Math.cos(perpAngle) * halfW} ${y - Math.sin(perpAngle) * halfW}`);
    rightPoints.push(`${x + Math.cos(perpAngle) * halfW} ${y + Math.sin(perpAngle) * halfW}`);
  }
  const taperedPathD = 'M ' + leftPoints.join(' L ') + ' L ' + rightPoints.slice().reverse().join(' L ') + ' Z';

  return (
    <>
      <Path d={taperedPathD} fill={roadBaseColor} opacity={0.4} />
      <Path
        d={`M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`}
        stroke={roadBaseColor}
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.25}
      />
      {stones.map((stone, i) => {
        const d = createSteppingStone(stone.x, stone.y, stone.rx, stone.ry, stone.seed);
        return (
          <G
            key={`vstone-${index}-${i}`}
            opacity={stone.depthOpacity}
            transform={`translate(${stone.x}, ${stone.y}) rotate(${stone.angle}) translate(${-stone.x}, ${-stone.y})`}
          >
            <Path
              d={createSteppingStone(stone.x + 2, stone.y + 2.5, stone.rx, stone.ry, stone.seed + 100)}
              fill={shadowColor}
              opacity={0.25}
            />
            <Path d={d} fill={stone.colors.main} />
            <Path d={d} fill="none" stroke={stone.colors.dark} strokeWidth={1} opacity={0.6} />
            <Ellipse
              cx={stone.x - stone.rx * 0.3}
              cy={stone.y - stone.ry * 0.35}
              rx={stone.rx * 0.4}
              ry={stone.ry * 0.35}
              fill={stone.colors.light}
              opacity={0.7}
            />
          </G>
        );
      })}
    </>
  );
};

export default VillagePathSegment;
