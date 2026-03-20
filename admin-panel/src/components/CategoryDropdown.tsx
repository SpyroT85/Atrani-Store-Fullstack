import { useState, useRef, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const CATEGORIES = [
  'all', 'watches', 'watches/luxury', 'watches/smartwatches',
  'watches/pocket', 'quillPens', 'fountainPens', 'compasses', 'inkwells',
];

interface CategoryDropdownProps {
  value: string;
  onChange: (cat: string) => void;
}

export default function CategoryDropdown({ value, onChange }: CategoryDropdownProps) {
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

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:border-[#C8874A]/50 transition cursor-pointer"
      >
        {value === 'all' ? 'All categories' : value}
        <FiChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg z-20 overflow-hidden">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => { onChange(c); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-xs transition-colors
                ${value === c
                  ? 'bg-[#C8874A]/10 text-[#C8874A] font-medium'
                  : 'text-zinc-600 dark:text-zinc-300 hover:bg-[#C8874A]/10 hover:text-[#C8874A]'
                }`}
            >
              {c === 'all' ? 'All categories' : c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}