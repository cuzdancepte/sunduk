import React from 'react';
import Svg, { Path, Rect, Circle, Ellipse } from 'react-native-svg';

interface TreasureChestIconProps {
  variant: 'closed' | 'open';
  size?: number;
  color?: string;
  accentColor?: string;
  style?: any;
}

const TreasureChestIcon: React.FC<TreasureChestIconProps> = ({
  variant,
  size = 56,
  color = '#B8860B',
  accentColor = '#8B6914',
  style,
}) => {
  const isClosed = variant === 'closed';

  const woodColor = isClosed ? '#9E9E9E' : '#8B4513';
  const bandColor = isClosed ? '#757575' : color;
  const bandDark = isClosed ? '#616161' : accentColor;

  return (
    <Svg width={size} height={size * 0.9} viewBox="0 0 56 50" fill="none" style={style}>
      {/* Sandık gövdesi - ahşap */}
      <Path
        fill={woodColor}
        stroke={isClosed ? '#757575' : '#5D4037'}
        strokeWidth={1}
        d="M6 30 L6 44 Q6 48 14 48 L42 48 Q50 48 50 44 L50 30 Z"
      />

      {/* Gövde üst yatay bant */}
      <Rect x="6" y="28" width="44" height="4" rx="1" fill={bandColor} stroke={bandDark} strokeWidth={0.5} />
      <Circle cx="14" cy="30" r="1.5" fill={bandDark} />
      <Circle cx="28" cy="30" r="1.5" fill={bandDark} />
      <Circle cx="42" cy="30" r="1.5" fill={bandDark} />

      {/* Ön dikey kayışlar */}
      <Rect x="16" y="30" width="4" height="18" rx="1" fill={bandColor} stroke={bandDark} strokeWidth={0.5} />
      <Rect x="36" y="30" width="4" height="18" rx="1" fill={bandColor} stroke={bandDark} strokeWidth={0.5} />
      <Circle cx="18" cy="34" r="1" fill={bandDark} />
      <Circle cx="18" cy="40" r="1" fill={bandDark} />
      <Circle cx="38" cy="34" r="1" fill={bandDark} />
      <Circle cx="38" cy="40" r="1" fill={bandDark} />

      {isClosed ? (
        <>
          {/* Kapak - kapalı, hafif kubbe */}
          <Path
            fill={woodColor}
            stroke={isClosed ? '#757575' : '#5D4037'}
            strokeWidth={1}
            d="M6 30 L10 22 Q28 14 46 22 L50 30 Z"
          />
          {/* Kapak 1. bant */}
          <Path fill={bandColor} stroke={bandDark} strokeWidth={0.5} d="M12 24 L44 24 L44 26 L12 26 Z" />
          <Circle cx="20" cy="25" r="1" fill={bandDark} />
          <Circle cx="28" cy="24" r="1" fill={bandDark} />
          <Circle cx="36" cy="25" r="1" fill={bandDark} />
          {/* Kapak 2. bant */}
          <Path fill={bandColor} stroke={bandDark} strokeWidth={0.5} d="M10 28 L46 28 L46 30 L10 30 Z" />
          <Circle cx="18" cy="29" r="1" fill={bandDark} />
          <Circle cx="28" cy="29" r="1" fill={bandDark} />
          <Circle cx="38" cy="29" r="1" fill={bandDark} />
          {/* Anahtar deliği */}
          <Rect x="25" y="32" width="6" height="4" rx="1" fill={bandDark} />
          <Circle cx="28" cy="35" r="1.5" fill={bandDark} />
        </>
      ) : (
        <>
          {/* Kapak - açık (arkaya) */}
          <Path
            fill={woodColor}
            stroke="#5D4037"
            strokeWidth={1}
            d="M8 30 L10 24 L46 24 L48 30 L8 30 Z"
            transform="rotate(-25 28 27)"
          />
          {/* Kapak bantları */}
          <Path fill={bandColor} stroke={bandDark} strokeWidth={0.5} d="M12 26 L44 26 L44 28 L12 28 Z" transform="rotate(-25 28 27)" />
          <Path fill={bandColor} stroke={bandDark} strokeWidth={0.5} d="M10 30 L46 30 L46 32 L10 32 Z" transform="rotate(-25 28 27)" />

          {/* Hazine içeriği */}
          {/* Altın paralar */}
          <Ellipse cx="20" cy="38" rx="4" ry="2" fill="#FFD700" opacity={0.95} />
          <Ellipse cx="28" cy="40" rx="5" ry="2.5" fill="#FFC107" opacity={0.9} />
          <Ellipse cx="36" cy="38" rx="4" ry="2" fill="#FFD700" opacity={0.95} />
          <Ellipse cx="24" cy="42" rx="3" ry="1.5" fill="#FFB300" opacity={0.9} />
          <Ellipse cx="32" cy="36" rx="3" ry="1.5" fill="#FFD700" opacity={0.9} />
          {/* Mavi elmas */}
          <Path
            fill="#4FC3F7"
            stroke="#0288D1"
            strokeWidth={0.5}
            d="M28 30 L32 36 L28 42 L24 36 Z"
          />
          <Path fill="#81D4FA" opacity={0.6} d="M27 32 L29 36 L27 38 L25 36 Z" />
          {/* Pembe taş */}
          <Ellipse cx="18" cy="35" rx="2.5" ry="2" fill="#E91E63" opacity={0.9} />
          {/* Teal taş */}
          <Ellipse cx="38" cy="36" rx="2" ry="1.5" fill="#009688" opacity={0.9} />
          {/* İnci */}
          <Circle cx="22" cy="40" r="1.2" fill="#FFFFFF" opacity={0.95} />
          <Circle cx="26" cy="41" r="1" fill="#FFF8E1" opacity={0.9} />
          <Circle cx="30" cy="40" r="1.2" fill="#FFFFFF" opacity={0.95} />
          <Circle cx="34" cy="41" r="1" fill="#FFF8E1" opacity={0.9} />
          {/* Parlamalar */}
          <Path fill="#FFFFFF" opacity={0.8} d="M26 32 L27 34 L29 34 L27 35 L28 37 L26 35 L24 37 L25 35 L23 34 L25 34 Z" />
          <Path fill="#FFFFFF" opacity={0.6} d="M32 34 L32.5 35 L33.5 35 L33 35.5 L33.5 36.5 L32 36 L30.5 36.5 L31 35.5 L30.5 35 L31.5 35 Z" />
        </>
      )}
    </Svg>
  );
};

export default TreasureChestIcon;
