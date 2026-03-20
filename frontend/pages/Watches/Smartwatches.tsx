import { products } from '@/data/products';
import CategoryPageLayout from '@/components/CategoryPageLayout';

const Smartwatches = () => (
  <CategoryPageLayout
    title="Smartwatches"
    products={products['watches/smartwatches']}
    basePath="/watches/smartwatches"
    fontFamily="Nanum Myeongjo, serif"
  />
);

export default Smartwatches;