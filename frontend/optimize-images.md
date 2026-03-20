# Image Optimization Guide

## 🚨 Critical Issue: Images Too Large (12,078 KiB savings)

Your images are **significantly oversized** for their display dimensions. This is the #1 performance bottleneck.

## 📊 Current Problems

| Image | Actual Size | Displayed Size | Waste | File Size |
|-------|-------------|----------------|-------|-----------|
| compass1.png | 2008×1653 | 334×275 | 96% | 7,719 KiB |
| main-inkwell.png | 2298×3756 | 98×160 | 99% | 1,785 KiB |
| main-compass.png | 761×1000 | 122×160 | 85% | 879 KiB |
| product-watch.png | 419×600 | 112×160 | 73% | 381 KiB |
| watch2.png | 800×800 | 320×320 | 60% | 381 KiB |
| main-image.png | 419×600 | 291×416 | 31% | 381 KiB |
| pen1.png | 861×736 | 278×237 | 68% | 273 KiB |
| main-pen.png | 600×600 | 160×160 | 73% | 214 KiB |
| inkwell1.png | 1024×799 | 328×256 | 68% | 154 KiB |

## ✅ Solutions

### Option 1: Online Tools (Easiest)
1. **Squoosh** (https://squoosh.app/)
   - Drag and drop images
   - Convert to WebP format
   - Resize to 2x display dimensions
   - Adjust quality to 80-85%

2. **TinyPNG** (https://tinypng.com/)
   - Batch compress PNG files
   - Maintains transparency

### Option 2: Command Line (Recommended for batch processing)

#### Install Sharp (Node.js image processor)
```bash
npm install --save-dev sharp
```

#### Create optimization script
Create `scripts/optimize-images.js`:

```javascript
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const targetSizes = {
  'compass1.png': { width: 668, height: 550 },      // 2x display size
  'main-inkwell.png': { width: 196, height: 320 },
  'main-compass.png': { width: 244, height: 320 },
  'product-watch.png': { width: 224, height: 320 },
  'watch2.png': { width: 640, height: 640 },
  'main-image.png': { width: 582, height: 832 },
  'pen1.png': { width: 556, height: 474 },
  'main-pen.png': { width: 320, height: 320 },
  'inkwell1.png': { width: 656, height: 512 }
};

async function optimizeImages() {
  const publicDir = path.join(__dirname, '../public/images');
  const outputDir = path.join(__dirname, '../public/images-optimized');
  
  await fs.mkdir(outputDir, { recursive: true });
  
  for (const [filename, dimensions] of Object.entries(targetSizes)) {
    const inputPath = path.join(publicDir, filename);
    const outputPath = path.join(outputDir, filename.replace('.png', '.webp'));
    
    try {
      await sharp(inputPath)
        .resize(dimensions.width, dimensions.height, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality: 85 })
        .toFile(outputPath);
      
      const stats = await fs.stat(outputPath);
      console.log(`✓ ${filename} → ${(stats.size / 1024).toFixed(2)} KiB`);
    } catch (error) {
      console.error(`✗ Failed to process ${filename}:`, error.message);
    }
  }
  
  console.log('\\n✅ Optimization complete! Check public/images-optimized/');
}

optimizeImages();
```

#### Run the script
```bash
node scripts/optimize-images.js
```

### Option 3: Photoshop/GIMP
1. Open each image
2. Image → Image Size → Resize to 2x display dimensions
3. Export as WebP (85% quality)
4. Or Export as PNG with "Save for Web"

## 🔄 After Optimization

### Update image references to WebP:
```tsx
// Before
<img src="/images/compass1.png" />

// After
<img src="/images/compass1.webp" />
```

### Add fallback for older browsers:
```tsx
<picture>
  <source srcset="/images/compass1.webp" type="image/webp" />
  <img src="/images/compass1.png" alt="Compass" />
</picture>
```

## 📈 Expected Results

After optimization:
- **Performance score**: 60 → 85-90
- **Image payload**: 16,978 KiB → ~2,000 KiB
- **LCP time**: 7.1s → ~1.5s
- **FCP time**: 2.6s → ~0.8s

## ⚠️ Important Notes

1. **Test production build** - Run `npm run build && npm run preview` instead of `npm run dev`
2. **Keep originals** - Save original high-res images in a separate folder
3. **2x rule** - Resize to 2x the display size for retina screens
4. **WebP format** - 30-50% smaller than PNG with same quality

## 🎯 Priority Order

1. **compass1.png** (7,719 KiB) - CRITICAL
2. **main-inkwell.png** (1,785 KiB) - CRITICAL
3. **main-compass.png** (879 KiB) - HIGH
4. **main-image.png** (381 KiB) - HIGH (LCP image)
5. All others - MEDIUM
