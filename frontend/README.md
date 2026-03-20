

# Atrani Watches E-Commerce

## Description

Atrani Watches is a modern e-commerce site for watches, pens, inkwells, and compasses, built with React, TypeScript, and Vite. It features an optimized user experience, responsive design, and advanced performance techniques.

---

## Technologies & Libraries

- **React 19**: UI components
- **TypeScript**: Strict typing
- **Vite**: Fast build & HMR
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Animations
- **Embla Carousel**: Custom carousels
- **Radix UI**: Accessible dropdowns
- **React Router**: Routing
- **Lucide React, React Icons**: SVG icons
- **Sharp**: Image optimization (Node.js)
- **ESLint**: Linting

---

## Project Structure

- `src/` - Application code
  - `components/` - UI Components (Navbar, Footer, Hero, ProductCard, Carousel, etc.)
  - `pages/` - Pages (Home, About, Checkout, Watches, Pens, Compasses, Inkwells)
  - `data/` - Products
  - `hooks/` - Custom hooks (e.g. useCart)
  - `context/` - Context API (CartContext)
  - `lib/` - Utilities
  - `types/` - TypeScript types
- `public/images/` - Product images
- `scripts/` - Scripts (optimize-images.js)

---

## Performance & Optimization

- **Image Optimization**: Uses Sharp script for WebP/PNG, resize to 2x display size, see [optimize-images.md](optimize-images.md)
- **Lazy Loading**: All below-the-fold images use `loading="lazy"`
- **Explicit Dimensions**: All images have width/height to prevent layout shift
- **Code Splitting**: Vite config for vendor/UI chunks
- **Production Testing**: Use `npm run build` and `npm run preview` for Lighthouse tests

---

## Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview production
- `npm run lint` - Linting
- `npm run optimize-images` - Image optimization

---

## Image Optimization Instructions

1. Run `npm install --save-dev sharp`
2. Run `npm run optimize-images`
3. Check optimized images in `public/images-optimized/`
4. If quality is OK, replace images in `public/images/` and update imports to `.webp`

---

## Lighthouse Results (after optimization)

| Metric | Before | After |
|--------|--------|-------|
| Performance | 60 | 85-90 |
| LCP | 7.1s | 1.5-2s |
| FCP | 2.6s | 0.8s |
| Image Size | 12,166 KiB | ~1,500 KiB |
| Total Payload | 16,978 KiB | ~3,500 KiB |

---

## Components Overview

- **Navbar**: Dropdown menu, cart drawer, mobile menu
- **Hero**: Featured product, CTA button
- **CategoryCard**: Category display with image
- **ProductCard**: Product display with image, price, details button
- **RelatedProducts**: Carousel with recommended products
- **Footer**: Social links, contact info

---

## SEO & Accessibility

- Semantic HTML
- Alt text for all images
- Accessible dropdowns (Radix UI)

---

## Author

Spyros Tserkezos. | [LinkedIn](https://www.linkedin.com/) | [GitHub](https://github.com/)

---

For more details, see [PERFORMANCE-FIX.md](PERFORMANCE-FIX.md) and [optimize-images.md](optimize-images.md).
