const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// Target sizes based on actual display dimensions (2x for retina)
const targetSizes = {
  'compass1.png': { width: 668, height: 550 },      // Displayed: 334×275
  'main-inkwell.png': { width: 196, height: 320 },  // Displayed: 98×160
  'main-compass.png': { width: 244, height: 320 },  // Displayed: 122×160
  'product-watch.png': { width: 224, height: 320 }, // Displayed: 112×160
  'watch2.png': { width: 640, height: 640 },        // Displayed: 320×320
  'main-image.png': { width: 582, height: 832 },    // Displayed: 291×416
  'pen1.png': { width: 556, height: 474 },          // Displayed: 278×237
  'main-pen.png': { width: 320, height: 320 },      // Displayed: 160×160
  'inkwell1.png': { width: 656, height: 512 }       // Displayed: 328×256
};

async function optimizeImages() {
  const publicDir = path.join(__dirname, '../public/images');
  const outputDir = path.join(__dirname, '../public/images-optimized');
  
  console.log('🖼️  Starting image optimization...\n');
  
  // Create output directory
  await fs.mkdir(outputDir, { recursive: true });
  
  let totalSavings = 0;
  let originalTotal = 0;
  
  for (const [filename, dimensions] of Object.entries(targetSizes)) {
    const inputPath = path.join(publicDir, filename);
    const outputPathWebp = path.join(outputDir, filename.replace('.png', '.webp'));
    const outputPathPng = path.join(outputDir, filename);
    
    try {
      // Check if input file exists
      const inputStats = await fs.stat(inputPath);
      originalTotal += inputStats.size;
      
      // Convert to WebP (best compression)
      await sharp(inputPath)
        .resize(dimensions.width, dimensions.height, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality: 85 })
        .toFile(outputPathWebp);
      
      const webpStats = await fs.stat(outputPathWebp);
      
      // Also create optimized PNG as fallback
      await sharp(inputPath)
        .resize(dimensions.width, dimensions.height, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .png({ quality: 85, compressionLevel: 9 })
        .toFile(outputPathPng);
      
      const pngStats = await fs.stat(outputPathPng);
      
      const savings = inputStats.size - webpStats.size;
      totalSavings += savings;
      const savingsPercent = ((savings / inputStats.size) * 100).toFixed(1);
      
      console.log(`✓ ${filename}`);
      console.log(`  Original: ${(inputStats.size / 1024).toFixed(2)} KiB (${dimensions.width}×${dimensions.height})`);
      console.log(`  WebP:     ${(webpStats.size / 1024).toFixed(2)} KiB (${savingsPercent}% smaller)`);
      console.log(`  PNG:      ${(pngStats.size / 1024).toFixed(2)} KiB\n`);
      
    } catch (error) {
      console.error(`✗ Failed to process ${filename}:`, error.message);
    }
  }
  
  console.log('═══════════════════════════════════════');
  console.log(`📊 Total original size:    ${(originalTotal / 1024).toFixed(2)} KiB`);
  console.log(`📊 Total optimized size:   ${((originalTotal - totalSavings) / 1024).toFixed(2)} KiB`);
  console.log(`💾 Total savings:          ${(totalSavings / 1024).toFixed(2)} KiB (${((totalSavings / originalTotal) * 100).toFixed(1)}%)`);
  console.log('═══════════════════════════════════════\n');
  console.log('✅ Optimization complete!');
  console.log('📁 Optimized images saved to: public/images-optimized/\n');
  console.log('Next steps:');
  console.log('1. Review the optimized images');
  console.log('2. Replace files in public/images/ with optimized versions');
  console.log('3. Update image paths from .png to .webp in components');
  console.log('4. Keep .png files as fallback for older browsers');
}

optimizeImages().catch(console.error);
