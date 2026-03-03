import React from 'react';
import Svg, { Path, Ellipse } from 'react-native-svg';

interface TeaGlassSvgProps {
  size?: number;
  color?: string;
  accentColor?: string;
}

const TeaGlassSvg: React.FC<TeaGlassSvgProps> = ({
  size = 56,
  color = '#C62828',
  accentColor = '#B71C1C',
}) => (
  <Svg width={size} height={size * 1.1} viewBox="0 0 48 53" fill="none">
    <Path
      d="M14 44 L14 48 Q24 51 34 48 L34 44 Q34 40 24 40 Q14 40 14 44 Z"
      fill={color}
      stroke={accentColor}
      strokeWidth={1}
    />
    <Path
      d="M14 44 Q14 28 24 24 Q34 28 34 44"
      fill={color}
      stroke={accentColor}
      strokeWidth={1}
    />
    <Path
      d="M18 24 Q24 12 30 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Ellipse cx="24" cy="26" rx="8" ry="3" fill={accentColor} opacity={0.3} />
  </Svg>
);

export default TeaGlassSvg;
