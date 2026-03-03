import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface SimitSvgProps {
  size?: number;
  color?: string;
  accentColor?: string;
}

const SimitSvg: React.FC<SimitSvgProps> = ({
  size = 56,
  color = '#8D6E63',
  accentColor = '#6D4C41',
}) => (
  <Svg width={size} height={size} viewBox="0 0 56 56" fill="none">
    <Path
      d="M28 4 A24 24 0 0 1 52 28 A24 24 0 0 1 28 52 A24 24 0 0 1 4 28 A24 24 0 0 1 28 4"
      fill="none"
      stroke={color}
      strokeWidth={10}
      strokeLinecap="round"
    />
    <Path
      d="M28 4 A24 24 0 0 1 52 28 A24 24 0 0 1 28 52 A24 24 0 0 1 4 28 A24 24 0 0 1 28 4"
      fill="none"
      stroke={accentColor}
      strokeWidth={8}
      strokeLinecap="round"
      opacity={0.5}
    />
  </Svg>
);

export default SimitSvg;
