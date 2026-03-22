import { useNavigate, useLocation } from 'react-router-dom';
import { FiBox, FiUsers, FiBarChart2 } from 'react-icons/fi';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { id: 'products', label: 'Products', icon: <FiBox size={15} /> },
    { id: 'accounts', label: 'Accounts', icon: <FiUsers size={15} /> },
    { id: 'analytics', label: 'Analytics', icon: <FiBarChart2 size={15} /> },
  ];

  const currentPage = location.pathname.replace('/', '') || 'products';

  return (
    <div className="w-52 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 py-6 flex-shrink-0">
      <div className="px-6 pb-5 border-b border-zinc-200 dark:border-zinc-800 mb-4">
        <p className="font-light text-xl" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Atrani</p>
        <span className="text-xs text-zinc-400">Admin Panel</span>
      </div>
      <div className="flex flex-col gap-1 px-3">
        {links.map(link => (
          <a
            key={link.id}
            href={`/${link.id}`}
            onClick={(e) => { e.preventDefault(); navigate(`/${link.id}`); }}
            className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors text-left w-full ${
              currentPage === link.id
                ? 'text-[#C8874A] bg-[#C8874A]/8 font-medium'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            {link.icon}
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}