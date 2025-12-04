import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../theme/useTheme';

export type ButtonVariant = 'primary' | 'secondary' | 'outlined' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const theme = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.medium, // 16 - Figma'dan
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    // Size styles - Figma dimensions'dan alınan değerler
    const sizeStyles: Record<ButtonSize, ViewStyle> = {
      small: {
        paddingVertical: theme.spacing.sm, // 8
        paddingHorizontal: theme.spacing.md, // 16
        minHeight: 58, // Figma dimensions.buttons.heights[2] - en küçük yaygın button yüksekliği
      },
      medium: {
        paddingVertical: theme.spacing.md, // 16
        paddingHorizontal: theme.spacing.xl, // 32
        minHeight: 60, // Figma dimensions.buttons.heights[3] - yaygın button yüksekliği
      },
      large: {
        paddingVertical: theme.spacing.lg, // 24
        paddingHorizontal: theme.spacing.xl, // 32
        minHeight: 60, // Figma dimensions.buttons.heights[3] - yaygın button yüksekliği
      },
    };

    // Variant styles
    const variantStyles: Record<ButtonVariant, ViewStyle> = {
      primary: {
        backgroundColor: theme.colors.primary.main,
        ...theme.shadows.small,
      },
      secondary: {
        backgroundColor: theme.colors.secondary.main,
        ...theme.shadows.small,
      },
      outlined: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: theme.colors.primary.main,
      },
      text: {
        backgroundColor: 'transparent',
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      width: fullWidth ? '100%' : 'auto',
      opacity: disabled || loading ? 0.6 : 1,
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      ...theme.typography.button,
      fontFamily: theme.typography.fontFamily.semiBold,
    };

    const variantTextStyles: Record<ButtonVariant, TextStyle> = {
      primary: {
        color: theme.colors.text.white,
      },
      secondary: {
        color: theme.colors.text.white,
      },
      outlined: {
        color: theme.colors.primary.main,
      },
      text: {
        color: theme.colors.primary.main,
      },
    };

    return {
      ...baseStyle,
      ...variantTextStyles[variant],
    };
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'secondary' ? theme.colors.text.white : theme.colors.primary.main}
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;

