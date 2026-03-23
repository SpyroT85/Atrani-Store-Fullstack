import { useState } from 'react';
import { FiUpload } from 'react-icons/fi';
import type { Product } from '../../types/product';
import Button from '../ui/Button';


const CATEGORIES = [
  'watches', 'watches/luxury', 'watches/smartwatches', 'watches/pocket',
  'quillPens', 'fountainPens', 'compasses', 'inkwells',
];

const CATEGORY_FIELDS: Record<string, string[]> = {
  'watches': ['material', 'water_resistance', 'movement'],
  'watches/luxury': ['material', 'water_resistance', 'movement'],
  'watches/smartwatches': ['battery', 'waterproof'],
  'watches/pocket': ['material', 'movement'],
  'quillPens': ['material'],
  'fountainPens': ['material'],
  'compasses': ['material', 'movement'],
  'inkwells': ['material'],
};

const FIELD_LABELS: Record<string, string> = {
  material: 'Material',
  water_resistance: 'Water Resistance',
  movement: 'Movement',
  battery: 'Battery Life',
  waterproof: 'Waterproof',
};

const FIELD_PLACEHOLDERS: Record<string, string> = {
  material: 'Stainless Steel',
  water_resistance: '100m (10 ATM)',
  movement: 'Automatic',
  battery: '7 days',
  waterproof: '50m',
};

interface ProductFormProps {
  initial?: Partial<Product>;
  onSubmit: (data: Partial<Product>) => void;
  onCancel: () => void;
  loading?: boolean;
  token?: string;
  isDemo?: boolean;
}

export default function ProductForm({ initial = {}, onSubmit, onCancel, loading, token, isDemo = false }: ProductFormProps) {
  const [form, setForm] = useState({
    name: initial.name ?? '',
    category: initial.category ?? 'watches',
    price: initial.price ?? '',
    code: initial.code ?? '',
    slug: initial.slug ?? '',
    image_url: initial.image_url ?? '',
    description: initial.description ?? '',
    material: initial.material ?? '',
    water_resistance: initial.water_resistance ?? '',
    movement: initial.movement ?? '',
    battery: initial.battery ?? '',
    waterproof: initial.waterproof ?? '',
    stock: initial.stock ?? 0,
  });

  const set = (k: string, v: string | number) => setForm(f => ({ ...f, [k]: v }));

  const inputClass = `w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#C8874A]/40 transition`;

  const [preview, setPreview] = useState<string>(initial.image_url ?? '');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch('https://api.spyros-tserkezos.dev/api/products/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      if (res.status === 401) { alert('Unauthorized — please log in again'); return; }
      const data = await res.json();
      setPreview(data.url);
      set('image_url', data.url);
    } catch {
      alert('Failed to upload image');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {isDemo && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
          <span className="text-amber-500">⚠️</span>
          <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
            Demo mode! Changes are disabled. You can explore the UI but cannot save.
          </p>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Name</label>
          <input className={inputClass} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Product name" disabled={isDemo} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Category</label>
          <select className={inputClass} value={form.category} onChange={e => set('category', e.target.value)} disabled={isDemo}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Price (€)</label>
          <input
            className={inputClass}
            value={form.price}
            onChange={e => set('price', e.target.value)}
            placeholder="0.00"
            type="text"
            inputMode="decimal"
            disabled={isDemo}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Code</label>
          <input className={inputClass} value={form.code} onChange={e => set('code', e.target.value)} placeholder="AW1001" disabled={isDemo} />
        </div>

        {/* Stock field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Stock</label>
          <div className="relative">
            <input
              className={inputClass}
              value={form.stock === 0 ? '' : form.stock}
              onChange={e => set('stock', parseInt(e.target.value) || 0)}
              placeholder="0"
              type="text"
              inputMode="numeric"
              disabled={isDemo}
              style={{ paddingRight: '80px' }}
            />
            {!isDemo && (
              <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold pointer-events-none ${
                form.stock === 0
                  ? 'text-red-500'
                  : form.stock < 20
                  ? 'text-red-500'
                  : form.stock < 50
                  ? 'text-[#C8874A]'
                  : form.stock < 100
                  ? 'text-[#C8874A]'
                  : 'text-green-500'
              }`}>
                {form.stock === 0
                  ? 'Out of stock'
                  : form.stock < 20
                  ? 'Critical'
                  : form.stock < 50
                  ? 'Low'
                  : form.stock < 100
                  ? 'Moderate'
                  : 'In stock'}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Slug</label>
          <input className={inputClass} value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="watches-classic" disabled={isDemo} />
        </div>

        <div className="flex flex-col gap-1.5 col-span-2">
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Image</label>
          <div className="flex items-center gap-3">
            {preview && (
              <img src={preview} alt="preview" className="w-16 h-16 object-cover rounded-lg border border-zinc-200 dark:border-zinc-700" />
            )}
            <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition">
              <FiUpload size={14} />
              {preview ? 'Change image' : 'Upload image'}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isDemo} />
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-1.5 col-span-2">
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Description</label>
          <textarea className={inputClass} rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Product description..." disabled={isDemo} />
        </div>

        {(CATEGORY_FIELDS[form.category] ?? []).map(field => (
          <div key={field} className="flex flex-col gap-1.5 col-span-2">
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {FIELD_LABELS[field]}
            </label>
            <input
              className={inputClass}
              value={(form as any)[field] ?? ''}
              onChange={e => set(field, e.target.value)}
              placeholder={FIELD_PLACEHOLDERS[field]}
              disabled={isDemo}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
        <Button variant="edit" onClick={onCancel}>Cancel</Button>
        {!isDemo && (
          <Button variant="primary" onClick={() => onSubmit(form)}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        )}
      </div>
    </div>
  );
}