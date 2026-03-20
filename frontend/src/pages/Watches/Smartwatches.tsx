import { useState, useEffect } from 'react';
import { fetchSmartWatches } from '@/api/products';
import CategoryPageLayout from '@/components/CategoryPageLayout';
import type { Watch } from '@/types/productTypes';

const Smartwatches = () => {
  const [products, setProducts] = useState<Watch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSmartWatches()
      .then(setProducts)
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return <CategoryPageLayout title="Smartwatches" products={products} basePath="/watches/smartwatches" />;
};

export default Smartwatches;