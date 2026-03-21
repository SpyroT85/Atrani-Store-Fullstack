import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useProducts } from '../hooks/useProducts';
import type { Product } from '../types/product';

interface ProductsContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  loading: boolean;
  error: string | null;
  deleteProduct: (id: number, name: string, token?: string) => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const value = useProducts();

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProductsContext() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProductsContext must be used inside ProductsProvider');
  return ctx;
}