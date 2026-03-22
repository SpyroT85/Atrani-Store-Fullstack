import { FiTrash2, FiX } from 'react-icons/fi';
import Button from '../ui/Button';

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDemo?: boolean;
}

export default function ConfirmModal({ message, onConfirm, onCancel, isDemo = false }: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={onCancel}>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <FiTrash2 size={16} className="text-red-500" />
            <h2 className="text-base font-medium text-zinc-900 dark:text-zinc-100">Delete product</h2>
          </div>
          <button onClick={onCancel} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
            <FiX size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {isDemo && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 mb-4">
              <span className="text-amber-500">⚠️</span>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                Demo mode! Deletion is disabled.
              </p>
            </div>
          )}
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">{message}</p>
          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <Button variant="edit" onClick={onCancel}>Cancel</Button>
            {!isDemo && (
              <Button variant="delete" icon={<FiTrash2 />} onClick={onConfirm}>Delete</Button>
            )}
            {isDemo && (
              <Button variant="delete" icon={<FiTrash2 />} onClick={() => {}}>Delete</Button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}