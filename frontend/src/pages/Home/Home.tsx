import Layout from '../../components/Layout';
import MotionSection from '../../components/MotionSection';
import { Suspense, lazy } from 'react';

const Hero = lazy(() => import('../../components/Hero'));
const ProductCategories = lazy(() => import('../../components/ProductCategories'));
const FeaturedProducts = lazy(() => import('../../components/FeaturedProducts'));
const About = lazy(() => import('../About/About'));

const Home = () => {
  return (
    <Layout>
      <Suspense fallback={<div style={{ height: '300px' }} />}>
        <MotionSection direction="left">
          <Hero />
        </MotionSection>
      </Suspense>

      <Suspense fallback={<div style={{ height: '200px' }} />}>
        <MotionSection direction="right">
          <ProductCategories />
        </MotionSection>
      </Suspense>

      <div className="h-16 md:h-24" />

      <Suspense fallback={<div style={{ height: '200px' }} />}>
        <MotionSection direction="right">
          <About />
        </MotionSection>
      </Suspense>

      <div className="h-16 md:h-24" />

      {/* FeaturedProducts — above footer with fade-out to dark */}
      <Suspense fallback={<div style={{ height: '200px' }} />}>
        <MotionSection direction="left">
          <div style={{ position: 'relative', paddingBottom: '60px' }}>
            <FeaturedProducts />

          </div>
        </MotionSection>
      </Suspense>
    </Layout>
  );
};

export default Home;