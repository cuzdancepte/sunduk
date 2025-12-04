import React from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../theme/useTheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  containerStyle,
  inputStyle,
  leftIcon,
  rightIcon,
  ...textInputProps
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.text.primary, fontFamily: theme.typography.fontFamily.medium }]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: error ? theme.colors.error.main : theme.colors.border.light,
            borderRadius: theme.borderRadius.medium,
            backgroundColor: theme.colors.background.default,
          },
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            {
              color: theme.colors.text.primary,
              fontFamily: theme.typography.fontFamily.regular,
              fontSize: theme.typography.body1.fontSize,
            },
            inputStyle,
          ]}
          placeholderTextColor={theme.colors.text.hint}
          {...textInputProps}
        />
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      {(error || helperText) && (
        <Text
          style={[
            styles.helperText,
            {
              color: error ? theme.colors.error.main : theme.colors.text.secondary,
              fontFamily: theme.typography.fontFamily.regular,
              fontSize: theme.typography.caption.fontSize,
            },
          ]}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16, // Figma spacing.md
  },
  label: {
    marginBottom: 8, // Figma spacing.sm
    fontSize: 14, // Figma typography.figma['text-14-500']
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    minHeight: 61, // Figma dimensions.inputs.heights[1] - yaygın input yüksekliği
  },
  input: {
    flex: 1,
    paddingVertical: 12, // Figma spacing değeri
    paddingHorizontal: 16, // Figma spacing.md
  },
  leftIcon: {
    paddingLeft: 16, // Figma spacing.md
  },
  rightIcon: {
    paddingRight: 16, // Figma spacing.md
  },
  helperText: {
    marginTop: 4, // Figma spacing.xs
  },
});

export default Input;

