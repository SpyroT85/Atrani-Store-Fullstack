import { useNavigate, useLocation } from 'react-router-dom';
import { FiBox, FiUsers, FiBarChart2, FiChevronLeft } from 'react-icons/fi';
import Tooltip from '../ui/Tooltip';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { id: 'products', label: 'Products', icon: <FiBox size={16} /> },
    { id: 'accounts', label: 'Accounts', icon: <FiUsers size={16} /> },
    { id: 'analytics', label: 'Analytics', icon: <FiBarChart2 size={16} /> },
  ];

  const currentPage = location.pathname.replace('/', '') || 'products';

  return (
    <div
      className="flex flex-col bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 py-6 flex-shrink-0"
      style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: collapsed ? '64px' : '208px',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div
        className="pb-5 border-b border-zinc-200 dark:border-zinc-800 mb-4 flex items-center px-4"
        style={{ position: 'relative', minHeight: '52px', flexShrink: 0 }}
      >
        <p
          className="font-light text-xl w-full text-center"
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            opacity: collapsed ? 1 : 0,
            transition: 'opacity 0.3s ease',
            position: 'absolute',
            left: 0,
            pointerEvents: 'none',
          }}
        >
          A
        </p>
        <div
          style={{
            opacity: collapsed ? 0 : 1,
            transition: 'opacity 0.3s ease',
            pointerEvents: collapsed ? 'none' : 'auto',
          }}
        >
          <img src="/atrani.webp" alt="Atrani" className="h-5 w-auto dark:invert" />
          <span className="text-[10px] uppercase tracking-widest text-zinc-400 whitespace-nowrap block mt-2">
            Admin Panel
          </span>
        </div>
      </div>

      {/* Links */}
      <div className="flex flex-col gap-1 px-2 flex-1">
        {links.map(link => {
          const isActive = currentPage === link.id;
          const linkEl = (
            <a
              key={link.id}
              href={`/${link.id}`}
              onClick={(e) => { e.preventDefault(); navigate(`/${link.id}`); }}
              className={`relative flex items-center gap-2.5 px-3 py-2.5 text-sm rounded-lg transition-colors duration-200 text-left w-full group ${
                isActive
                  ? 'text-[#C8874A] bg-[#C8874A]/10 font-medium'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#C8874A] rounded-r-full" />
              )}
              <span className={`flex-shrink-0 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                {link.icon}
              </span>
              <span
                className="whitespace-nowrap"
                style={{
                  opacity: collapsed ? 0 : 1,
                  maxWidth: collapsed ? 0 : '200px',
                  overflow: 'hidden',
                  transition: collapsed
                    ? 'opacity 0.1s ease, max-width 0.3s ease'
                    : 'opacity 0.2s ease 0.15s, max-width 0.3s ease',
                }}
              >
                {link.label}
              </span>
            </a>
          );

          return collapsed ? (
            <Tooltip key={link.id} text={link.label}>
              {linkEl}
            </Tooltip>
          ) : linkEl;
        })}
      </div>

      {/* Collapse button */}
      <div
        className="border-t border-zinc-200 dark:border-zinc-800"
        style={{ flexShrink: 0, padding: '16px 8px' }}
      >
        <button
          onClick={onToggle}
          className={`flex items-center w-full py-2 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200 ${collapsed ? 'justify-center' : 'justify-start px-12'}`}
        >
          <FiChevronLeft
            size={16}
            className="flex-shrink-0"
            style={{
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
          <span
            className="whitespace-nowrap text-xs"
            style={{
              opacity: collapsed ? 0 : 1,
              maxWidth: collapsed ? 0 : '100px',
              overflow: 'hidden',
              marginLeft: collapsed ? 0 : '8px',
              transition: collapsed
                ? 'opacity 0.1s ease, max-width 0.3s ease, margin-left 0.3s ease'
                : 'opacity 0.2s ease 0.15s, max-width 0.3s ease, margin-left 0.3s ease',
            }}
          >
            Collapse
          </span>
        </button>
      </div>
    </div>
  );
}