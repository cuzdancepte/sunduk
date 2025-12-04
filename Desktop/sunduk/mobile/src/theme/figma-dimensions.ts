// Component dimensions - Figma'dan çıkarılan gerçek değerler
// Figma token dosyasından: admin/src/theme/figma-tokens.json

export const dimensions = {
  buttons: {
    // Figma'dan çıkarılan button genişlikleri
    widths: [52, 58, 130, 151, 153, 183, 185, 244, 276, 350, 382, 430, 806, 925],
    // Figma'dan çıkarılan button yükseklikleri
    heights: [22, 29, 58, 60, 118, 200, 282, 322, 405, 884, 967],
    // Yaygın button boyutları
    small: { width: 130, height: 58 },
    medium: { width: 244, height: 60 },
    large: { width: 430, height: 60 },
    fullWidth: { width: '100%', height: 60 },
  },
  inputs: {
    // Figma'dan çıkarılan input genişlikleri
    widths: [78, 79, 84, 382, 828, 1284],
    // Figma'dan çıkarılan input yükseklikleri
    heights: [56, 61, 70, 85, 226, 309, 1075, 1158],
    // Yaygın input boyutları
    small: { width: 382, height: 56 },
    medium: { width: 382, height: 61 },
    large: { width: 828, height: 70 },
    fullWidth: { width: '100%', height: 61 },
  },
  cards: {
    // Figma'dan çıkarılan card genişlikleri
    widths: [180, 185, 334, 382, 424, 828, 1208],
    // Figma'dan çıkarılan card yükseklikleri
    heights: [48, 85, 96, 100, 121, 125, 140, 208, 223, 410, 427, 450, 533, 840],
    // Yaygın card boyutları
    small: { width: 180, height: 96 },
    medium: { width: 382, height: 140 },
    large: { width: 828, height: 450 },
    fullWidth: { width: '100%', height: 'auto' },
  },
  icons: {
    // Figma'dan çıkarılan icon boyutları
    sizes: [12, 16, 18, 20, 24, 28, 30, 32, 36, 40, 44, 59, 60],
    // Yaygın icon boyutları
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
};

export default dimensions;

