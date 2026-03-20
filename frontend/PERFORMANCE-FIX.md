# 🚀 Performance Optimization - Quick Start

## 📊 Current Issues

Your Lighthouse score is **60/100** mainly due to:

1. **🖼️ Oversized Images** - 12,078 KiB waste (83% of the problem)
2. **⚠️ Testing dev server** - Need to test production build
3. **📱 LCP image priority** - Already fixed ✅

---

## ⚡ Quick Fix (5 minutes)

### Step 1: Install Sharp
```bash
npm install --save-dev sharp
```

### Step 2: Optimize Images
```bash
npm run optimize-images
```

This will:
- Resize images to proper dimensions
- Convert to WebP format (50-70% smaller)
- Create optimized PNGs as fallback
- Save to `public/images-optimized/`

### Step 3: Review & Replace
1. Check `public/images-optimized/` folder
2. If happy with quality, copy optimized files to `public/images/`
3. Update component imports to use `.webp` extensions

### Step 4: Test Production Build
```bash
npm run build
npm run preview
```

Then run Lighthouse on `http://localhost:4173` (preview server, not dev server)

---

## 📈 Expected Results

| Metric | Before | After |
|--------|--------|-------|
| Performance Score | 60 | 85-90 |
| LCP | 7.1s | 1.5-2s |
| FCP | 2.6s | 0.8s |
| Image Size | 12,166 KiB | ~1,500 KiB |
| Total Payload | 16,978 KiB | ~3,500 KiB |

---

## 🎯 What Was Fixed

### ✅ Code Optimizations (Already Done)
- [x] Added explicit width/height to all images (prevents layout shift)
- [x] Added lazy loading to below-fold images
- [x] Set `fetchpriority="high"` on LCP image (hero)
- [x] Configured Vite build optimization
- [x] Enabled code splitting for vendor/UI chunks
- [x] Fixed TypeScript type imports

### 🖼️ Images Need Manual Optimization
- [ ] Resize compass1.png: 2008×1653 → 668×550 (saves 7,704 KiB)
- [ ] Resize main-inkwell.png: 2298×3756 → 196×320 (saves 1,782 KiB)
- [ ] Resize main-compass.png: 761×1000 → 244×320 (saves 876 KiB)
- [ ] Resize all other images (saves 2,716 KiB)

**Total potential savings: 13,078 KiB → ~1,500 KiB**

---

## 🔄 Alternative: Manual Optimization

If you prefer not to use the script:

### Option 1: Squoosh (Online, No Install)
1. Go to https://squoosh.app/
2. Upload each image
3. Set format to WebP, quality 85%
4. Resize to target dimensions (see [optimize-images.md](optimize-images.md))
5. Download and replace

### Option 2: TinyPNG (PNG compression)
1. Go to https://tinypng.com/
2. Upload images
3. Download compressed versions

---

## ⚠️ Important Notes

1. **Always test production build**, not dev server:
   ```bash
   npm run build && npm run preview
   ```
   Dev server shows false warnings about minification.

2. **Keep original images** - Save high-res originals in a backup folder

3. **2x rule** - We resize to 2x display size for retina screens

4. **WebP support** - 96%+ browser support. PNG as fallback.

---

## 🤔 Why Are My Images So Large?

Your images are **4-20x larger** than needed:

- **compass1.png**: 2008px wide, displayed at 334px = **6x oversized**
- **main-inkwell.png**: 2298px wide, displayed at 98px = **23x oversized** 🚨

This is like serving a 4K video when you only need 480p.

---

## 📞 Need Help?

1. Check [optimize-images.md](optimize-images.md) for detailed guide
2. Review the optimization script: `scripts/optimize-images.js`
3. Test results with Lighthouse in production mode

**Next step:** Run `npm install --save-dev sharp && npm run optimize-images`
