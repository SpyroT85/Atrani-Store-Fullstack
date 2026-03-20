import { createContext, useContext, type ReactNode } from 'react';
import { useCartInternal } from '../hooks/useCartInternal';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
  category?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'qty'>) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  removeAll: () => void;
  totalItems: number;
}

export const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { items, addItem, removeItem, updateQty, removeAll, totalItems } = useCartInternal();
  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, removeAll, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}