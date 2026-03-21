import { FiSearch } from 'react-icons/fi';

interface SearchInputProps {
  value: string;
  onChange: (s: string) => void;
  placeholder?: string;
}

export default function SearchInput({ value, onChange, placeholder = 'Search...' }: SearchInputProps) {
  return (
    <div className="relative">
      <FiSearch size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="text-xs pl-7 pr-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#C8874A]/40 transition w-48"
      />
    </div>
  );
}