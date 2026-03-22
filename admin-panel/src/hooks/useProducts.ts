import { useState, useEffect } from 'react';
import type { Product } from '../types/product';

const API_URL = 'https://api.spyros-tserkezos.dev';

export interface LowStockProduct {
  id: number;
  name: string;
  image_url: string;
  stock: number;
  category: string;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setTimeout(() => setLoading(false), 300);
      })
      .catch(() => {
        setError('Failed to load products');
        setTimeout(() => setLoading(false), 300);
      });
  }, []);

  const deleteProduct = async (id: number, _name: string, token?: string) => {
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) { alert('Failed to delete product'); return; }
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch {
      alert('Failed to delete product');
    }
  };

  const fetchLowStock = async (token: string, threshold = 10): Promise<LowStockProduct[]> => {
    try {
      const res = await fetch(`${API_URL}/api/products/low-stock?threshold=${threshold}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  };

  return { products, loading, error, deleteProduct, setProducts, fetchLowStock };
}