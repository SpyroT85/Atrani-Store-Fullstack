import { useState, useEffect } from 'react';
import { ImSpinner8 } from 'react-icons/im';
import { fetchQuillPens } from '@/api/products';
import CategoryPageLayout from '@/components/CategoryPageLayout';
import type { Pen } from '@/types/productTypes';

const QuillPens = () => {
  const [products, setProducts] = useState<Pen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuillPens()
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

  return <CategoryPageLayout title="Quill Pens" products={products} basePath="/pens/quill" />;
};

export default QuillPens;