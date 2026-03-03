import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface FairyChimneyMilestoneSvgProps {
  size?: number;
  color?: string;
  accentColor?: string;
}

const FairyChimneyMilestoneSvg: React.FC<FairyChimneyMilestoneSvgProps> = ({
  size = 56,
  color = '#8D6E63',
  accentColor = '#6D4C41',
}) => (
  <Svg width={size} height={size * 1.1} viewBox="0 0 48 53" fill="none">
    <Path
      d="M8 53 L12 24 Q24 4 36 24 L40 53 Z"
      fill={color}
      stroke={accentColor}
      strokeWidth={1.5}
    />
    <Path
      d="M14 53 L16 32 Q24 18 32 32 L34 53 Z"
      fill="#A1887F"
      stroke={accentColor}
      strokeWidth={0.8}
    />
  </Svg>
);

export default FairyChimneyMilestoneSvg;
