interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function Checkbox({ checked, onChange }: CheckboxProps) {
  return (
    <div
      onClick={() => onChange(!checked)}
      className={`w-4 h-4 rounded border cursor-pointer flex items-center justify-center transition-colors ${
        checked
          ? 'bg-white dark:bg-zinc-900 border-zinc-400 dark:border-[#C8874A]'
          : 'bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-600'
      }`}
    >
      {checked && (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <path
            d="M1 4L3.5 6.5L9 1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-zinc-800 dark:text-[#C8874A]"
          />
        </svg>
      )}
    </div>
  );
}