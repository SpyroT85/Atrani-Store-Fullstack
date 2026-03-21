import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'edit' | 'delete';
  onClick?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export default function Button({ children, variant = 'edit', onClick, icon, disabled = false, style }: ButtonProps) {
  const variants = {
    primary: 'bg-[#C8874A] text-white hover:opacity-80 border-none',
    edit: 'bg-transparent text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800',
    delete: 'bg-red-50 dark:bg-red-950 text-red-500 border-none hover:opacity-80',
  };

  const isIconOnly = !children || (Array.isArray(children) && children.length === 0);
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 text-xs font-medium ${isIconOnly ? 'px-2' : 'px-3'} py-1.5 rounded-md cursor-pointer transition-opacity font-[Inter] ${variants[variant]}${disabled ? ' opacity-60 pointer-events-none' : ''}`}
      disabled={disabled}
      style={style}
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
    >
      {icon && <span className="flex items-center text-sm">{icon}</span>}
      {children}
    </button>
  );
}