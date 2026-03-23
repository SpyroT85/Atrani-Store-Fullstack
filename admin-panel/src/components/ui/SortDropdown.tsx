import { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiArrowUp, FiArrowDown } from 'react-icons/fi';

export type SortOption =
  | 'newest'
  | 'oldest'
  | 'price_asc'
  | 'price_desc'
  | 'stock_asc'
  | 'stock_desc'
  | 'name_asc'
  | 'name_desc';

export const ALL_SORT_OPTIONS: { value: SortOption; label: string; icon: 'up' | 'down' }[] = [
  { value: 'newest', label: 'Newest first', icon: 'down' },
  { value: 'oldest', label: 'Oldest first', icon: 'up' },
  { value: 'price_asc', label: 'Price: Low to High', icon: 'up' },
  { value: 'price_desc', label: 'Price: High to Low', icon: 'down' },
  { value: 'stock_asc', label: 'Stock: Low to High', icon: 'up' },
  { value: 'stock_desc', label: 'Stock: High to Low', icon: 'down' },
  { value: 'name_asc', label: 'Name: A → Z', icon: 'up' },
  { value: 'name_desc', label: 'Name: Z → A', icon: 'down' },
];

export const ACCOUNT_SORT_OPTIONS: { value: SortOption; label: string; icon: 'up' | 'down' }[] = [
  { value: 'newest', label: 'Newest first', icon: 'down' },
  { value: 'oldest', label: 'Oldest first', icon: 'up' },
  { value: 'name_asc', label: 'Name: A → Z', icon: 'up' },
  { value: 'name_desc', label: 'Name: Z → A', icon: 'down' },
];

interface SortDropdownProps {
  value: SortOption;
  onChange: (val: SortOption) => void;
  options?: { value: SortOption; label: string; icon: 'up' | 'down' }[];
}

export default function SortDropdown({ value, onChange, options = ALL_SORT_OPTIONS }: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = options.find(o => o.value === value) ?? options[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:border-[#C8874A]/50 transition cursor-pointer"
      >
        {current.icon === 'up' ? <FiArrowUp size={11} /> : <FiArrowDown size={11} />}
        {current.label}
        <FiChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg z-20 overflow-hidden">
          {options.map(o => (
            <button
              key={o.value}
              onClick={() => { onChange(o.value); setOpen(false); }}
              className={`w-full text-left flex items-center gap-2 px-3 py-2 text-xs transition-colors ${
                value === o.value
                  ? 'bg-[#C8874A]/10 text-[#C8874A] font-medium'
                  : 'text-zinc-600 dark:text-zinc-300 hover:bg-[#C8874A]/10 hover:text-[#C8874A]'
              }`}
            >
              {o.icon === 'up' ? <FiArrowUp size={11} /> : <FiArrowDown size={11} />}
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}