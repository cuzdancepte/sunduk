import React, { useMemo } from 'react';
import Svg, { Path, Defs, LinearGradient, Stop, G } from 'react-native-svg';

export const SEGMENT_HEIGHT = 280;
export const ROAD_HALF_WIDTH = 55;
const WALL_H = 14;

const sr = (seed: number, min: number, max: number) => {
  const n = Math.sin(seed * 12.9898) * 43758.5453;
  return min + (n - Math.floor(n)) * (max - min);
};

const bp = (t: number, a: number, b: number, c: number, d: number) => {
  const m = 1 - t;
  return m * m * m * a + 3 * m * m * t * b + 3 * m * t * t * c + t * t * t * d;
};

const bt = (t: number, a: number, b: number, c: number, d: number) => {
  const m = 1 - t;
  return 3 * m * m * (b - a) + 6 * m * t * (c - b) + 3 * t * t * (d - c);
};

export const getRoadPoint = (
  t: number,
  enterX: number,
  exitX: number,
  h: number = SEGMENT_HEIGHT,
) => ({
  x: bp(t, exitX, exitX, enterX, enterX),
  y: bp(t, 0, h * 0.35, h * 0.65, h),
});

const STONE_LIGHT = [
  '#d8ccc0', '#d4c8bc', '#d0c4b8', '#d6cab0',
  '#dcd0c4', '#d2c6b4', '#dacec2', '#cec2b6',
];
const STONE_MID = [
  '#c4b8a8', '#c0b4a4', '#bcb0a0', '#c8bca8',
  '#c2b6a0', '#beb2a0', '#c6baac', '#bab0a0',
];
const STONE_SHADOW = [
  '#a89888', '#a49484', '#a09080', '#a8988c',
  '#9c8c7c', '#a49080', '#a09488', '#9c9084',
];

const GROUT = '#8a7e70';
const WALL_TOP = '#a09080';
const WALL_BOT = '#6a5c50';

interface Props {
  width: number;
  enterX: number;
  exitX: number;
  segmentIndex: number;
}

const roundedStone = (
  cx: number, cy: number,
  hw: number, hh: number,
  cA: number, sA: number,
  seed: number,
): string => {
  const r = 2.8;
  const j = (s: number) => sr(seed + s, -1.0, 1.0);

  const rot = (lx: number, ly: number) => {
    const rx = lx * cA - ly * sA + cx;
    const ry = lx * sA + ly * cA + cy;
    return `${rx.toFixed(1)} ${ry.toFixed(1)}`;
  };

  const p0 = rot(-hw + j(10), -hh + j(11) + r);
  const c1 = rot(-hw + j(10), -hh + j(11));
  const e1 = rot(-hw + j(10) + r, -hh + j(11));
  const e2 = rot(hw + j(12) - r, -hh + j(13));
  const c2 = rot(hw + j(12), -hh + j(13));
  const e3 = rot(hw + j(12), -hh + j(13) + r);
  const e4 = rot(hw + j(14), hh + j(15) - r);
  const c3 = rot(hw + j(14), hh + j(15));
  const e5 = rot(hw + j(14) - r, hh + j(15));
  const e6 = rot(-hw + j(16) + r, hh + j(17));
  const c4 = rot(-hw + j(16), hh + j(17));
  const e7 = rot(-hw + j(16), hh + j(17) - r);

  return `M${p0}Q${c1} ${e1}L${e2}Q${c2} ${e3}L${e4}Q${c3} ${e5}L${e6}Q${c4} ${e7}Z`;
};

const SVG_PAD = 40;

const InfinitePathSegment: React.FC<Props> = React.memo(({
  width,
  enterX,
  exitX,
  segmentIndex,
}) => {
  const h = SEGMENT_HEIGHT;
  const sx = exitX, ex = enterX;
  const c1x = exitX, c1y = h * 0.35;
  const c2x = enterX, c2y = h * 0.65;

  const result = useMemo(() => {
    const steps = 50;
    const tMin = -0.14, tMax = 1.14;
    const topL: string[] = [];
    const topR: string[] = [];
    const wBotL: string[] = [];
    const wBotR: string[] = [];

    for (let i = 0; i <= steps; i++) {
      const t = tMin + (i / steps) * (tMax - tMin);
      const px = bp(t, sx, c1x, c2x, ex);
      const py = bp(t, 0, c1y, c2y, h);
      const dx = bt(t, sx, c1x, c2x, ex);
      const dy = bt(t, 0, c1y, c2y, h);
      const a = Math.atan2(dy, dx) + Math.PI / 2;
      const hw = ROAD_HALF_WIDTH;
      const ca = Math.cos(a), sa = Math.sin(a);
      const lx = px - ca * hw, ly = py - sa * hw;
      const rx = px + ca * hw, ry = py + sa * hw;
      topL.push(`${lx.toFixed(1)} ${ly.toFixed(1)}`);
      topR.push(`${rx.toFixed(1)} ${ry.toFixed(1)}`);
      wBotL.push(`${lx.toFixed(1)} ${(ly + WALL_H).toFixed(1)}`);
      wBotR.push(`${rx.toFixed(1)} ${(ry + WALL_H).toFixed(1)}`);
    }

    const topOutline = `M${topL.join('L')}L${[...topR].reverse().join('L')}Z`;
    const wallL = `M${topL.join('L')}L${[...wBotL].reverse().join('L')}Z`;
    const wallR = `M${[...topR].reverse().join('L')}L${wBotR.join('L')}Z`;
    const edgeL = `M${topL.join('L')}`;
    const edgeR = `M${[...topR].reverse().join('L')}`;

    const glowL: string[] = [];
    const glowR: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = tMin + (i / steps) * (tMax - tMin);
      const px = bp(t, sx, c1x, c2x, ex);
      const py = bp(t, 0, c1y, c2y, h);
      const dx = bt(t, sx, c1x, c2x, ex);
      const dy = bt(t, 0, c1y, c2y, h);
      const a = Math.atan2(dy, dx) + Math.PI / 2;
      const gw = ROAD_HALF_WIDTH + 8;
      const ca = Math.cos(a), sa = Math.sin(a);
      glowL.push(`${(px - ca * gw).toFixed(1)} ${(py - sa * gw).toFixed(1)}`);
      glowR.push(`${(px + ca * gw).toFixed(1)} ${(py + sa * gw).toFixed(1)}`);
    }
    const glowOutline = `M${glowL.join('L')}L${[...glowR].reverse().join('L')}Z`;

    const colorPaths = new Map<string, string>();
    let shadowD = '';
    let hlD = '';
    let bvD = '';

    const rows = 28;
    const baseW = 20;
    const baseH = 14;
    const gap = 3.0;

    for (let r = -4; r <= rows + 3; r++) {
      const t = (r + 0.5) / rows;
      const tCl = Math.max(0, Math.min(1, t));
      const px = bp(tCl, sx, c1x, c2x, ex);
      const py = bp(t, 0, c1y, c2y, h);
      const dx = bt(tCl, sx, c1x, c2x, ex);
      const dy = bt(tCl, 0, c1y, c2y, h);
      const ang = Math.atan2(dy, dx);
      const cA = Math.cos(ang), sA = Math.sin(ang);
      const cP = Math.cos(ang + Math.PI / 2);
      const sP = Math.sin(ang + Math.PI / 2);

      const rowSeed = segmentIndex * 10000 + (r + 3) * 100;
      const stW = baseW + sr(rowSeed, -3, 3);
      const stH = baseH + sr(rowSeed + 1, -2, 2);
      const tw = stW + gap;
      const rOff = r % 2 === 0 ? 0 : tw / 2;
      const cnt = Math.floor((ROAD_HALF_WIDTH * 2) / tw) + 1;

      for (let c = 0; c < cnt; c++) {
        const d = (c - (cnt - 1) / 2) * tw + rOff;
        if (Math.abs(d) > ROAD_HALF_WIDTH - stW / 2 - 2) continue;

        const ccx = px + cP * d;
        const ccy = py + sP * d;
        const seed = rowSeed + c;
        const hw = (stW + sr(seed + 20, -2, 2)) / 2;
        const hh = (stH + sr(seed + 21, -1.5, 1.5)) / 2;

        const mainP = roundedStone(ccx, ccy, hw, hh, cA, sA, seed);

        const so = 1.6;
        shadowD += roundedStone(ccx + so * 0.3, ccy + so, hw, hh, cA, sA, seed + 200);

        const hlHw = hw * 0.5, hlHh = hh * 0.45;
        const hlOx = -hw * 0.18, hlOy = -hh * 0.22;
        const hlCx = ccx + (hlOx * cA - hlOy * sA);
        const hlCy = ccy + (hlOx * sA + hlOy * cA);
        hlD += roundedStone(hlCx, hlCy, hlHw, hlHh, cA, sA, seed + 300);

        const bvHw = hw * 0.65, bvHh = hh * 0.35;
        const bvOx = hw * 0.06, bvOy = hh * 0.28;
        const bvCx = ccx + (bvOx * cA - bvOy * sA);
        const bvCy = ccy + (bvOx * sA + bvOy * cA);
        bvD += roundedStone(bvCx, bvCy, bvHw, bvHh, cA, sA, seed + 400);

        const dfc = Math.abs(d) / ROAD_HALF_WIDTH;
        const br = sr(seed + 50, 0, 1);
        let pal: string[];
        if (dfc > 0.65) pal = STONE_SHADOW;
        else if (br > 0.45) pal = STONE_LIGHT;
        else if (br > 0.1) pal = STONE_MID;
        else pal = STONE_SHADOW;

        const ci = Math.floor(sr(seed, 0, pal.length)) % pal.length;
        colorPaths.set(pal[ci], (colorPaths.get(pal[ci]) || '') + mainP);
      }
    }

    const stoneGroups = Array.from(colorPaths.entries()).map(([color, dd]) => ({ color, d: dd }));
    return { topOutline, wallL, wallR, edgeL, edgeR, glowOutline, stoneGroups, shadowD, hlD, bvD };
  }, [sx, ex, c1x, c1y, c2x, c2y, h, segmentIndex]);

  const gId = `wg${segmentIndex}`;
  const glId = `gl${segmentIndex}`;

  return (
    <Svg
      width={width}
      height={h + SVG_PAD * 2}
      style={{ position: 'absolute', left: 0, top: -SVG_PAD }}
    >
      <Defs>
        <LinearGradient id={gId} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={WALL_TOP} />
          <Stop offset="0.4" stopColor="#8a7c6c" />
          <Stop offset="1" stopColor={WALL_BOT} />
        </LinearGradient>
        <LinearGradient id={glId} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#f0d8a0" stopOpacity="0.15" />
          <Stop offset="0.5" stopColor="#e8c880" stopOpacity="0.08" />
          <Stop offset="1" stopColor="#f0d8a0" stopOpacity="0.12" />
        </LinearGradient>
      </Defs>

      <G transform={`translate(0, ${SVG_PAD})`}>
        {/* Outer glow */}
        <Path d={result.glowOutline} fill={`url(#${glId})`} />

        {/* Road shadow */}
        <Path d={result.topOutline} fill="#5a4838" opacity={0.35} transform="translate(4, 14)" />

        {/* Road walls */}
        <Path d={result.wallL} fill={`url(#${gId})`} />
        <Path d={result.wallR} fill={`url(#${gId})`} />

        {/* Grout fill */}
        <Path d={result.topOutline} fill={GROUT} />

        {/* Stone shadows */}
        <Path d={result.shadowD} fill="#7a6c5c" opacity={0.35} />

        {/* Main stone groups */}
        {result.stoneGroups.map((g, i) => (
          <Path key={i} d={g.d} fill={g.color} />
        ))}

        {/* Stone bevels (bottom-right darker) */}
        <Path d={result.bvD} fill="#8a7c68" opacity={0.2} />

        {/* Stone highlights (top-left lighter) */}
        <Path d={result.hlD} fill="#fff8f0" opacity={0.3} />

        {/* Edge warm glow - left */}
        <Path d={result.edgeL} fill="none" stroke="#f0d8a0" strokeWidth={2} opacity={0.2} />
        <Path d={result.edgeL} fill="none" stroke="#e8d0b0" strokeWidth={1} opacity={0.35} />

        {/* Edge warm glow - right */}
        <Path d={result.edgeR} fill="none" stroke="#f0d8a0" strokeWidth={2} opacity={0.15} />
        <Path d={result.edgeR} fill="none" stroke="#e8d0b0" strokeWidth={0.8} opacity={0.25} />

        {/* Outline stroke */}
        <Path d={result.topOutline} fill="none" stroke="#a09080" strokeWidth={1.2} opacity={0.5} />
      </G>
    </Svg>
  );
});

export default InfinitePathSegment;
