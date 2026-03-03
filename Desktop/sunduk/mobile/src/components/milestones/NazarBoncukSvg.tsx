import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

interface NazarBoncukSvgProps {
  size?: number;
  color?: string;
  accentColor?: string;
}

const NazarBoncukSvg: React.FC<NazarBoncukSvgProps> = ({
  size = 56,
  color = '#0288D1',
  accentColor = '#01579B',
}) => (
  <Svg width={size} height={size} viewBox="0 0 56 56" fill="none">
    <Circle cx="28" cy="28" r="26" fill="#FFFFFF" stroke={accentColor} strokeWidth={2} />
    <Circle cx="28" cy="28" r="20" fill={color} />
    <Circle cx="28" cy="28" r="14" fill="#FFFFFF" />
    <Circle cx="28" cy="28" r="8" fill={accentColor} />
    <Circle cx="28" cy="24" r="3" fill="#FFFFFF" />
    <Path
      d="M26 14 Q28 12 30 14"
      stroke={accentColor}
      strokeWidth={1.5}
      fill="none"
      strokeLinecap="round"
    />
  </Svg>
);

export default NazarBoncukSvg;
