// Figma'dan çıkarılan tipografi stilleri - React Native için uyarlanmış
// Figma token dosyasından: admin/src/theme/figma-tokens.json
// Tüm değerler Figma'dan birebir alınmıştır

export const typography = {
  // Font Family
  fontFamily: {
    regular: 'Nunito-Regular',
    medium: 'Nunito-Medium',
    semiBold: 'Nunito-SemiBold',
    bold: 'Nunito-Bold',
  },
  
  // Heading Styles - Figma'dan exact değerler
  h1: {
    fontSize: 32, // text-32-700 (Figma'dan)
    fontWeight: '700' as const,
    lineHeight: 51.2, // Figma: 51.20000076293945px
    letterSpacing: 0,
  },
  
  h2: {
    fontSize: 24, // text-24-700 (Figma'dan)
    fontWeight: '700' as const,
    lineHeight: 38.4, // Figma: 38.400001525878906px
    letterSpacing: 0,
  },
  
  h3: {
    fontSize: 20, // text-20-700 (Figma'dan)
    fontWeight: '700' as const,
    lineHeight: 32, // Figma: 32px
    letterSpacing: 0,
  },
  
  h4: {
    fontSize: 18, // text-18-700 (Figma'dan)
    fontWeight: '700' as const,
    lineHeight: 25.2, // Figma: 25.19999885559082px
    letterSpacing: 0.2, // Figma: 0.20000000298023224px
  },
  
  h5: {
    fontSize: 18, // text-18-600 (Figma'dan)
    fontWeight: '600' as const,
    lineHeight: 25.2, // Figma: 25.19999885559082px
    letterSpacing: 0.2, // Figma: 0.20000000298023224px
  },
  
  h6: {
    fontSize: 16, // text-16-700 (Figma'dan)
    fontWeight: '700' as const,
    lineHeight: 22.4, // Figma: 22.399999618530273px
    letterSpacing: 0.2, // Figma: 0.20000000298023224px
  },
  
  // Body Styles - Figma'dan exact değerler
  body1: {
    fontSize: 16, // text-16-400 (Figma'dan)
    fontWeight: '400' as const,
    lineHeight: 21, // Figma: 21px (Inter font)
    letterSpacing: -0.32, // Figma: -0.3199999928474426px
  },
  
  body2: {
    fontSize: 14, // text-14-500 (Figma'dan)
    fontWeight: '500' as const,
    lineHeight: 19.6, // Figma: 19.600000381469727px
    letterSpacing: 0.2, // Figma: 0.20000000298023224px
  },
  
  // Button Styles - Figma'dan exact değerler
  button: {
    fontSize: 16, // text-16-600 (Figma'dan)
    fontWeight: '600' as const,
    lineHeight: 22.4, // Figma: 22.399999618530273px
    letterSpacing: 0.2, // Figma: 0.20000000298023224px
  },
  
  // Caption Styles - Figma'dan exact değerler
  caption: {
    fontSize: 12, // text-12-400 (Figma'dan)
    fontWeight: '400' as const,
    lineHeight: 16.37, // Figma: 16.368000030517578px
    letterSpacing: 0.2, // Figma: 0.20000000298023224px
  },
  
  // Overline Styles
  overline: {
    fontSize: 10, // text-10-600 (Figma'dan)
    fontWeight: '600' as const,
    lineHeight: 13.64, // Figma: 13.639999389648438px
    letterSpacing: 0.2, // Figma: 0.20000000298023224px
  },
  
  // Figma'dan direkt kullanılabilen stiller
  figma: {
    'text-24-700': {
      fontSize: 24,
      fontWeight: '700' as const,
      lineHeight: 38.4,
      letterSpacing: 0,
    },
    'text-18-700': {
      fontSize: 18,
      fontWeight: '700' as const,
      lineHeight: 25.2,
      letterSpacing: 0.2,
    },
    'text-18-600': {
      fontSize: 18,
      fontWeight: '600' as const,
      lineHeight: 25.2,
      letterSpacing: 0.2,
    },
    'text-18-500': {
      fontSize: 18,
      fontWeight: '500' as const,
      lineHeight: 25.2,
      letterSpacing: 0.2,
    },
    'text-16-700': {
      fontSize: 16,
      fontWeight: '700' as const,
      lineHeight: 22.4,
      letterSpacing: 0.2,
    },
    'text-16-600': {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 22.4,
      letterSpacing: 0.2,
    },
    'text-16-500': {
      fontSize: 16,
      fontWeight: '500' as const,
      lineHeight: 22.4,
      letterSpacing: 0.2,
    },
    'text-16-400': {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 21,
      letterSpacing: -0.32,
    },
    'text-14-600': {
      fontSize: 14,
      fontWeight: '600' as const,
      lineHeight: 19.6,
      letterSpacing: 0.2,
    },
    'text-14-500': {
      fontSize: 14,
      fontWeight: '500' as const,
      lineHeight: 19.6,
      letterSpacing: 0.2,
    },
    'text-12-400': {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16.37,
      letterSpacing: 0.2,
    },
  },
};

