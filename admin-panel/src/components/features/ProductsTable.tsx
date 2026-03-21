import { FiPlus } from 'react-icons/fi';
import { useState } from 'react';
import ActionMenu from './ActionMenu';
import type { Product } from '../../types/product';
import Button from '../ui/Button';
import Checkbox from '../ui/Checkbox';
import FilterDropdown from '../ui/FilterDropdown';
import Pagination from '../ui/Pagination';
import SearchInput from '../ui/SearchInput';
import MultiSelect from '../ui/MultiSelect';

interface ProductsTableProps {
  products: Product[];
  onDelete: (id: number, name: string, token?: string) => void;
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
  isDemo?: boolean;
  token?: string;
}

export default function ProductsTable({
  products, onDelete, onEdit, onAdd,
  categoryFilter, onCategoryChange,
  search, onSearch,
  page, totalPages, pageSize, totalProducts,
  onPageChange, onPageSizeChange,
  isDemo = false,
  token
}: ProductsTableProps) {
  const [multiActive, setMultiActive] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);

  const handleMultiDelete = async () => {
    for (const id of selected) {
      await onDelete(id, '', token);
    }
    setSelected([]);
    setMultiActive(false);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Products ({totalProducts})</span>
          <FilterDropdown
            value={categoryFilter}
            onChange={onCategoryChange}
            allLabel="All categories"
            options={[
              { value: 'watches', label: 'Watches' },
              { value: 'watches/luxury', label: 'Watches / Luxury' },
              { value: 'watches/smartwatches', label: 'Watches / Smartwatches' },
              { value: 'watches/pocket', label: 'Watches / Pocket' },
              { value: 'quillPens', label: 'Quill Pens' },
              { value: 'fountainPens', label: 'Fountain Pens' },
              { value: 'compasses', label: 'Compasses' },
              { value: 'inkwells', label: 'Inkwells' },
            ]}
          />
          <SearchInput
            value={search}
            onChange={onSearch}
            placeholder="Search products..."
          />
          <MultiSelect
            active={multiActive}
            onActivate={() => setMultiActive(true)}
            selectedCount={selected.length}
            onDelete={handleMultiDelete}
            onCancel={() => { setMultiActive(false); setSelected([]); }}
            disabled={isDemo}
          />
        </div>
        <Button variant="primary" icon={<FiPlus />} onClick={onAdd}>Add product</Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-sm border-collapse table-fixed">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              {multiActive && (
                  <th className="px-5 py-3 w-12 text-left">
                    <Checkbox
                      checked={selected.length === products.length && products.length > 0}
                      onChange={checked => setSelected(checked ? products.map(p => p.id) : [])}
                    />
                  </th>
              )}
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
                {multiActive && (
                    <td className="px-5 py-3 w-12">
                      <Checkbox
                        checked={selected.includes(product.id)}
                        onChange={checked => {
                          setSelected(prev =>
                            checked
                              ? [...prev, product.id]
                              : prev.filter(id => id !== product.id)
                          );
                        }}
                      />
                    </td>
                )}
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image_url?.startsWith('http')
                        ? product.image_url
                        : `https://api.spyros-tserkezos.dev${product.image_url}`}
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
                    disabled={isDemo}
                  />
                </td>
              </tr>
            ))}
          </tbody>
          {/* tfoot removed as per user request */}
        </table>
      </div>

      {/* Pagination Footer */}
      <Pagination
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={totalProducts}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
}