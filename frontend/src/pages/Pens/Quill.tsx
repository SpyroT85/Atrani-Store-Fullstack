import { useState, useEffect } from 'react';
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return <CategoryPageLayout title="Quill Pens" products={products} basePath="/pens/quill" />;
};

export default QuillPens;