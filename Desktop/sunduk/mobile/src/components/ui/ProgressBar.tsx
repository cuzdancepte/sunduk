import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/useTheme';

interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
  showLabel?: boolean;
  label?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  color,
  backgroundColor,
  style,
  showLabel = false,
  label,
}) => {
  const theme = useTheme();

  const progressColor = color || theme.colors.primary.main;
  const bgColor = backgroundColor || theme.colors.grey[200];

  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View style={[styles.container, style]}>
      {showLabel && label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: theme.colors.text.secondary }]}>{label}</Text>
          <Text style={[styles.percentage, { color: theme.colors.text.primary }]}>{clampedProgress}%</Text>
        </View>
      )}
      <View
        style={[
          styles.track,
          {
            height,
            backgroundColor: bgColor,
            borderRadius: height / 2,
          },
        ]}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${clampedProgress}%`,
              backgroundColor: progressColor,
              borderRadius: height / 2,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
  },
  percentage: {
    fontSize: 14,
    fontWeight: '600',
  },
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});

export default ProgressBar;

