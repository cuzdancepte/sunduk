import React from 'react';
import Svg, { Path, Rect, Ellipse } from 'react-native-svg';

interface GalataTowerSvgProps {
  size?: number;
  color?: string;
  accentColor?: string;
}

const GalataTowerSvg: React.FC<GalataTowerSvgProps> = ({
  size = 56,
  color = '#5D4037',
  accentColor = '#4E342E',
}) => (
  <Svg width={size} height={size * 1.2} viewBox="0 0 48 58" fill="none">
    <Path
      d="M24 58 L24 8 Q24 2 30 2 Q36 2 36 8 L36 58 Z"
      fill={color}
      stroke={accentColor}
      strokeWidth={1}
    />
    <Rect x="22" y="12" width="4" height="8" rx="1" fill={accentColor} opacity={0.8} />
    <Rect x="22" y="24" width="4" height="8" rx="1" fill={accentColor} opacity={0.8} />
    <Rect x="22" y="36" width="4" height="8" rx="1" fill={accentColor} opacity={0.8} />
    <Ellipse cx="24" cy="2" rx="8" ry="4" fill={color} stroke={accentColor} strokeWidth={1} />
    <Path
      d="M18 2 L24 0 L30 2 L28 4 L20 4 Z"
      fill={accentColor}
      opacity={0.7}
    />
  </Svg>
);

export default GalataTowerSvg;
