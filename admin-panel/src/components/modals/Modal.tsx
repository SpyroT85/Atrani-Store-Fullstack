import React from 'react';
import { FiX } from 'react-icons/fi';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ title, onClose, children }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-base font-medium text-zinc-900 dark:text-zinc-100">{title}</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
            <FiX size={18} />
          </button>
        </div>
        <div className="px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  );
}