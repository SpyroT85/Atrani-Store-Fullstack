import { useState, useEffect } from 'react';
import { ImSpinner8 } from 'react-icons/im';
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

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <ImSpinner8 className="animate-spin text-4xl text-[#b89e6f]" />
    </div>
  );
  if (error) return <div>{error}</div>;

  return <CategoryPageLayout title="Smartwatches" products={products} basePath="/watches/smartwatches" />;
};

export default Smartwatches;