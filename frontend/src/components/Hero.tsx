import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section 
      className="bg-background flex items-center justify-center overflow-hidden relative"
      style={{ padding: '4rem 0 8rem 0', minHeight: '90vh', borderTop: 'none', borderLeft: '1px solid rgba(255, 255, 255, 0.1)', borderRight: '1px solid rgba(255, 255, 255, 0.1)' }}
    >
      <div 
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-8 px-4 md:px-16 items-center"
        style={{ alignItems: 'flex-start' }}
      >
        <div className="flex items-start justify-center md:justify-start">
          <div className="md:px-10 text-center md:text-left hero-text-block" style={{ marginTop: 'clamp(-1rem, -2vw, -2rem)' }}>
            <span className="uppercase tracking-[0.5em] text-xs" style={{ color: '#A67C52', marginLeft: '0.35rem' }}>Featured Timepiece</span>
            <h1 className="text-4xl md:text-6xl font-bold mt-4 mb-2 leading-tight tracking-wide text-white">
              OLD TOWN<br/>POCKET WATCH
              <div style={{ height: '20px' }}></div>
            </h1>
            <p className="text-white/50 text-sm tracking-wider mb-6" style={{ fontFamily: 'monospace' }}>REF. OT-1883</p>
            <div style={{ height: '20px' }}></div>
            <p className="text-white/70 max-w-md text-base md:text-lg leading-relaxed mx-auto md:mx-0 mt-4 md:mt-0">
              A restored masterpiece from 1883. Where timeless craftsmanship meets the golden age of horology.
            </p>
            {/* Desktop button (under text, left column) */}
            <div className="hidden md:flex justify-center md:justify-start">
              <Link to="/watches/pocket">
                <Button 
                  variant="outline"
                  className="bg-[#A67C52] text-white hover:text-white uppercase tracking-widest text-sm font-bold hover:bg-[#8a5e3a] transition border-none cursor-pointer rounded-md"
                  style={{ paddingLeft: '4rem', paddingRight: '4rem', paddingTop: '1.5rem', paddingBottom: '1.5rem', marginTop: '2rem' }}
                  aria-label="View product details"
                >
                  VIEW PRODUCT
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center" style={{ marginTop: '1rem' }}>
          <img 
            src="/images/watches/main-image.webp" 
            alt="Old Town Pocket Watch" 
            className="w-64 sm:w-80 md:w-130 h-64 sm:h-80 md:h-130 object-contain hero-watch-image" 
            width="520"
            height="520"
            fetchPriority="high"
          />
          {/* Mobile button (under image) */}
          <div className="flex md:hidden justify-center" style={{ marginTop: '3.5rem' }}>
            <Link to="/watches/pocket">
              <Button 
                variant="outline"
                className="bg-[#A67C52] text-white hover:text-white uppercase tracking-widest text-sm font-bold hover:bg-[#8a5e3a] transition border-none cursor-pointer rounded-md"
                style={{ paddingLeft: '4rem', paddingRight: '4rem', paddingTop: '1.5rem', paddingBottom: '1.5rem' }}
                aria-label="View product details"
              >
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .hero-watch-image {
            transform: translate(-40px, 24px) scale(1.08);
          }

          .hero-text-block {
            transform: translate(16px, -12px);
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
