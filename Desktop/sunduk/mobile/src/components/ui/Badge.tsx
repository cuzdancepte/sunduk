import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../theme/useTheme';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
export type BadgeSize = 'small' | 'medium' | 'large';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
}) => {
  const theme = useTheme();

  const getBadgeStyle = (): ViewStyle => {
    const variantStyles: Record<BadgeVariant, ViewStyle> = {
      primary: {
        backgroundColor: `${theme.colors.primary.main}15`, // 15% opacity
      },
      secondary: {
        backgroundColor: `${theme.colors.secondary.main}15`,
      },
      success: {
        backgroundColor: `${theme.colors.success.main}15`,
      },
      error: {
        backgroundColor: `${theme.colors.error.main}15`,
      },
      warning: {
        backgroundColor: `${theme.colors.warning.main}15`,
      },
      info: {
        backgroundColor: `${theme.colors.info.main}15`,
      },
    };

    const sizeStyles: Record<BadgeSize, ViewStyle> = {
      small: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.small,
      },
      medium: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: theme.borderRadius.medium,
      },
      large: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: theme.borderRadius.medium,
      },
    };

    return {
      ...variantStyles[variant],
      ...sizeStyles[size],
    };
  };

  const getTextStyle = (): TextStyle => {
    const variantTextStyles: Record<BadgeVariant, TextStyle> = {
      primary: {
        color: theme.colors.primary.main,
      },
      secondary: {
        color: theme.colors.secondary.main,
      },
      success: {
        color: theme.colors.success.main,
      },
      error: {
        color: theme.colors.error.main,
      },
      warning: {
        color: theme.colors.warning.main,
      },
      info: {
        color: theme.colors.info.main,
      },
    };

    const sizeTextStyles: Record<BadgeSize, TextStyle> = {
      small: {
        fontSize: 10,
      },
      medium: {
        fontSize: 12,
      },
      large: {
        fontSize: 14,
      },
    };

    return {
      ...theme.typography.caption,
      fontFamily: theme.typography.fontFamily.semiBold,
      ...variantTextStyles[variant],
      ...sizeTextStyles[size],
    };
  };

  return (
    <View style={[getBadgeStyle(), style]}>
      <Text style={[getTextStyle(), textStyle]}>{label}</Text>
    </View>
  );
};

export default Badge;

