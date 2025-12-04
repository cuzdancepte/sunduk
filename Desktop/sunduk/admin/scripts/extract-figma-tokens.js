import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Figma API Configuration
const FIGMA_TOKEN = process.env.FIGMA_TOKEN || '';
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY || '3lrkN8LLWUd2T7DNZVwsP9';

const API_BASE = 'https://api.figma.com/v1';

// Helper function to convert RGB to HEX
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

// Helper function to convert RGBA to HEX with opacity
function rgbaToHex(r, g, b, a) {
  if (a === 1) {
    return rgbToHex(r, g, b);
  }
  return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
}

// Fetch file styles
async function fetchFileStyles() {
  try {
    console.log('📡 Figma API\'ye bağlanılıyor...');
    
    const response = await axios.get(`${API_BASE}/files/${FIGMA_FILE_KEY}/styles`, {
      headers: {
        'X-Figma-Token': FIGMA_TOKEN
      }
    });

    return response.data.meta.styles || [];
  } catch (error) {
    console.error('❌ Styles çıkarılırken hata:', error.response?.data || error.message);
    throw error;
  }
}

// Fetch file nodes to get style details
async function fetchFileNodes() {
  try {
    console.log('📡 Dosya içeriği alınıyor...');
    
    const response = await axios.get(`${API_BASE}/files/${FIGMA_FILE_KEY}`, {
      headers: {
        'X-Figma-Token': FIGMA_TOKEN
      }
    });

    return response.data;
  } catch (error) {
    console.error('❌ Dosya içeriği alınırken hata:', error.response?.data || error.message);
    throw error;
  }
}

// Extract color styles from nodes
function extractColorStyles(fileData) {
  const colorStyles = {};
  const colorMap = new Map();

  function traverse(node) {
    // Extract fills (colors)
    if (node.fills && Array.isArray(node.fills)) {
      node.fills.forEach(fill => {
        if (fill.type === 'SOLID') {
          const color = rgbaToHex(fill.color.r, fill.color.g, fill.color.b, fill.opacity || 1);
          
          // Use style name if available, otherwise use color value as key
          let styleName = null;
          if (node.styles && node.styles.fill) {
            // Try to find style name from styles array
            const style = fileData.styles?.find(s => s.nodeId === node.styles.fill);
            if (style) {
              styleName = style.name;
            }
          }
          
          // If no style name, use color value
          const key = styleName || color;
          
          if (!colorMap.has(key)) {
            colorMap.set(key, {
              value: color,
              type: fill.type,
              opacity: fill.opacity || 1,
              name: styleName || color
            });
          }
        } else if (fill.type === 'GRADIENT_LINEAR' || fill.type === 'GRADIENT_RADIAL') {
          const key = node.name || 'gradient';
          if (!colorMap.has(key)) {
            colorMap.set(key, {
              type: fill.type,
              gradientStops: fill.gradientStops
            });
          }
        }
      });
    }

    if (node.children) {
      node.children.forEach(child => traverse(child));
    }
  }

  if (fileData.document) {
    traverse(fileData.document);
  }

  // Convert map to object
  colorMap.forEach((value, key) => {
    colorStyles[key] = value;
  });

  return colorStyles;
}

// Extract text styles from nodes
function extractTextStyles(fileData) {
  const textStyles = {};
  const textStyleMap = new Map();

  function traverse(node) {
    if (node.type === 'TEXT' && node.style) {
      let styleName = null;
      
      // Try to find style name
      if (node.styles && node.styles.text) {
        const style = fileData.styles?.find(s => s.nodeId === node.styles.text);
        if (style) {
          styleName = style.name;
        }
      }
      
      // Use style name or generate one from properties
      const key = styleName || `text-${node.style.fontSize}-${node.style.fontWeight}`;
      
      if (!textStyleMap.has(key)) {
        const lineHeight = node.style.lineHeightPx 
          ? `${node.style.lineHeightPx}px` 
          : node.style.lineHeightPercentFontSize 
            ? `${node.style.lineHeightPercentFontSize}%` 
            : node.style.lineHeightUnit === 'AUTO'
              ? 'auto'
              : 'normal';
        
        textStyleMap.set(key, {
          fontFamily: node.style.fontFamily,
          fontSize: `${node.style.fontSize}px`,
          fontWeight: node.style.fontWeight,
          lineHeight: lineHeight,
          letterSpacing: node.style.letterSpacing ? `${node.style.letterSpacing}px` : '0px',
          name: styleName || key
        });
      }
    }

    if (node.children) {
      node.children.forEach(child => traverse(child));
    }
  }

  if (fileData.document) {
    traverse(fileData.document);
  }

  // Convert map to object
  textStyleMap.forEach((value, key) => {
    textStyles[key] = value;
  });

  return textStyles;
}

// Extract effect styles (shadows) from nodes
function extractEffectStyles(fileData) {
  const effectStyles = {};
  const effectMap = new Map();

  function traverse(node) {
    if (node.effects && Array.isArray(node.effects)) {
      const shadows = node.effects
        .filter(e => e.type === 'DROP_SHADOW' || e.type === 'INNER_SHADOW')
        .map(e => ({
          type: e.type,
          x: e.offset?.x || 0,
          y: e.offset?.y || 0,
          blur: e.radius || 0,
          spread: e.spread || 0,
          color: e.color ? rgbaToHex(e.color.r, e.color.g, e.color.b, e.color.a) : 'rgba(0,0,0,0.25)'
        }));
      
      if (shadows.length > 0) {
        let styleName = null;
        
        // Try to find style name
        if (node.styles && node.styles.effect) {
          const style = fileData.styles?.find(s => s.nodeId === node.styles.effect);
          if (style) {
            styleName = style.name;
          }
        }
        
        const key = styleName || `shadow-${shadows[0].blur}`;
        
        if (!effectMap.has(key)) {
          effectMap.set(key, {
            shadows: shadows,
            name: styleName || key
          });
        }
      }
    }

    if (node.children) {
      node.children.forEach(child => traverse(child));
    }
  }

  if (fileData.document) {
    traverse(fileData.document);
  }

  // Convert map to object
  effectMap.forEach((value, key) => {
    effectStyles[key] = value.shadows;
  });

  return effectStyles;
}

// Extract spacing values (padding, margin, gap) from nodes
function extractSpacingValues(fileData) {
  const spacingMap = new Map();
  const spacingSet = new Set();

  function traverse(node) {
    // Extract padding from Auto Layout
    if (node.layoutMode) {
      const paddingLeft = node.paddingLeft || 0;
      const paddingRight = node.paddingRight || 0;
      const paddingTop = node.paddingTop || 0;
      const paddingBottom = node.paddingBottom || 0;
      const gap = node.itemSpacing || 0;

      if (paddingLeft > 0) spacingSet.add(Math.round(paddingLeft));
      if (paddingRight > 0) spacingSet.add(Math.round(paddingRight));
      if (paddingTop > 0) spacingSet.add(Math.round(paddingTop));
      if (paddingBottom > 0) spacingSet.add(Math.round(paddingBottom));
      if (gap > 0) spacingSet.add(Math.round(gap));
    }

    // Extract absolute positioning (for margin-like values)
    if (node.absoluteBoundingBox && node.parent) {
      // This would require parent context, so we'll skip for now
    }

    if (node.children) {
      node.children.forEach(child => traverse(child));
    }
  }

  if (fileData.document) {
    traverse(fileData.document);
  }

  // Convert set to sorted array
  const spacingArray = Array.from(spacingSet).sort((a, b) => a - b);
  
  return {
    values: spacingArray,
    // Create common spacing scale
    scale: {
      xs: spacingArray.find(v => v >= 4) || 4,
      sm: spacingArray.find(v => v >= 8) || 8,
      md: spacingArray.find(v => v >= 16) || 16,
      lg: spacingArray.find(v => v >= 24) || 24,
      xl: spacingArray.find(v => v >= 32) || 32,
      xxl: spacingArray.find(v => v >= 40) || 40,
    }
  };
}

// Extract border radius values from nodes
function extractBorderRadius(fileData) {
  const radiusSet = new Set();

  function traverse(node) {
    if (node.cornerRadius !== undefined && node.cornerRadius > 0) {
      radiusSet.add(Math.round(node.cornerRadius));
    }

    // Check for individual corner radius
    if (node.rectangleCornerRadii) {
      node.rectangleCornerRadii.forEach(radius => {
        if (radius > 0) radiusSet.add(Math.round(radius));
      });
    }

    if (node.children) {
      node.children.forEach(child => traverse(child));
    }
  }

  if (fileData.document) {
    traverse(fileData.document);
  }

  const radiusArray = Array.from(radiusSet).sort((a, b) => a - b);

  return {
    values: radiusArray,
    scale: {
      small: radiusArray.find(v => v >= 8) || 8,
      medium: radiusArray.find(v => v >= 16) || 16,
      large: radiusArray.find(v => v >= 24) || 24,
      xlarge: radiusArray.find(v => v >= 32) || 32,
    }
  };
}

// Extract dimensions (width, height) from common components
function extractDimensions(fileData) {
  const dimensions = {
    buttons: { widths: new Set(), heights: new Set() },
    inputs: { widths: new Set(), heights: new Set() },
    cards: { widths: new Set(), heights: new Set() },
    icons: { sizes: new Set() },
  };

  function traverse(node) {
    const nodeName = (node.name || '').toLowerCase();
    const width = node.absoluteBoundingBox?.width || node.width;
    const height = node.absoluteBoundingBox?.height || node.height;

    // Categorize by node name patterns
    if (nodeName.includes('button') || nodeName.includes('btn')) {
      if (width) dimensions.buttons.widths.add(Math.round(width));
      if (height) dimensions.buttons.heights.add(Math.round(height));
    } else if (nodeName.includes('input') || nodeName.includes('field') || nodeName.includes('textfield')) {
      if (width) dimensions.inputs.widths.add(Math.round(width));
      if (height) dimensions.inputs.heights.add(Math.round(height));
    } else if (nodeName.includes('card')) {
      if (width) dimensions.cards.widths.add(Math.round(width));
      if (height) dimensions.cards.heights.add(Math.round(height));
    } else if (nodeName.includes('icon') && width === height) {
      dimensions.icons.sizes.add(Math.round(width));
    }

    if (node.children) {
      node.children.forEach(child => traverse(child));
    }
  }

  if (fileData.document) {
    traverse(fileData.document);
  }

  // Convert sets to sorted arrays
  return {
    buttons: {
      widths: Array.from(dimensions.buttons.widths).sort((a, b) => a - b),
      heights: Array.from(dimensions.buttons.heights).sort((a, b) => a - b),
    },
    inputs: {
      widths: Array.from(dimensions.inputs.widths).sort((a, b) => a - b),
      heights: Array.from(dimensions.inputs.heights).sort((a, b) => a - b),
    },
    cards: {
      widths: Array.from(dimensions.cards.widths).sort((a, b) => a - b),
      heights: Array.from(dimensions.cards.heights).sort((a, b) => a - b),
    },
    icons: {
      sizes: Array.from(dimensions.icons.sizes).sort((a, b) => a - b),
    },
  };
}

// Extract gradient details
function extractGradients(fileData) {
  const gradients = {};
  const gradientMap = new Map();

  function traverse(node) {
    if (node.fills && Array.isArray(node.fills)) {
      node.fills.forEach(fill => {
        if (fill.type === 'GRADIENT_LINEAR' || fill.type === 'GRADIENT_RADIAL') {
          const key = node.name || `gradient-${gradientMap.size}`;
          
          if (!gradientMap.has(key)) {
            const stops = fill.gradientStops.map(stop => ({
              position: stop.position,
              color: rgbaToHex(stop.color.r, stop.color.g, stop.color.b, stop.color.a || 1),
            }));

            gradientMap.set(key, {
              type: fill.type,
              gradientStops: stops,
              gradientHandlePositions: fill.gradientHandlePositions || [],
              name: key
            });
          }
        }
      });
    }

    if (node.children) {
      node.children.forEach(child => traverse(child));
    }
  }

  if (fileData.document) {
    traverse(fileData.document);
  }

  gradientMap.forEach((value, key) => {
    gradients[key] = value;
  });

  return gradients;
}

// Main function
async function main() {
  try {
    console.log('🚀 Figma token çıkarma başlatılıyor...\n');

    // Fetch styles and file data
    const styles = await fetchFileStyles();
    console.log(`✅ ${styles.length} stil bulundu\n`);

    const fileData = await fetchFileNodes();
    console.log('✅ Dosya içeriği alındı\n');

    // Store styles in fileData for reference
    fileData.styles = styles;

    // Extract tokens
    console.log('🎨 Token\'lar çıkarılıyor...\n');
    
    const colorStyles = extractColorStyles(fileData);
    const textStyles = extractTextStyles(fileData);
    const effectStyles = extractEffectStyles(fileData);
    const spacing = extractSpacingValues(fileData);
    const borderRadius = extractBorderRadius(fileData);
    const dimensions = extractDimensions(fileData);
    const gradients = extractGradients(fileData);

    // Create tokens object
    const tokens = {
      colors: colorStyles,
      typography: textStyles,
      effects: effectStyles,
      spacing: spacing,
      borderRadius: borderRadius,
      dimensions: dimensions,
      gradients: gradients,
      metadata: {
        extractedAt: new Date().toISOString(),
        fileKey: FIGMA_FILE_KEY,
        totalStyles: styles.length
      }
    };

    // Save to JSON file
    const outputPath = path.join(__dirname, '../src/theme/figma-tokens.json');
    const outputDir = path.dirname(outputPath);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(tokens, null, 2));
    
    console.log('✅ Token\'lar başarıyla çıkarıldı!\n');
    console.log(`📊 İstatistikler:`);
    console.log(`   - Renk stilleri: ${Object.keys(colorStyles).length}`);
    console.log(`   - Metin stilleri: ${Object.keys(textStyles).length}`);
    console.log(`   - Efekt stilleri: ${Object.keys(effectStyles).length}`);
    console.log(`   - Spacing değerleri: ${spacing.values.length}`);
    console.log(`   - Border radius değerleri: ${borderRadius.values.length}`);
    console.log(`   - Gradient stilleri: ${Object.keys(gradients).length}`);
    console.log(`\n📁 Dosya kaydedildi: ${outputPath}\n`);

  } catch (error) {
    console.error('\n❌ Hata oluştu:', error.message);
    process.exit(1);
  }
}

main();

