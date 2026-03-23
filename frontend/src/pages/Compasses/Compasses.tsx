import { useState, useEffect } from 'react';
import { ImSpinner8 } from 'react-icons/im';
import { fetchCompasses } from '@/api/products';
import CategoryPageLayout from '@/components/CategoryPageLayout';
import type { Compass } from '@/types/productTypes';

const Compasses = () => {
  const [products, setProducts] = useState<Compass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCompasses()
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

  return <CategoryPageLayout title="Compasses" products={products} basePath="/compasses" />;
};

export default Compasses;