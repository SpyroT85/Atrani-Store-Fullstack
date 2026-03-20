import { products } from '@/data/products';
import CategoryPageLayout from '@/components/CategoryPageLayout';

const Atrani = () => (
  <CategoryPageLayout
    title="Atrani"
    products={products.watches}
    basePath="/watches"
  />
);

export default Atrani;
