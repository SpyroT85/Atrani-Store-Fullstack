import { useState, useEffect } from 'react';
import { fetchFountainPens } from '@/api/products';
import CategoryPageLayout from '@/components/CategoryPageLayout';
import type { Pen } from '@/types/productTypes';

const FountainPens = () => {
  const [products, setProducts] = useState<Pen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFountainPens()
      .then(setProducts)
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return <CategoryPageLayout title="Fountain Pens" products={products} basePath="/pens/fountain" />;
};

export default FountainPens;