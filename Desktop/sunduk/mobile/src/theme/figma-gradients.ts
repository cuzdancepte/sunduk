// Gradient stilleri - Figma'dan çıkarılan gerçek değerler
// Figma token dosyasından: admin/src/theme/figma-tokens.json

export const gradients = {
  // Header gradient (TopBar için) - Design System: Gradient Purple
  header: {
    colors: ['#6949FF', '#876DFF'], // Design System'den: Primary -> Light Purple
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
    angle: 286, // Design System'den: 286deg
  },
  
  // Design System Gradient'leri
  purple: {
    colors: ['#6949FF', '#876DFF'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
    angle: 286,
  },
  green: {
    colors: ['#12D18E', '#4ECDC4'], // Design System: Success -> Teal
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  yellow: {
    colors: ['#FFC107', '#FFD300'], // Design System: Warning -> Yellow
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  blue: {
    colors: ['#246BFD', '#1a96f0'], // Design System: Info -> Secondary
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  red: {
    colors: ['#F75555', '#FF5A5F'], // Design System: Error -> Red
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  orange: {
    colors: ['#FF9800', '#FFA828'], // Design System: Warning -> Orange
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  teal: {
    colors: ['#019B83', '#4ECDC4'], // Design System: Teal
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
};

export default gradients;

