export default function Sidebar() {
  return (
    <div className="w-52 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 py-6 flex-shrink-0">
      <div className="px-6 pb-5 border-b border-zinc-200 dark:border-zinc-800 mb-4">
        <p className="font-light text-xl" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Atrani</p>
        <span className="text-xs text-zinc-400">Admin Panel</span>
      </div>
      <div className="px-6 py-2 text-sm text-[#C8874A] border-l-2 border-[#C8874A] bg-[#C8874A]/8">
        Products
      </div>
    </div>
  );
}