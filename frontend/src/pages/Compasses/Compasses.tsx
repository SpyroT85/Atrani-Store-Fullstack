import { products } from '@/data/products';
import CategoryPageLayout from '@/components/CategoryPageLayout';

const Compasses = () => (
  <CategoryPageLayout
    title="Compasses"
    products={products.compasses}
    basePath="/compasses"
  />
);

export default Compasses;