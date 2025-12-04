// Spacing değerleri - Figma'dan çıkarılan gerçek değerler
// Figma token dosyasından: admin/src/theme/figma-tokens.json
export const spacing = {
  // Figma'dan çıkarılan scale değerleri
  xs: 4,    // Figma scale.xs
  sm: 8,    // Figma scale.sm
  md: 16,   // Figma scale.md
  lg: 24,   // Figma scale.lg
  xl: 32,   // Figma scale.xl
  xxl: 40,  // Figma scale.xxl
  
  // Ek yaygın değerler (Figma'dan çıkarılan values array'inden)
  1: 1,
  2: 2,
  6: 6,
  10: 10,
  12: 12,
  17: 17,
  18: 18,
  19: 19,
  20: 20,
  28: 28,
  36: 36,
  44: 44,
  48: 48,
  60: 60,
  72: 72,
  80: 80,
  100: 100,
  120: 120,
  123: 123,
  140: 140,
  150: 150,
  200: 200,
  400: 400,
  452: 452,
  1000: 1000,
};

// Border Radius değerleri - Figma'dan çıkarılan gerçek değerler
export const borderRadius = {
  // Figma'dan çıkarılan scale değerleri
  small: 8,    // Figma scale.small
  medium: 16,  // Figma scale.medium
  large: 24,   // Figma scale.large
  xlarge: 32,  // Figma scale.xlarge
  
  // Ek yaygın değerler (Figma'dan çıkarılan values array'inden)
  1: 1,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  10: 10,
  12: 12,
  20: 20,
  36: 36,
  40: 40,
  44: 44,
  48: 48,
  52: 52,
  60: 60,
  100: 100,
  143: 143,
  360: 360,
  398: 398,
  795: 795,
  1000: 1000,
  round: 9999, // Full circle
};

// Shadow presets
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Path/Line Styles (Design System'den - Learning Path bağlantı çizgileri için)
export const pathStyles = {
  // Varsayılan bağlantı çizgisi stili
  default: {
    strokeWidth: 2,
    strokeColor: '#e0e0e0', // Design System: grey.300 / border.light
    strokeDasharray: [4, 4], // Dashed line
    opacity: 1,
  },
  // Aktif bağlantı çizgisi stili
  active: {
    strokeWidth: 2,
    strokeColor: '#6949ff', // Design System: primary.main
    strokeDasharray: [], // Solid line
    opacity: 1,
  },
  // Pasif/kilitli bağlantı çizgisi stili
  inactive: {
    strokeWidth: 2,
    strokeColor: '#bdbdbd', // Design System: grey.400 / border.dark
    strokeDasharray: [4, 4], // Dashed line
    opacity: 0.5,
  },
};

