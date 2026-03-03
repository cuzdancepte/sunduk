import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Ellipse } from 'react-native-svg';
import {
  FairyChimneyMilestoneSvg,
  TeaGlassSvg,
  GalataTowerSvg,
  TulipMilestoneSvg,
  MinaretMilestoneSvg,
  NazarBoncukSvg,
  SimitSvg,
} from './milestones';
import TreasureChestIcon from './TreasureChestIcon';
import { Ionicons } from '@expo/vector-icons';

export type MilestoneStatus = 'completed' | 'current' | 'locked';

const MOTIF_ORDER = [
  'fairy_chimney',
  'tea_glass',
  'galata_tower',
  'tulip',
  'minaret',
  'nazar',
  'simit',
] as const;

const PLACE_NAMES: Record<string, string> = {
  fairy_chimney: 'Kapadokya',
  tea_glass: 'Çay Keyfi',
  galata_tower: 'İstanbul',
  tulip: 'Lale',
  minaret: 'Anadolu',
  nazar: 'Nazar',
  simit: 'Simit',
};

const getMotifForIndex = (index: number) =>
  MOTIF_ORDER[index % MOTIF_ORDER.length];

const getPlaceName = (unitIndex: number) => {
  const motif = getMotifForIndex(unitIndex);
  return PLACE_NAMES[motif] || 'Ders';
};

const getLandmarkColors = (status: MilestoneStatus) => {
  switch (status) {
    case 'completed':
      return { main: '#8D6E63', accent: '#6D4C41' };
    case 'current':
      return { main: '#8D6E63', accent: '#6D4C41' };
    case 'locked':
    default:
      return { main: '#9E9E9E', accent: '#757575' };
  }
};

const getChestConfig = (status: MilestoneStatus) => {
  switch (status) {
    case 'completed':
      return {
        variant: 'open' as const,
        color: '#B8860B',
        accentColor: '#8B6914',
        showPlayIcon: false,
      };
    case 'current':
      return {
        variant: 'open' as const,
        color: '#0d9cdd',
        accentColor: '#0a7bb5',
        showPlayIcon: true,
      };
    case 'locked':
    default:
      return {
        variant: 'closed' as const,
        color: '#9E9E9E',
        accentColor: '#757575',
        showPlayIcon: false,
      };
  }
};

interface LessonMilestoneProps {
  unitIndex: number;
  status: MilestoneStatus;
  size?: number;
  showPlayIcon?: boolean;
}

const LessonMilestone: React.FC<LessonMilestoneProps> = ({
  unitIndex,
  status,
  size = 72,
  showPlayIcon = false,
}) => {
  const motif = getMotifForIndex(unitIndex);
  const landmarkColors = getLandmarkColors(status);
  const chestConfig = getChestConfig(status);
  const isLocked = status === 'locked';

  const landmarkSize = size * 0.65;
  const chestSize = size * 0.75;

  const iconProps = {
    size: landmarkSize,
    color: landmarkColors.main,
    accentColor: landmarkColors.accent,
  };

  const renderLandmark = () => {
    switch (motif) {
      case 'fairy_chimney':
        return <FairyChimneyMilestoneSvg {...iconProps} />;
      case 'tea_glass':
        return <TeaGlassSvg {...iconProps} />;
      case 'galata_tower':
        return <GalataTowerSvg {...iconProps} />;
      case 'tulip':
        return <TulipMilestoneSvg {...iconProps} />;
      case 'minaret':
        return <MinaretMilestoneSvg {...iconProps} />;
      case 'nazar':
        return <NazarBoncukSvg {...iconProps} />;
      case 'simit':
        return <SimitSvg {...iconProps} />;
      default:
        return <FairyChimneyMilestoneSvg {...iconProps} />;
    }
  };

  return (
    <View
      style={[
        styles.container,
        isLocked && styles.locked,
        !isLocked && styles.shadow,
      ]}
    >
      <View style={[styles.platform, { width: size * 1.4, marginLeft: -(size * 1.4) / 2 }]}>
        <Svg width={size * 1.4} height={24} viewBox="0 0 100 24" style={styles.platformSvg}>
          <Ellipse cx="50" cy="16" rx="48" ry="8" fill="#E8DCC8" opacity={0.95} />
          <Ellipse cx="50" cy="14" rx="46" ry="7" fill="#D4C4A8" opacity={0.5} />
        </Svg>
      </View>
      <View style={styles.contentRow}>
        <View style={styles.landmarkWrapper}>{renderLandmark()}</View>
        <View style={styles.chestWrapper}>
          <TreasureChestIcon
            variant={chestConfig.variant}
            size={chestSize}
            color={chestConfig.color}
            accentColor={chestConfig.accentColor}
          />
          {(showPlayIcon || chestConfig.showPlayIcon) && (
            <View style={styles.playOverlay}>
              <Ionicons name="play" size={18} color="#FFF" />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export { getPlaceName };

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  platform: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
  },
  platformSvg: {
    overflow: 'visible',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  landmarkWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  chestWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locked: {
    opacity: 0.85,
  },
  shadow: {
    shadowColor: '#3D3428',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  playOverlay: {
    position: 'absolute',
    bottom: 0,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(13, 156, 221, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
});

export default LessonMilestone;
