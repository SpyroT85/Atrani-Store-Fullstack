import { useState, useRef, useEffect } from 'react';
import { FiSun, FiMoon, FiChevronDown, FiLogOut, FiUser, FiBell } from 'react-icons/fi';
import Button from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';

const API_URL = 'https://api.spyros-tserkezos.dev';

interface RecentUser {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  created_at: string;
}

interface LowStockProduct {
  id: number;
  name: string;
  image_url: string;
  stock: number;
  category: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return 'just now';
}

export default function Topbar() {
  const { dark, toggleDark } = useTheme();
  const { admin, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'signups' | 'stock'>('signups');
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const pageTitles: Record<string, string> = {
    products: 'Products',
    accounts: 'Accounts',
    analytics: 'Analytics',
  };

  const currentPage = location.pathname.replace('/', '') || 'products';
  const pageTitle = pageTitles[currentPage] || 'Dashboard';

  // Fetch on mount to show badge count immediately
  useEffect(() => {
    if (!admin?.token || fetched) return;
    setFetched(true);
    setLoading(true);
    Promise.all([
      fetch(`${API_URL}/api/users/recent`, {
        headers: { Authorization: `Bearer ${admin.token}` },
      }),
      fetch(`${API_URL}/api/products/low-stock?threshold=20`, {
        headers: { Authorization: `Bearer ${admin.token}` },
      }),
    ])
      .then(([usersRes, stockRes]) => Promise.all([usersRes.json(), stockRes.json()]))
      .then(([usersData, stockData]) => {
        setRecentUsers(usersData);
        setLowStockProducts(stockData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [admin?.token]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalNotifications = lowStockProducts.length + recentUsers.length;

  const glassyBadge = (count: number) => (
    <span
      className="min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold flex items-center justify-center"
      style={{
        background: 'rgba(200,135,74,0.15)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: '1px solid rgba(200,135,74,0.4)',
        color: '#C8874A',
      }}
    >
      {count}
    </span>
  );

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-xl font-medium">{pageTitle}</h1>

      <div className="flex items-center gap-3">
        <Button variant="edit" onClick={toggleDark} icon={dark ? <FiSun /> : <FiMoon />}>
          {dark ? 'Light' : 'Dark'}
        </Button>

        {/* Notifications */}
        <div className="relative" ref={bellRef}>
          <button
            onClick={() => setBellOpen(prev => !prev)}
            className="relative flex items-center justify-center w-8 h-8 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-[#C8874A]/50 hover:text-[#C8874A] transition"
          >
            <FiBell size={15} />
            {totalNotifications > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-bold flex items-center justify-center"
                style={{
                  background: 'rgba(200,135,74,0.15)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: '1px solid rgba(200,135,74,0.4)',
                  color: '#C8874A',
                }}
              >
                {totalNotifications}
              </span>
            )}
          </button>

          {bellOpen && (
            <div className="absolute right-0 top-full mt-1 w-72 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg z-20 overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={() => setActiveTab('signups')}
                  className={`flex-1 px-3 py-2.5 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                    activeTab === 'signups'
                      ? 'text-[#C8874A] border-b-2 border-[#C8874A]'
                      : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                  }`}
                >
                  Recent Signups
                  {recentUsers.length > 0 && glassyBadge(recentUsers.length)}
                </button>
                <button
                  onClick={() => setActiveTab('stock')}
                  className={`flex-1 px-3 py-2.5 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                    activeTab === 'stock'
                      ? 'text-[#C8874A] border-b-2 border-[#C8874A]'
                      : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                  }`}
                >
                  Low Stock
                  {lowStockProducts.length > 0 && glassyBadge(lowStockProducts.length)}
                </button>
              </div>

              {loading ? (
                <div className="px-3 py-6 text-xs text-zinc-400 text-center">Loading...</div>
              ) : activeTab === 'signups' ? (
                recentUsers.length === 0 ? (
                  <div className="px-3 py-6 text-xs text-zinc-400 text-center">No users yet</div>
                ) : (
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {recentUsers.map(user => (
                      <div key={user.id} className="flex items-center gap-3 px-3 py-2.5">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-[#C8874A]/10 text-[#C8874A] flex items-center justify-center flex-shrink-0 text-xs font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-zinc-700 dark:text-zinc-200 truncate">{user.name}</p>
                          <p className="text-[10px] text-zinc-400 truncate">{user.email}</p>
                        </div>
                        <span className="text-[10px] text-zinc-400 flex-shrink-0">{timeAgo(user.created_at)}</span>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                lowStockProducts.length === 0 ? (
                  <div className="px-3 py-6 text-xs text-zinc-400 text-center">All products well stocked ✓</div>
                ) : (
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {lowStockProducts.map(product => (
                      <div key={product.id} className="flex items-center gap-3 px-3 py-2.5">
                        <img
                          src={product.image_url?.startsWith('http')
                            ? product.image_url
                            : `https://api.spyros-tserkezos.dev${product.image_url}`}
                          alt={product.name}
                          className="w-7 h-7 rounded-lg object-cover border border-zinc-200 dark:border-zinc-700 flex-shrink-0"
                          onError={e => (e.currentTarget.src = '/placeholder.png')}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-zinc-700 dark:text-zinc-200 truncate">{product.name}</p>
                          <p className="text-[10px] text-zinc-400 truncate">{product.category}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                          product.stock === 0
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                        }`}>
                          {product.stock === 0 ? 'Out' : `${product.stock} left`}
                        </span>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* User dropdown */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 text-sm px-2 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:border-[#C8874A]/50 transition"
          >
            <span className="w-6 h-6 rounded-full bg-[#C8874A]/10 text-[#C8874A] flex items-center justify-center">
              <FiUser size={14} />
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