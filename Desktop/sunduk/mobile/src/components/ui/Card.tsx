import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/useTheme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  padding = 'medium',
}) => {
  const theme = useTheme();

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: theme.colors.background.paper,
      borderRadius: theme.borderRadius.large, // 24 - Figma'dan
    };

    const variantStyles: Record<string, ViewStyle> = {
      default: {},
      elevated: {
        ...theme.shadows.medium,
      },
      outlined: {
        borderWidth: 2, // Figma tasarımında genellikle 2px border
        borderColor: theme.colors.primary.main,
      },
    };

    const paddingStyles: Record<string, ViewStyle> = {
      none: {},
      small: { padding: theme.spacing.sm }, // 8 - Figma'dan
      medium: { padding: theme.spacing.lg }, // 24 - Figma'dan
      large: { padding: theme.spacing.xl }, // 32 - Figma'dan
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...paddingStyles[padding],
    };
  };

  return <View style={[getCardStyle(), style]}>{children}</View>;
};

export default Card;

