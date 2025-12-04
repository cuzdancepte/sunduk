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

// Fetch specific node data with geometry
async function fetchNodeData(nodeId) {
  try {
    console.log(`📡 Node ${nodeId} verileri alınıyor...`);
    
    // Geometry parametresi ile child node'ları da al
    const response = await axios.get(
      `${API_BASE}/files/${FIGMA_FILE_KEY}/nodes?ids=${nodeId}&geometry=paths`,
      {
        headers: {
          'X-Figma-Token': FIGMA_TOKEN
        }
      }
    );

    return response.data.nodes[nodeId];
  } catch (error) {
    console.error('❌ Node verileri alınırken hata:', error.response?.data || error.message);
    throw error;
  }
}

// Fetch full file to get all nodes
async function fetchFullFile() {
  try {
    console.log('📡 Tüm dosya içeriği alınıyor...');
    
    const response = await axios.get(
      `${API_BASE}/files/${FIGMA_FILE_KEY}`,
      {
        headers: {
          'X-Figma-Token': FIGMA_TOKEN
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('❌ Dosya içeriği alınırken hata:', error.response?.data || error.message);
    throw error;
  }
}

// Find node by ID in full file
function findNodeById(fileData, targetId) {
  let foundNode = null;

  function traverse(node) {
    if (node.id === targetId) {
      foundNode = node;
      return;
    }

    if (node.children) {
      node.children.forEach(child => traverse(child));
    }
  }

  if (fileData.document) {
    traverse(fileData.document);
  }

  return foundNode;
}

// Extract layout data from node
function extractLayoutData(nodeObj, depth = 0) {
  const node = nodeObj.document || nodeObj;
  if (!node) return null;

  const layout = {
    id: node.id,
    name: node.name,
    type: node.type,
    // Position and size
    position: {
      x: node.absoluteBoundingBox?.x || 0,
      y: node.absoluteBoundingBox?.y || 0,
      width: node.absoluteBoundingBox?.width || 0,
      height: node.absoluteBoundingBox?.height || 0,
    },
    // Layout properties (Auto Layout)
    layout: {
      layoutMode: node.layoutMode || null, // 'HORIZONTAL' | 'VERTICAL' | null
      paddingLeft: node.paddingLeft || 0,
      paddingRight: node.paddingRight || 0,
      paddingTop: node.paddingTop || 0,
      paddingBottom: node.paddingBottom || 0,
      itemSpacing: node.itemSpacing || 0, // gap between items
      primaryAxisAlignItems: node.primaryAxisAlignItems || null,
      counterAxisAlignItems: node.counterAxisAlignItems || null,
    },
    // Border radius
    borderRadius: node.cornerRadius || 0,
    // Background
    fills: node.fills || [],
    // Effects (shadows)
    effects: node.effects || [],
    // Text content (if TEXT node)
    textContent: node.characters || null,
    // Style (if TEXT node)
    textStyle: node.style ? {
      fontSize: node.style.fontSize,
      fontWeight: node.style.fontWeight,
      fontFamily: node.style.fontFamily,
      lineHeight: node.style.lineHeightPx || node.style.lineHeightPercentFontSize,
      letterSpacing: node.style.letterSpacing,
    } : null,
    // Children
    children: [],
  };

  // Recursively extract children
  if (node.children && Array.isArray(node.children)) {
    node.children.forEach((child) => {
      const childData = extractLayoutData({ document: child }, depth + 1);
      if (childData) {
        layout.children.push(childData);
      }
    });
  }

  return layout;
}

// Main function
async function main() {
  try {
    // Node ID'yi formatla: "2527-174" -> "2527:174"
    let nodeId = process.argv[2] || '2527:174'; // Default: Language Selection Screen
    nodeId = nodeId.replace('-', ':'); // URL formatından API formatına çevir
    
    console.log('🚀 Figma ekran verileri çıkarılıyor...\n');
    console.log(`📱 Node ID: ${nodeId}\n`);

    // Önce tüm dosyayı çek, sonra spesifik node'u bul
    const fileData = await fetchFullFile();
    const targetNode = findNodeById(fileData, nodeId);
    
    if (!targetNode) {
      console.error('❌ Node bulunamadı');
      process.exit(1);
    }

    console.log('✅ Node bulundu\n');
    console.log(`📋 Node adı: ${targetNode.name}`);
    console.log(`📋 Node tipi: ${targetNode.type}\n`);
    
    // Tüm child node'ları listele
    console.log('🔍 Child node\'lar taranıyor...\n');
    function listAllChildren(node, depth = 0) {
      const indent = '  '.repeat(depth);
      console.log(`${indent}${node.type}: ${node.name} (ID: ${node.id})`);
      
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach(child => {
          listAllChildren(child, depth + 1);
        });
      }
    }
    
    listAllChildren(targetNode);
    console.log('\n');
    
    const layoutData = extractLayoutData({ document: targetNode });
    
    // Save to JSON file
    const outputPath = path.join(__dirname, '../src/theme/figma-screen-data.json');
    const outputDir = path.dirname(outputPath);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(layoutData, null, 2));
    
    console.log('✅ Ekran verileri başarıyla çıkarıldı!\n');
    console.log(`📁 Dosya kaydedildi: ${outputPath}\n`);
    console.log(`📊 Ekran Bilgileri:`);
    console.log(`   - İsim: ${layoutData.name}`);
    console.log(`   - Boyut: ${layoutData.position.width} x ${layoutData.position.height}`);
    console.log(`   - Child sayısı: ${layoutData.children.length}\n`);

  } catch (error) {
    console.error('\n❌ Hata oluştu:', error.message);
    process.exit(1);
  }
}

main();

