import { FiPlus } from 'react-icons/fi';
import type { Product } from '../types/product';
import Button from './Button';
import ActionMenu from './ActionMenu';

interface ProductsTableProps {
  products: Product[];
  onDelete: (id: number, name: string) => void;
  onEdit: (product: Product) => void;
  onAdd: () => void;
}

export default function ProductsTable({ products, onDelete, onEdit, onAdd }: ProductsTableProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
      <div className="flex justify-between items-center px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <span className="text-sm font-medium">All products ({products.length})</span>
        <Button variant="primary" icon={<FiPlus />} onClick={onAdd}>Add product</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th className="px-5 py-3 text-left text-xs font-medium text-zinc-400">Name</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-zinc-400">Category</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-zinc-400">Price</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-zinc-400">Code</th>
              <th className="px-5 py-3 text-center text-xs font-medium text-zinc-400 pr-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <td className="px-5 py-3 font-medium">{product.name}</td>
                <td className="px-5 py-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-[#C8874A]/10 text-[#C8874A]">
                    {product.category}
                  </span>
                </td>
                <td className="px-5 py-3">€{parseFloat(product.price).toLocaleString('el-GR')}</td>
                <td className="px-5 py-3 text-zinc-400">{product.code}</td>
                <td className="px-5 py-3 text-center pr-1">
                  <ActionMenu
                    onEdit={() => onEdit(product)}
                    onDelete={() => onDelete(product.id, product.name)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}