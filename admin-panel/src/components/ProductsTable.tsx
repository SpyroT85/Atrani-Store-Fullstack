import { FiPlus, FiSearch } from 'react-icons/fi';
import type { Product } from '../types/product';
import Button from './Button';
import ActionMenu from './ActionMenu';
import CategoryDropdown from './CategoryDropdown';
import PerPageDropdown from './PerPageDropdown';

interface ProductsTableProps {
  products: Product[];
  onDelete: (id: number, name: string) => void;
  onEdit: (product: Product) => void;
  onAdd: () => void;
  categoryFilter: string;
  onCategoryChange: (cat: string) => void;
  search: string;
  onSearch: (s: string) => void;
  page: number;
  totalPages: number;
  pageSize: number;
  totalProducts: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
}

export default function ProductsTable({
  products, onDelete, onEdit, onAdd,
  categoryFilter, onCategoryChange,
  search, onSearch,
  page, totalPages, pageSize, totalProducts,
  onPageChange, onPageSizeChange
}: ProductsTableProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Products ({totalProducts})</span>
          <CategoryDropdown value={categoryFilter} onChange={onCategoryChange} />
          <div className="relative">
            <FiSearch size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              value={search}
              onChange={e => onSearch(e.target.value)}
              placeholder="Search products..."
              className="text-xs pl-7 pr-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#C8874A]/40 transition w-48"
            />
          </div>
        </div>
        <Button variant="primary" icon={<FiPlus />} onClick={onAdd}>Add product</Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-sm border-collapse table-fixed">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th className="px-5 py-3 text-left text-xs font-medium text-zinc-400 w-[35%]">Name</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-zinc-400 w-[20%] align-middle">Category</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-zinc-400 w-[15%]">Price</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-zinc-400 w-[15%]">Code</th>
              <th className="px-5 py-3 text-center text-xs font-medium text-zinc-400 w-[10%] pr-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image_url?.startsWith('http')
                        ? product.image_url
                        : `http://localhost:5000${product.image_url}`}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover border border-zinc-200 dark:border-zinc-700"
                      onError={e => (e.currentTarget.src = '/placeholder.png')}
                    />
                    <span className="font-medium">{product.name}</span>
                  </div>
                </td>
                  <td className="px-3 py-3 align-middle">
                    <span className="text-xs px-3 py-2 rounded-full bg-[#C8874A]/10 text-[#C8874A]">
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
          {/* tfoot removed as per user request */}
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex justify-between items-center px-5 py-3 border-t border-zinc-200 dark:border-zinc-800">
        <span className="text-sm text-zinc-400">
          {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, totalProducts)} of {totalProducts}
        </span>

        <div className="flex items-center gap-1 min-w-[200px] justify-center">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="text-xs px-2.5 py-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`text-xs w-8 h-8 rounded-md transition-colors ${
                p === page
                  ? 'bg-[#C8874A] text-white font-medium'
                  : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="text-xs px-2.5 py-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-400">Rows per page</span>
          <PerPageDropdown value={pageSize} onChange={onPageSizeChange} />
        </div>
      </div>
    </div>
  );
}