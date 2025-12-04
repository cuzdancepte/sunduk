// Grid System - Design System'den çıkarılan grid yapısı
// Figma Design System: 5 sütunlu grid, 24px padding

export const grid = {
  // Grid sütun sayısı
  columns: 5,
  
  // Padding değerleri (Design System: 24px)
  padding: {
    horizontal: 24, // Sol ve sağ padding
    vertical: 24,   // Üst ve alt padding (isteğe bağlı)
  },
  
  // Grid gap (sütunlar arası boşluk)
  gap: 0, // Figma'da gap yok, padding kullanılıyor
  
  // Sütun genişliği hesaplama fonksiyonu
  getColumnWidth: (screenWidth: number): number => {
    const totalPadding = grid.padding.horizontal * 2; // Sol + sağ padding
    const availableWidth = screenWidth - totalPadding;
    return availableWidth / grid.columns;
  },
  
  // Grid pozisyon hesaplama fonksiyonları
  // Sütun pozisyonu (0-4 arası)
  getColumnPosition: (column: number, screenWidth: number): number => {
    if (column < 0 || column >= grid.columns) {
      throw new Error(`Column must be between 0 and ${grid.columns - 1}`);
    }
    const columnWidth = grid.getColumnWidth(screenWidth);
    return grid.padding.horizontal + (column * columnWidth);
  },
  
  // Sütun genişliği (1-5 sütun arası)
  getColumnSpan: (span: number, screenWidth: number): number => {
    if (span < 1 || span > grid.columns) {
      throw new Error(`Span must be between 1 and ${grid.columns}`);
    }
    const columnWidth = grid.getColumnWidth(screenWidth);
    return columnWidth * span;
  },
  
  // Grid içinde merkezleme (left offset hesaplama)
  // Örnek: 120px genişliğinde bir element'i merkezlemek için
  centerElement: (elementWidth: number, screenWidth: number): number => {
    const totalPadding = grid.padding.horizontal * 2;
    const availableWidth = screenWidth - totalPadding;
    return (availableWidth - elementWidth) / 2 + grid.padding.horizontal;
  },
  
  // Grid içinde yüzde bazlı pozisyon (0-100%)
  getPercentagePosition: (percentage: number, screenWidth: number): number => {
    const totalPadding = grid.padding.horizontal * 2;
    const availableWidth = screenWidth - totalPadding;
    return grid.padding.horizontal + (availableWidth * percentage / 100);
  },
};

export default grid;

