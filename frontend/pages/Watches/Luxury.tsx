import { products } from '@/data/products';
import CategoryPageLayout from '@/components/CategoryPageLayout';

const Luxury = () => (
  <CategoryPageLayout
    title="Luxury Watches"
    products={products['watches/luxury']}
    basePath="/watches/luxury"
  />
);

export default Luxury;