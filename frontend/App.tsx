import './App.css';
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import BackToTop from './components/BackToTop';
import ScrollToTop from './components/ScrollToTop';
import ProductDetailPage from './pages/Products/ProductDetailPage';
import { Analytics } from "@vercel/analytics/react";
import Home from './pages/Home/Home';
import NotFound from './pages/NotFound/NotFound';

const Atrani       = lazy(() => import('./pages/Watches/Atrani'));
const Luxury       = lazy(() => import('./pages/Watches/Luxury'));
const Smartwatches = lazy(() => import('./pages/Watches/Smartwatches'));
const Pocket       = lazy(() => import('./pages/Watches/Pocket'));
const QuillPens    = lazy(() => import('./pages/Pens/Quill'));
const FountainPens = lazy(() => import('./pages/Pens/Fountain'));
const Compasses    = lazy(() => import('./pages/Compasses/Compasses'));
const Inkwells     = lazy(() => import('./pages/Inkwells/Inkwells'));
const Checkout     = lazy(() => import('./pages/Checkout/Checkout'));

// Simple fallback while page loads
const PageLoader = () => (
  <div className="w-full min-h-screen flex items-center justify-center bg-[#F1F1F1]">
    <div
      style={{
        width: '40px',
        height: '40px',
        border: '3px solid #e0d6c8',
        borderTop: '3px solid #C8874A',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}
    />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

function App() {
  return (
    <CartProvider>
      <Analytics />
      <div style={{ position: 'relative', minHeight: '100vh', background: '#F1F1F1' }}>
        <BackToTop />
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Main site pages */}
            <Route path="/"     element={<Home />} />
            <Route path="/home" element={<Home />} />

            {/* Product category pages */}
            <Route path="/watches/atrani"        element={<Atrani />} />
            <Route path="/watches/luxury"       element={<Luxury />} />
            <Route path="/watches/smartwatches" element={<Smartwatches />} />
            <Route path="/watches/pocket"       element={<Pocket />} />
            <Route path="/pens/quill"           element={<QuillPens />} />
            <Route path="/pens/fountain"        element={<FountainPens />} />
            <Route path="/compasses"            element={<Compasses />} />
            <Route path="/inkwells"             element={<Inkwells />} />
            <Route path="/checkout"             element={<Checkout />} />

            {/* Product details (specific first, general last) */}
            <Route path="/watches/luxury/:id"       element={<ProductDetailPage category="watches/luxury" />} />
            <Route path="/watches/smartwatches/:id" element={<ProductDetailPage category="watches/smartwatches" />} />
            <Route path="/watches/pocket/:id"       element={<ProductDetailPage category="watches/pocket" />} />
            <Route path="/pens/quill/:id"           element={<ProductDetailPage category="quillPens" />} />
            <Route path="/pens/fountain/:id"        element={<ProductDetailPage category="fountainPens" />} />
            <Route path="/compasses/:id"            element={<ProductDetailPage category="compasses" />} />
            <Route path="/inkwells/:id"             element={<ProductDetailPage category="inkwells" />} />
            <Route path="/watches/:id"              element={<ProductDetailPage category="watches" />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </CartProvider>
  );
}

export default App;