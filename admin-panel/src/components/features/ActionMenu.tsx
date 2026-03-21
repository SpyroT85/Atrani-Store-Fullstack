import { useState, useRef, useEffect } from 'react';
import { PiDotsThreeVerticalBold } from 'react-icons/pi';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

interface ActionMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  disabled?: boolean;
}

export default function ActionMenu({ onEdit, onDelete, disabled = false }: ActionMenuProps) {
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
    <div className="relative inline-flex" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      >
        <PiDotsThreeVerticalBold size={20} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg z-20 overflow-hidden">
            {disabled ? (
              <>
                <button 
                  onClick={() => { onEdit(); setOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <FiEdit2 size={14} />
                  Edit
                </button>
                <div className="h-px bg-zinc-100 dark:bg-zinc-800" />
                <button 
                  onClick={() => { onDelete(); setOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                >
                  <FiTrash2 size={14} />
                  Delete
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { onEdit(); setOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <FiEdit2 size={14} />
                  Edit
                </button>
                <div className="h-px bg-zinc-100 dark:bg-zinc-800" />
                <button
                  onClick={() => { onDelete(); setOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <FiTrash2 size={14} />
                  Delete
                </button>
              </>
            )}
        </div>
      )}
    </div>
  );
}