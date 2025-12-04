import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Ellipse, Path } from 'react-native-svg';
import { CheckmarkIcon, MicrophoneIcon, EditIcon, LockIcon, StarIconPurple, DocumentIcon } from './icons/HomeIcons';

interface LevelStepProps {
  type: 'pass' | 'lock' | 'default' | 'exam';
  icon?: 'checkmark' | 'microphone' | 'edit' | 'lock' | 'star' | 'document';
  size?: number;
  number?: number; // For exam type
}

const LevelStep: React.FC<LevelStepProps> = ({ 
  type, 
  icon, 
  size = 120, 
  number 
}) => {
  const renderIcon = () => {
    const iconSize = size * 0.5; // Icon size relative to step size (increased from 0.36 to 0.5)
    
    switch (icon) {
      case 'checkmark':
        return <CheckmarkIcon size={iconSize} color="#FFFFFF" />;
      case 'microphone':
        return <MicrophoneIcon size={iconSize} color="#FFFFFF" />;
      case 'edit':
        return <EditIcon size={iconSize} color="#FFFFFF" />;
      case 'lock':
        return <LockIcon size={iconSize} color="#9E9E9E" />;
      case 'star':
        return <StarIconPurple size={iconSize} color="#FFFFFF" />;
      case 'document':
        return <DocumentIcon size={iconSize} color="#FFFFFF" />;
      default:
        return null;
    }
  };

  const getStepColors = () => {
    // Özel durum: doküman adımı için Figma'daki sarı/oranj balon renklerini kullan
    // Böylece verdiğin `dokumanadim.svg` ile aynı görsel hissi oluşur.
    if (icon === 'document') {
      return {
        outer: '#FF981F',
        middle: '#FFC107',
        inner: '#FFDA6A',
      };
    }

    switch (type) {
      case 'pass':
        return {
          outer: '#FF981F',
          middle: '#FFC107',
          inner: '#FFDA6A',
        };
      case 'lock':
        return {
          outer: '#BDBDBD',
          middle: '#E0E0E0',
          inner: '#EEEEEE',
        };
      case 'default':
        return {
          outer: '#543ACC',
          middle: '#6949FF',
          inner: '#A592FF',
        };
      case 'exam':
        return {
          outer: '#FEC417',
          middle: '#FFA828',
          inner: '#FFEFAB',
        };
      default:
        return {
          outer: '#BDBDBD',
          middle: '#E0E0E0',
          inner: '#EEEEEE',
        };
    }
  };

  const colors = getStepColors();
  const scale = size / 120; // Figma orijinal SVG genişliği 120
  const svgHeight = 105 * scale; // Figma yüksekliği 105

  return (
    <View style={[styles.container, { width: size, height: svgHeight }]}>
      <Svg width={size} height={svgHeight} viewBox="0 0 120 105">
        {/* Outer ellipse - Figma: cx=60, cy=52.5, rx=60, ry=52.5 */}
        <Ellipse
          cx={60 * scale}
          cy={52.5 * scale}
          rx={60 * scale}
          ry={52.5 * scale}
          fill={colors.outer}
        />
        
        {/* Middle ellipse - Figma: cx=60, cy=45.1316, rx=60, ry=45.1316 */}
        <Ellipse
          cx={60 * scale}
          cy={45.1316 * scale}
          rx={60 * scale}
          ry={45.1316 * scale}
          fill={colors.middle}
        />
        
        {/* Inner highlight path - Figma path, ölçeklenmiş */}
        <Path
          d={`M${55.1268 * scale} ${14.0308 * scale}C${55.1268 * scale} ${11.0295 * scale} ${52.6893 * scale} ${8.57187 * scale} ${49.6992 * scale} ${8.83068 * scale}C${43.5383 * scale} ${9.36396 * scale} ${37.555 * scale} ${10.8018 * scale} ${32.0907 * scale} ${13.0777 * scale}C${25.0327 * scale} ${16.0175 * scale} ${19.0691 * scale} ${20.2604 * scale} ${14.7534 * scale} ${25.4127 * scale}C${10.4377 * scale} ${30.5649 * scale} ${7.90966 * scale} ${36.4597 * scale} ${7.40393 * scale} ${42.5499 * scale}C${7.04198 * scale} ${46.9085 * scale} ${7.72424 * scale} ${51.2661 * scale} ${9.39856 * scale} ${55.4157 * scale}C${10.5846 * scale} ${58.3552 * scale} ${13.9909 * scale} ${59.4903 * scale} ${16.9765 * scale} ${58.4259 * scale}C${21.0204 * scale} ${56.9841 * scale} ${22.5733 * scale} ${52.108 * scale} ${21.8967 * scale} ${47.8684 * scale}C${21.6522 * scale} ${46.3359 * scale} ${21.5919 * scale} ${44.7842 * scale} ${21.7208 * scale} ${43.2323 * scale}C${22.0748 * scale} ${38.9692 * scale} ${23.8444 * scale} ${34.8428 * scale} ${26.8654 * scale} ${31.2362 * scale}C${29.8864 * scale} ${27.6297 * scale} ${34.0609 * scale} ${24.6596 * scale} ${39.0015 * scale} ${22.6018 * scale}C${42.3454 * scale} ${21.209 * scale} ${45.9668 * scale} ${20.2647 * scale} ${49.7063 * scale} ${19.7997 * scale}C${52.6846 * scale} ${19.4294 * scale} ${55.1268 * scale} ${17.032 * scale} ${55.1268 * scale} ${14.0308 * scale}Z`}
          fill={colors.inner}
        />
      </Svg>
      
      {/* Icon - rendered outside SVG */}
      {icon && (
        <View style={[styles.iconContainer, { 
          width: size * 0.5, 
          height: size * 0.5,
          left: size * 0.25,
          top: svgHeight * 0.28,
        }]}>
          {renderIcon()}
        </View>
      )}
      
      {/* Number for exam type */}
      {type === 'exam' && number !== undefined && (
        <View style={[styles.numberContainer, {
          width: size,
          height: size * 0.3,
          top: size * 0.16,
        }]}>
          <Text style={[styles.numberText, { fontSize: size * 0.2, color: type === 'exam' ? '#424242' : '#616161' }]}>
            {number}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  iconContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    fontFamily: 'Nunito-Bold',
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default LevelStep;

