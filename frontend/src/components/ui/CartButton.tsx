import React from 'react';
import { HiShoppingCart } from "react-icons/hi2";
import { Button } from './button';
import { useCart } from '../../hooks/useCart';

interface CartButtonProps {
  productId: string;
  productName: string;
  productPrice: number;
  productImage?: string;
  productCategory?: string;
  className?: string;
}

const CartButton: React.FC<CartButtonProps> = ({ productId, productName, productPrice, productImage, productCategory, className }) => {
  const { addItem, removeItem, items } = useCart();
  const currentQty = items.find((i: { id: string; qty: number }) => i.id === productId)?.qty ?? 0;

  const handleAdd = () => {
    addItem({ id: productId, name: productName, price: productPrice, image: productImage, category: productCategory });
  };

  const buttonStyles = "bg-[#b89e6f] text-white uppercase tracking-widest text-sm font-bold transition border-none cursor-pointer rounded-md flex items-center justify-center w-full";
  const buttonPadding = { padding: '2rem 2rem', minWidth: '210px' };

  const handleDecrease = () => {
    if (currentQty > 0) {
      removeItem(productId);
    }
  };

  const handleIncrease = () => {
    addItem({ id: productId, name: productName, price: productPrice, image: productImage, category: productCategory });
  };

  if (currentQty === 0) {
    return (
      <div className={className} style={{ width: '210px', display: 'inline-block' }}>
        <Button variant="default" className={buttonStyles} style={buttonPadding} onClick={handleAdd}>
          <span className="flex items-center gap-2" style={{ width: '100%', justifyContent: 'center', display: 'inline-flex' }}>
            <HiShoppingCart size={24} />
            Add to Cart
          </span>
        </Button>
      </div>
    );
  }

  return (
    <div className={className} style={{ width: '210px', display: 'inline-block' }}>
      <Button variant="default" className={buttonStyles} style={buttonPadding}>
        <span className="flex items-center gap-2" style={{ width: '100%', justifyContent: 'center', display: 'inline-flex' }}>
          <button
            onClick={handleDecrease}
            aria-label="Decrease quantity"
            style={{
              width: '32px', height: '32px',
              backgroundColor: '#b89e6f',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '20px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#a68b5b')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#b89e6f')}
          >
            <span style={{ color: '#fff' }}>−</span>
          </button>
          <HiShoppingCart size={20} />
          In Cart ({currentQty})
          <button
            onClick={handleIncrease}
            aria-label="Increase quantity"
            style={{
              width: '32px', height: '32px',
              backgroundColor: '#b89e6f',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '20px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#a68b5b')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#b89e6f')}
          >
            <span style={{ color: '#fff' }}>+</span>
          </button>
        </span>
      </Button>
    </div>
  );
};

export default CartButton;
