import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
  style?: ViewStyle;
  size?: number;
  color?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onPress,
  style,
  size = 24,
  color = '#6949FF',
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, { width: size, height: size }, style]}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.checkbox,
          {
            width: size,
            height: size,
            borderRadius: size * 0.25, // 25% border radius
            backgroundColor: checked ? color : 'transparent',
            borderColor: checked ? color : '#9E9E9E',
            borderWidth: checked ? 0 : 2,
          },
        ]}
      >
        {checked && (
          <Ionicons name="checkmark" size={size * 0.6} color="#FFFFFF" />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Checkbox;

