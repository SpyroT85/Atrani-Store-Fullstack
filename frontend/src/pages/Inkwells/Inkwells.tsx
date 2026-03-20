import { useState, useEffect } from 'react';
import { fetchInkwells } from '@/api/products';
import CategoryPageLayout from '@/components/CategoryPageLayout';
import type { Inkwell } from '@/types/productTypes';

const Inkwells = () => {
  const [products, setProducts] = useState<Inkwell[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInkwells()
      .then(setProducts)
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return <CategoryPageLayout title="Inkwells" products={products} basePath="/inkwells" />;
};

export default Inkwells;