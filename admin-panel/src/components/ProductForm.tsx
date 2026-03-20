import { useState } from 'react';
import type { Product } from '../types/product';
import Button from './Button';

const CATEGORIES = [
  'watches', 'watches/luxury', 'watches/smartwatches', 'watches/pocket',
  'quillPens', 'fountainPens', 'compasses', 'inkwells',
];

interface ProductFormProps {
  initial?: Partial<Product>;
  onSubmit: (data: Partial<Product>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ProductForm({ initial = {}, onSubmit, onCancel, loading }: ProductFormProps) {
  const [form, setForm] = useState({
    name: initial.name ?? '',
    category: initial.category ?? 'watches',
    price: initial.price ?? '',
    code: initial.code ?? '',
    slug: initial.slug ?? '',
    image_url: initial.image_url ?? '',
    description: initial.description ?? '',
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const inputClass = "w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#C8874A]/40 transition";

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Name</label>
          <input className={inputClass} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Product name" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Category</label>
          <select className={inputClass} value={form.category} onChange={e => set('category', e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Price (€)</label>
          <input className={inputClass} value={form.price} onChange={e => set('price', e.target.value)} placeholder="0.00" type="number" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Code</label>
          <input className={inputClass} value={form.code} onChange={e => set('code', e.target.value)} placeholder="AW1001" />
        </div>
        <div className="flex flex-col gap-1.5 col-span-2">
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Slug</label>
          <input className={inputClass} value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="watches-classic" />
        </div>
        <div className="flex flex-col gap-1.5 col-span-2">
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Image URL</label>
          <input className={inputClass} value={form.image_url} onChange={e => set('image_url', e.target.value)} placeholder="/images/..." />
        </div>
        <div className="flex flex-col gap-1.5 col-span-2">
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Description</label>
          <textarea className={inputClass} rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Product description..." />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
        <Button variant="edit" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={() => onSubmit(form)} icon={loading ? undefined : undefined}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
}