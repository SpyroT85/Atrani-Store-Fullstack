import PerPageDropdown from './PerPageDropdown';

interface PaginationProps {
  page: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
}

export default function Pagination({ page, totalPages, pageSize, totalItems, onPageChange, onPageSizeChange }: PaginationProps) {
  return (
    <div className="flex justify-between items-center px-5 py-3 border-t border-zinc-200 dark:border-zinc-800">
      <span className="text-sm text-zinc-400">
        {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, totalItems)} of {totalItems}
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
  );
}