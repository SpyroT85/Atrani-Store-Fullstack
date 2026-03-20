import { products } from '@/data/products';
import CategoryPageLayout from '@/components/CategoryPageLayout';

const Pocket = () => (
  <CategoryPageLayout
    title="Pocket Watches"
    products={products['watches/pocket']}
    basePath="/watches/pocket"
  />
);

export default Pocket;