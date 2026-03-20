import { products } from '@/data/products';
import CategoryPageLayout from '@/components/CategoryPageLayout';

const QuillPens = () => (
  <CategoryPageLayout
    title="Quill Pens"
    products={products.quillPens}
    basePath="/pens/quill"
  />
);

export default QuillPens;