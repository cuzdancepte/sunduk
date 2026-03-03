import React from 'react';
import Svg, { Rect, Ellipse } from 'react-native-svg';

interface MinaretMilestoneSvgProps {
  size?: number;
  color?: string;
  accentColor?: string;
}

const MinaretMilestoneSvg: React.FC<MinaretMilestoneSvgProps> = ({
  size = 56,
  color = '#5D4037',
  accentColor = '#4E342E',
}) => (
  <Svg width={size} height={size * 1.2} viewBox="0 0 48 58" fill="none">
    <Rect x="20" y="8" width="8" height="42" rx="2" fill={color} stroke={accentColor} strokeWidth={1} />
    <Ellipse cx="24" cy="8" rx="10" ry="6" fill={color} stroke={accentColor} strokeWidth={1} />
    <Rect x="18" y="46" width="12" height="12" rx="2" fill={accentColor} />
  </Svg>
);

export default MinaretMilestoneSvg;
