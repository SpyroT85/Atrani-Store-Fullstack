import { useState, useRef, useEffect } from 'react';
import { FiSun, FiMoon, FiChevronDown, FiLogOut, FiUser } from 'react-icons/fi';
import Button from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';

export default function Topbar() {
  const { dark, toggleDark } = useTheme();
  const { admin, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const pageTitles: Record<string, string> = {
    products: 'Products',
    accounts: 'Accounts',
    analytics: 'Analytics',
  };

  const currentPage = location.pathname.replace('/', '') || 'products';
  const pageTitle = pageTitles[currentPage] || 'Dashboard';

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
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-xl font-medium">{pageTitle}</h1>

      <div className="flex items-center gap-3">
        <Button variant="edit" onClick={toggleDark} icon={dark ? <FiSun /> : <FiMoon />}>
          {dark ? 'Light' : 'Dark'}
        </Button>

        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 text-sm px-2 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:border-[#C8874A]/50 transition"
          >
            <span className="w-6 h-6 rounded-full bg-[#C8874A]/10 text-[#C8874A] flex items-center justify-center">
              <FiUser size={18} />
            </span>
            <FiChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg z-20 overflow-hidden">
              <div className="px-3 py-2.5 border-b border-zinc-100 dark:border-zinc-800">
                <p className="text-xs text-zinc-400">Signed in as</p>
                <p className="text-xs font-medium text-zinc-700 dark:text-zinc-200 truncate">{admin?.email}</p>
                <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  admin?.role === 'superadmin'
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                    : admin?.role === 'admin'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                }`}>
                  {admin?.role === 'superadmin' ? '✦ Super Admin' : admin?.role === 'admin' ? '✦ Admin' : '◈ Demo'}
                </span>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <FiLogOut size={13} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}