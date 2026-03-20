import { products } from '@/data/products';
import CategoryPageLayout from '@/components/CategoryPageLayout';

const Inkwells = () => (
  <CategoryPageLayout
    title="Inkwells"
    products={products.inkwells}
    basePath="/inkwells"
  />
);

export default Inkwells;