import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface TulipMilestoneSvgProps {
  size?: number;
  color?: string;
  accentColor?: string;
}

const TulipMilestoneSvg: React.FC<TulipMilestoneSvgProps> = ({
  size = 56,
  color = '#E53935',
  accentColor = '#C62828',
}) => (
  <Svg width={size} height={size * 1.1} viewBox="0 0 48 53" fill="none">
    <Path
      d="M24 53 L24 20 Q18 8 24 4 Q30 8 24 20"
      fill={color}
      stroke={accentColor}
      strokeWidth={1}
    />
    <Path d="M24 20 L24 53" stroke="#2E7D32" strokeWidth={3} strokeLinecap="round" />
  </Svg>
);

export default TulipMilestoneSvg;
