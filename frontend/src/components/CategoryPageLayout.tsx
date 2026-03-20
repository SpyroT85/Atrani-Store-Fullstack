import { memo } from 'react';
import Layout from '@/components/Layout';
import MotionSection from '@/components/MotionSection';
import ViewDetailsButton from '@/components/ui/ViewDetailsButton';

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  code?: string;
}

interface CategoryPageLayoutProps {
  title: string;
  products: Product[];
  basePath: string;
  fontFamily?: string;
}

const CategoryPageLayout = memo(({
  title,
  products,
  basePath,
}: CategoryPageLayoutProps) => {
  return (
    <Layout>
      {/* Top banner */}
      <section className="p-0 m-0">
        <div
          className="w-full bg-background flex items-center justify-center overflow-hidden relative"
          style={{
            minHeight: '22vh',
            padding: '3rem 1rem 6rem 1rem',
            borderLeft: '1px solid rgba(255,255,255,0.1)',
            borderRight: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <h1
            className="text-white tracking-tight drop-shadow-lg"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontWeight: 300,
              textAlign: 'center',
              fontSize: 'clamp(40px, 8vw, 80px)',
              letterSpacing: '0.02em',
            }}
          >
            {title}
          </h1>
        </div>
      </section>

      <div className="h-10 md:h-24" />

      {/* Product list rows */}
      <div className="flex flex-col w-full gap-12 md:gap-20 px-4 md:px-0">
        {products.map((product, index) => {
          const isOdd = index % 2 === 1;

          const imageBlock = (
            <div
              className="rounded-2xl overflow-hidden bg-gray-50 shadow-lg flex-shrink-0 w-full"
              style={{
                width: '100%',
                maxWidth: '520px',
                aspectRatio: '1 / 1',
                margin: '0 auto',
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                className="object-cover w-full h-full"
                loading="lazy"
              />
            </div>
          );

          const infoBlock = (
            <div className="flex flex-col items-center md:items-start text-center md:text-left px-0 md:px-8 w-full">
              {product.code && (
                <p style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#C8874A',
                  marginBottom: '1.25rem',
                }}>
                  {product.code}
                </p>
              )}

              {/* Gold line divider */}
              <div style={{ width: '48px', height: '1px', background: '#C8874A', marginBottom: '2rem' }} />

              <h2 style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(30px, 4.5vw, 58px)',
                fontWeight: 300,
                lineHeight: 1.05,
                color: '#1a1208',
                marginBottom: '1.5rem',
                letterSpacing: '-0.01em',
              }}>
                {product.name}
              </h2>

              <p style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: '0.95rem',
                fontWeight: 300,
                lineHeight: 1.85,
                color: '#5a4e42',
                marginBottom: '2rem',
              }}>
                {product.description}
              </p>

              <p style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '2rem',
                fontWeight: 300,
                color: '#2a2118',
                letterSpacing: '0.02em',
                marginBottom: '1.5rem',
              }}>
                <span style={{ fontSize: '1.1rem', verticalAlign: 'super', marginRight: '2px', fontWeight: 400 }}>€</span>
                {product.price.toLocaleString('el-GR')}
              </p>

              <div className="flex justify-center md:justify-start w-full md:w-auto">
                <div style={{ width: '210px' }}>
                  <ViewDetailsButton path={`${basePath}/${product.id}`} />
                </div>
              </div>
            </div>
          );

          return (
            <MotionSection direction={isOdd ? 'right' : 'left'} key={product.id}>
              <div className="w-full flex justify-center">
                {/* Mobile layout: image and info centered */}
                <div className="flex flex-col md:hidden items-center gap-6 w-full" style={{ padding: '0 24px' }}>
                  <div
                    className="rounded-2xl overflow-hidden bg-gray-50 shadow-md"
                    style={{ width: '200px', height: '200px', flexShrink: 0 }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  </div>
                  <div style={{ width: '100%' }}>
                    {infoBlock}
                  </div>
                </div>

                {/* Desktop layout: alternating sections */}
                <div
                  className={`hidden md:grid grid-cols-2 items-center gap-x-16 max-w-6xl w-full`}
                  style={{ minHeight: '520px' }}
                >
                  {isOdd ? (
                    <>{infoBlock}{imageBlock}</>
                  ) : (
                    <>{imageBlock}{infoBlock}</>
                  )}
                </div>
              </div>
            </MotionSection>
          );
        })}
      </div>

      <div className="h-16 md:h-14" />
    </Layout>
  );
});

CategoryPageLayout.displayName = 'CategoryPageLayout';

export default CategoryPageLayout;