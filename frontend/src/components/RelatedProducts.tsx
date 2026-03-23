import React, { useMemo, useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import ViewDetailsButton from '@/components/ui/ViewDetailsButton';
import { Link } from 'react-router-dom';

interface RelatedProductsProps {
  currentProductId: string;
}

interface FlatProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

function getProductPath(category: string, id: string): string {
  switch (category) {
    case 'watches/luxury':       return `/watches/luxury/${id}`;
    case 'watches/smartwatches': return `/watches/smartwatches/${id}`;
    case 'watches/pocket':       return `/watches/pocket/${id}`;
    case 'watches':              return `/watches/${id}`;
    case 'quillPens':            return `/pens/quill/${id}`;
    case 'fountainPens':         return `/pens/fountain/${id}`;
    case 'compasses':            return `/compasses/${id}`;
    case 'inkwells':             return `/inkwells/${id}`;
    default:                     return `/products/${id}`;
  }
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ currentProductId }) => {
  const [allProducts, setAllProducts] = useState<FlatProduct[]>([]);

  useEffect(() => {
    fetch('https://api.spyros-tserkezos.dev/api/products')
      .then(res => res.json())
      .then(data => {
        const mapped: FlatProduct[] = data.map((p: any) => ({
          id: p.slug ?? p.id.toString(),
          name: p.name,
          price: parseFloat(p.price),
          image: p.image_url,
          category: p.category,
        }));
        setAllProducts(mapped);
      })
      .catch(() => {});
  }, []);

  const randomProducts = useMemo(() => {
    const filtered = allProducts.filter(p => String(p.id) !== String(currentProductId));
    return shuffleArray(filtered).slice(0, 8);
  }, [allProducts, currentProductId]);

  const viewportRef = React.useRef<HTMLDivElement>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: false,
    slidesToScroll: 1,
    containScroll: 'trimSnaps',
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el || !emblaApi) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) emblaApi.scrollNext();
      else emblaApi.scrollPrev();
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    let direction = 1;
    let userInteracted = false;

    const stopOnInteraction = () => { userInteracted = true; };

    const interval = setInterval(() => {
      if (userInteracted) return;

      if (direction === 1 && !emblaApi.canScrollNext()) {
        direction = -1;
      } else if (direction === -1 && !emblaApi.canScrollPrev()) {
        direction = 1;
      }

      if (direction === 1) emblaApi.scrollNext();
      else emblaApi.scrollPrev();
    }, 2500);

    emblaApi.on('pointerDown', stopOnInteraction);
    viewportRef.current?.addEventListener('wheel', stopOnInteraction);

    return () => {
      clearInterval(interval);
      emblaApi.off('pointerDown', stopOnInteraction);
      viewportRef.current?.removeEventListener('wheel', stopOnInteraction);
    };
  }, [emblaApi]);

  const arrowStyle = (active: boolean): React.CSSProperties => ({
    position: 'absolute',
    top: '45%',
    transform: 'translateY(-50%)',
    zIndex: 10,
    background: 'none',
    border: 'none',
    cursor: active ? 'pointer' : 'default',
    color: active ? '#C8874A' : '#d1c4b0',
    fontSize: '3rem',
    fontFamily: 'Cormorant Garamond, serif',
    fontWeight: 300,
    lineHeight: 1,
    padding: '0 4px',
    transition: 'color 0.2s ease',
    userSelect: 'none',
  });

  const cardWidth = typeof window !== 'undefined' && window.innerWidth < 640 ? '72vw' : '220px';

  return (
    <div style={{ width: '100%' }}>
      <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', fontWeight: 300, color: '#1a1208', letterSpacing: '0.01em', marginBottom: '2rem', textAlign: 'center' }}>
        You may also like
      </h2>

      <div style={{ position: 'relative', paddingLeft: '40px', paddingRight: '40px' }}>
        <button onClick={() => emblaApi?.scrollPrev()} aria-label="Previous" className="hidden sm:block" style={{ ...arrowStyle(canScrollPrev), left: 0 }}>‹</button>
        <button onClick={() => emblaApi?.scrollNext()} aria-label="Next" className="hidden sm:block" style={{ ...arrowStyle(canScrollNext), right: 0 }}>›</button>

        <div ref={(el) => { emblaRef(el); (viewportRef as any).current = el; }} style={{ overflow: 'hidden', paddingBottom: '8px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            {randomProducts.map((product) => (
              <div
                key={product.id}
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  flexShrink: 0,
                  width: cardWidth,
                  background: '#fff',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  border: '1px solid rgba(200,135,74,0.12)',
                  boxShadow: hoveredId === product.id ? '0 12px 36px rgba(60,40,10,0.14)' : '0 4px 20px rgba(60,40,10,0.07)',
                  transform: hoveredId === product.id ? 'translateY(-3px)' : 'translateY(0)',
                  transition: 'box-shadow 0.3s ease, transform 0.3s ease',
                }}
              >
                <div style={{ height: '200px', overflow: 'hidden', background: '#f5f0ea' }}>
                  <Link to={getProductPath(product.category, product.id)} style={{ display: 'block', height: '100%' }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hoveredId === product.id ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.5s ease' }}
                      loading="lazy"
                    />
                  </Link>
                </div>
                <div style={{ padding: '0.9rem 0.9rem 1rem' }}>
                  <div style={{ width: '24px', height: '1px', background: '#C8874A', marginBottom: '0.5rem' }} />
                  <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '0.95rem', fontWeight: 400, color: '#1a1208', lineHeight: 1.25, marginBottom: '0.3rem' }}>{product.name}</p>
                  <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '0.75rem', fontWeight: 300, color: '#9a8a78', marginBottom: '0.75rem', letterSpacing: '0.03em' }}>€{product.price.toLocaleString('el-GR')}</p>
                  <ViewDetailsButton path={getProductPath(product.category, product.id)} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {scrollSnaps.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '1.5rem' }}>
          {scrollSnaps.map((_, i) => (
            <button key={i} onClick={() => emblaApi?.scrollTo(i)} aria-label={`Go to slide ${i + 1}`} style={{ width: i === selectedIndex ? '28px' : '6px', height: '6px', borderRadius: '9999px', backgroundColor: i === selectedIndex ? '#C8874A' : '#d1c4b0', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s ease' }} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;