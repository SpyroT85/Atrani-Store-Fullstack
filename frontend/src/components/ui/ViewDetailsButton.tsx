import React from 'react';
import { HiArrowRight } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';

interface ViewDetailsButtonProps {
  path: string;
  className?: string;
  size?: 'sm' | 'md';
}

const ViewDetailsButton: React.FC<ViewDetailsButtonProps> = ({ path, className, size = 'md' }) => {
  const navigate = useNavigate();
  const isSmall = size === 'sm';

  return (
    <div style={{ width: isSmall ? '100%' : '210px', display: isSmall ? 'block' : 'inline-block' }}>
      <button
        className={`bg-[#b89e6f] text-white uppercase tracking-widest font-bold transition border-none cursor-pointer rounded-md flex items-center justify-center w-full ${className ?? ''}`}
        style={{
          fontSize:  isSmall ? '0.7rem' : '0.875rem',
          padding:   isSmall ? '0.55rem 1rem' : '0.875rem 2rem',
          minWidth:  isSmall ? 'unset' : '210px',
          width:     '100%',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#a68b5b')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#b89e6f')}
        onClick={() => navigate(path)}
      >
        <span className="flex items-center gap-2" style={{ justifyContent: 'center' }}>
          View Details
          <HiArrowRight size={isSmall ? 14 : 18} />
        </span>
      </button>
    </div>
  );
};

export default ViewDetailsButton;