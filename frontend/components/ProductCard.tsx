import React from 'react';

interface ProductCardProps {
  name: string;
  description: string;
  image?: string;
  reverse?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, description, image, reverse = false }) => (
  <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center justify-center bg-white overflow-hidden w-full mx-auto gap-8 md:gap-24`} style={{ maxWidth: '1100px' }}>
    <div className="shrink-0 bg-gray-100 flex items-center justify-center rounded-2xl overflow-hidden w-full max-w-sm md:max-w-none" style={{ width: '100%', maxWidth: 'min(450px, 100%)', height: 'auto', aspectRatio: '1/1' }}>
      <style>{`
        @media (max-width: 768px) {
          .product-card-image {
            width: 90vw !important;
            max-width: 400px !important;
            height: auto !important;
            display: block !important;
            margin-left: auto !important;
            margin-right: auto !important;
          }
        }
      `}</style>
      {image ? (
        <img src={image} alt={name} className="object-cover w-full h-full sm:w-[90vw] sm:max-w-100 sm:mx-auto" width="450" height="450" loading="lazy" />
      ) : (
        <div className="w-full h-full bg-linear-to-br from-gray-200 to-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-lg">[Image]</span>
        </div>
      )}
    </div>
    <div className="flex-1 flex flex-col justify-center px-4 md:px-8">
      <p className="text-accent font-semibold uppercase tracking-[0.5em] text-xs mb-4">New Product</p>
      <h2 className="text-white font-bold mb-6" style={{ fontSize: 'clamp(32px, 6vw, 56px)', lineHeight: '1.1' }}>{name}</h2>
      <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-8">
        {description}
      </p>
      <button className="bg-accent text-white px-8 py-3 uppercase tracking-widest text-sm font-bold hover:bg-accentLight transition-colors rounded w-fit">
        View Details
      </button>
    </div>
  </div>
);

export default ProductCard;
