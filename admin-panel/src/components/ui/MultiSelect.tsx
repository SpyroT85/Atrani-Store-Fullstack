import { FiCheckSquare, FiTrash2, FiX } from 'react-icons/fi';

interface MultiSelectProps {
  active: boolean;
  onActivate: () => void;
  selectedCount: number;
  onDelete: () => void;
  onCancel: () => void;
  disabled?: boolean;
}

export default function MultiSelect({ active, onActivate, selectedCount, onDelete, onCancel, disabled }: MultiSelectProps) {
  if (!active) {
    return (
      <button
        onClick={onActivate}
        disabled={disabled}
        className="h-[30px] flex items-center gap-1.5 text-xs px-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-[#C8874A]/50 hover:text-[#C8874A] transition disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <FiCheckSquare size={13} />
        <span>Select</span>
      </button>
    );
  }

  return (
    <div className="h-[30px] flex items-center gap-2 px-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
      <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
        {selectedCount > 0 ? `${selectedCount} selected` : 'Select items'}
      </span>

      {selectedCount > 0 && (
        <>
          <div className="w-px h-3.5 bg-zinc-300 dark:bg-zinc-600" />
          <button
            onClick={onDelete}
            className="h-[30px] flex items-center gap-1.5 text-xs px-2 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <FiTrash2 size={12} />
            Delete
          </button>
        </>
      )}

      <div className="w-px h-3.5 bg-zinc-300 dark:bg-zinc-600" />
      <button
        onClick={onCancel}
        className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
      >
        <FiX size={13} />
      </button>
    </div>
  );
}