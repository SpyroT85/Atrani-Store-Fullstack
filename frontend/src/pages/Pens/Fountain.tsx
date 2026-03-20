import { products } from '@/data/products';
import CategoryPageLayout from '@/components/CategoryPageLayout';

const FountainPens = () => (
  <CategoryPageLayout
    title="Fountain Pens"
    products={products.fountainPens}
    basePath="/pens/fountain"
  />
);

export default FountainPens;