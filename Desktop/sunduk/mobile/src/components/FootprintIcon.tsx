import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface FootprintIconProps {
  size?: number;
  color?: string;
  style?: any;
}

const FootprintIcon: React.FC<FootprintIconProps> = ({
  size = 24,
  color = 'rgba(120, 90, 60, 0.6)',
  style,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={style}>
      {/* Deniz yıldızı şeklinde ayak izi - 5 kollu yıldız */}
      <Path
        fill={color}
        d="M24 4 L28 18 L42 18 L32 28 L36 42 L24 34 L12 42 L16 28 L6 18 L20 18 Z"
      />
    </Svg>
  );
};

export default FootprintIcon;
