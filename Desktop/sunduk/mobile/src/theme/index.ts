// Tema sistemi - Figma UI Kit'ten uyarlanmış
import { colors } from './colors';
import { typography } from './typography';
import { spacing, borderRadius, shadows, pathStyles } from './spacing';
import dimensions from './figma-dimensions';
import gradients from './figma-gradients';
import grid from './grid';

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  dimensions,
  gradients,
  pathStyles, // Learning path bağlantı çizgileri için
  grid, // Grid sistemi (5 sütunlu, 24px padding)
};

export type Theme = typeof theme;

// Tema hook'u için tip
declare module '@react-native' {
  interface DefaultTheme extends Theme {}
}

export default theme;

