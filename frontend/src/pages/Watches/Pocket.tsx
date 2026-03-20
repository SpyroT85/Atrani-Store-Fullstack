import { useState, useEffect } from 'react';
import { fetchPocketWatches } from '@/api/products';
import CategoryPageLayout from '@/components/CategoryPageLayout';
import type { Watch } from '@/types/productTypes';

const Pocket = () => {
  const [products, setProducts] = useState<Watch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPocketWatches()
      .then(setProducts)
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return <CategoryPageLayout title="Pocket Watches" products={products} basePath="/watches/pocket" />;
};

export default Pocket;