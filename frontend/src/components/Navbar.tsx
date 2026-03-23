import { useState, useEffect, useRef } from 'react';
import { FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import AuthModal from './ui/AuthModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoBagHandleSharp } from "react-icons/io5";
import { IoIosMenu } from "react-icons/io";
import { Link } from 'react-router-dom';
import CartDrawer from './ui/CartDrawer';
import { useCart } from '../hooks/useCart';
import Tooltip from './Tooltip';

const Navbar = () => {


  const { user, logout } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const { items, updateQty, removeItem, removeAll } = useCart();

  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const totalItems = items.reduce((acc: number, item: { qty: number }) => acc + item.qty, 0);

  const navLinkStyle = {
    fontFamily: 'Manrope, sans-serif',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.15em',
  };

  const dropdownItemStyle = {
    fontFamily: 'Manrope, sans-serif',
    fontSize: '10px',
    letterSpacing: '0.12em',
    padding: '16px 12px',
  };

  return (
    <>
      <nav className="relative px-4 md:px-12 py-4 bg-background text-white" style={{ minHeight: '60px' }}>

        {/* Mobile navigation */}
        <div className="grid grid-cols-3 items-center md:hidden" style={{ paddingTop: '12px' }}>
          <div className="flex items-center justify-start" style={{ marginLeft: '8px' }}>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex justify-center items-center transition border border-white/20 rounded p-2"
              style={{ color: 'white' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#a37a41')}
              onMouseLeave={e => (e.currentTarget.style.color = 'white')}
              aria-label="Toggle mobile menu"
            >
              <IoIosMenu className="w-8 h-8" />
            </button>
          </div>
          <div className="flex items-center justify-center" style={{ position: 'relative', zIndex: 20 }}>
            <Link to="/" style={{ zIndex: 21, display: 'inline-block' }}>
              <img
                src="/images/atrani.webp?v=2"
                alt="Atrani Logo"
                className="filter invert cursor-pointer"
                style={{ height: '28px', width: '96px', objectFit: 'fill' }}
                width="96"
                height="28"
              />
            </Link>
          </div>
          <div className="flex justify-end" style={{ marginRight: '8px' }}>
            <button
              onClick={() => setCartOpen(true)}
              className="transition flex items-center gap-1 cursor-pointer outline-none bg-transparent border-none"
              style={{ color: 'white' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#a37a41')}
              onMouseLeave={e => (e.currentTarget.style.color = 'white')}
            >
              <IoBagHandleSharp className="w-7 h-7" />
              <span className="text-base">({totalItems})</span>
            </button>
          </div>
        </div>

        {/* Desktop navigation */}
        <div className="hidden md:grid grid-cols-3 items-center" style={{ paddingTop: '12px' }}>
          <div className="flex items-center">
            <Link to="/">
              <img
                src="/images/atrani.webp?v=2"
                alt="Atrani Logo"
                className="filter invert cursor-pointer"
                style={{ height: '28px', width: '96px', marginLeft: 'clamp(100px, 23vw, 500px)', objectFit: 'fill' }}
                width="96"
                height="28"
              />
            </Link>
          </div>

          {/* Navigation links */}
          <div className="flex justify-center gap-4 md:gap-12 uppercase whitespace-nowrap" style={{ ...navLinkStyle, marginLeft: 'clamp(0px, 20vw, 10px)' }}>
            <Link to="/" className="transition cursor-pointer" style={{ ...navLinkStyle, color: 'white' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#a37a41')}
              onMouseLeave={e => (e.currentTarget.style.color = 'white')}>Home</Link>

            <DropdownMenu>
              <DropdownMenuTrigger className="uppercase transition outline-none bg-transparent border-none cursor-pointer" style={{ ...navLinkStyle, color: 'white' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#a37a41')}
                onMouseLeave={e => (e.currentTarget.style.color = 'white')}>
                Watches
              </DropdownMenuTrigger>
              <DropdownMenuContent sideOffset={16} className="bg-background border border-white/10 text-white min-w-30 relative overflow-visible" style={{ fontFamily: 'Manrope, sans-serif', padding: '8px', borderTop: '3px solid #a37a41' }}>
                <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', width: '0', height: '0', borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: '10px solid #a37a41', zIndex: 10 }} />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link to="/watches/atrani" className="cursor-pointer uppercase tracking-wider justify-center" style={dropdownItemStyle}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#a37a41'; e.currentTarget.style.color = 'white'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'white'; }}>Atrani</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/watches/luxury" className="cursor-pointer uppercase tracking-wider justify-center" style={dropdownItemStyle}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#a37a41'; e.currentTarget.style.color = 'white'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'white'; }}>Luxury</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/watches/smartwatches" className="cursor-pointer uppercase tracking-wider justify-center" style={dropdownItemStyle}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#a37a41'; e.currentTarget.style.color = 'white'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'white'; }}>Smartwatches</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/watches/pocket" className="cursor-pointer uppercase tracking-wider justify-center" style={dropdownItemStyle}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#a37a41'; e.currentTarget.style.color = 'white'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'white'; }}>Pocket</Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="uppercase transition outline-none bg-transparent border-none cursor-pointer" style={{ ...navLinkStyle, color: 'white' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#a37a41')}
                onMouseLeave={e => (e.currentTarget.style.color = 'white')}>
                Pens
              </DropdownMenuTrigger>
              <DropdownMenuContent sideOffset={16} className="bg-background border border-white/10 text-white min-w-30 relative overflow-visible" style={{ fontFamily: 'Manrope, sans-serif', padding: '8px', borderTop: '3px solid #a37a41' }}>
                <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', width: '0', height: '0', borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: '10px solid #a37a41', zIndex: 10 }} />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link to="/pens/quill" className="cursor-pointer uppercase tracking-wider justify-center" style={dropdownItemStyle}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#a37a41'; e.currentTarget.style.color = 'white'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'white'; }}>Quill Pens</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/pens/fountain" className="cursor-pointer uppercase tracking-wider justify-center" style={dropdownItemStyle}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#a37a41'; e.currentTarget.style.color = 'white'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'white'; }}>Fountain Pens</Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/compasses" className="uppercase transition cursor-pointer" style={{ ...navLinkStyle, color: 'white', whiteSpace: 'nowrap', marginRight: '6px' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#a37a41')}
              onMouseLeave={e => (e.currentTarget.style.color = 'white')}>Compasses</Link>
            <Link to="/inkwells" className="uppercase transition cursor-pointer" style={{ ...navLinkStyle, color: 'white' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#a37a41')}
              onMouseLeave={e => (e.currentTarget.style.color = 'white')}>Inkwells</Link>
          </div>

          {/* User icon + Shopping cart button */}
          <div className="flex justify-end items-center gap-4" style={{ marginRight: 'clamp(80px, 8vw, 200px)' }}>
            {/* Admin Panel button */}
            <a
              href="https://admin.spyros-tserkezos.dev"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10px', letterSpacing: '0.12em', color: 'white', textDecoration: 'none', textTransform: 'uppercase', fontWeight: 700, padding: '7px 14px', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '4px' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#a37a41'; (e.currentTarget as HTMLAnchorElement).style.color = '#a37a41'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.3)'; (e.currentTarget as HTMLAnchorElement).style.color = 'white'; }}
            >
              Admin Panel
            </a>

            {/* User icon */}
            <div className="relative flex items-center" ref={userMenuRef}>
              <Tooltip text={user ? user.name : 'Sign In'} position="bottom">
                <button
                  data-cy="user-icon"
                  onClick={() => user ? setUserMenuOpen(!userMenuOpen) : setAuthOpen(true)}
                  className="transition flex items-center gap-1 cursor-pointer outline-none bg-transparent border-none"
                  style={{ color: 'white' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#a37a41')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'white')}
                >
                  <FiUser className="w-6 h-6" />
                </button>
              </Tooltip>
              {user && userMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-48 z-50"
                  style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderTop: '3px solid #a37a41', borderRadius: '12px', overflow: 'hidden' }}
                >
                  <div style={{ padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10px', color: '#666', letterSpacing: '0.08em' }}>Signed in as</p>
                    <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px', color: 'white', fontWeight: 600, marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name || user.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    style={{ display: 'block', padding: '12px', fontFamily: 'Manrope, sans-serif', fontSize: '11px', letterSpacing: '0.08em', color: 'white', textDecoration: 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => { logout(); setUserMenuOpen(false); }}
                    className="w-full text-left"
                    style={{ padding: '12px', fontFamily: 'Manrope, sans-serif', fontSize: '11px', letterSpacing: '0.08em', color: '#f87171', background: 'none', border: 'none', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(248,113,113,0.08)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Cart button */}
            <Tooltip text="Cart" position="bottom">
              <button
                data-cy="cart-icon"
                onClick={() => setCartOpen(true)}
                className="transition flex items-center gap-1 cursor-pointer outline-none bg-transparent border-none relative"
                style={{ color: 'white' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#a37a41')}
                onMouseLeave={e => (e.currentTarget.style.color = 'white')}
              >
                <IoBagHandleSharp className="w-7 h-7" />
                <span className="text-base" style={{ fontFamily: 'Manrope, sans-serif' }}>({totalItems})</span>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 text-white rounded-full w-4 h-4 flex items-center justify-center font-bold" style={{ fontSize: '9px', fontFamily: 'Manrope, sans-serif', backgroundColor: '#a37a41' }}>
                    {totalItems}
                  </span>
                )}
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#1a1a1a] z-50 shadow-xl" style={{ borderTop: '1px solid #a37a41' }}>
            <div className="flex flex-col uppercase text-center" style={{ paddingTop: '16px', paddingBottom: '16px', paddingLeft: '24px', paddingRight: '24px', fontFamily: 'Manrope, sans-serif', fontWeight: 600, letterSpacing: '0.15em', fontSize: '13px' }}>
              <Link to="/" style={{ paddingTop: '16px', paddingBottom: '16px', color: 'white' }} onClick={() => setIsMobileMenuOpen(false)}
                onMouseEnter={e => (e.currentTarget.style.color = '#a37a41')}
                onMouseLeave={e => (e.currentTarget.style.color = 'white')}>Home</Link>

              <div>
                <button onClick={() => toggleSection('watches')} className="w-full text-center transition cursor-pointer" style={{ paddingTop: '16px', paddingBottom: '16px', fontFamily: 'Manrope, sans-serif', fontWeight: 600, letterSpacing: '0.15em', color: 'white', background: 'none', border: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#a37a41')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'white')}>WATCHES</button>
                {expandedSection === 'watches' && (
                  <div className="flex flex-col gap-4 pb-4" style={{ fontSize: '11px', fontFamily: 'Manrope, sans-serif', letterSpacing: '0.12em' }}>
                    {[{ to: '/watches/atrani', label: 'Atrani' }, { to: '/watches/luxury', label: 'Luxury' }, { to: '/watches/smartwatches', label: 'Smartwatches' }, { to: '/watches/pocket', label: 'Pocket' }].map(({ to, label }) => (
                      <Link key={to} to={to} style={{ color: 'white', padding: '8px 0' }} onClick={() => setIsMobileMenuOpen(false)}
                        onMouseEnter={e => (e.currentTarget.style.color = '#a37a41')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'white')}>{label}</Link>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <button onClick={() => toggleSection('pens')} className="w-full text-center transition cursor-pointer" style={{ paddingTop: '16px', paddingBottom: '16px', fontFamily: 'Manrope, sans-serif', fontWeight: 600, letterSpacing: '0.15em', color: 'white', background: 'none', border: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#a37a41')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'white')}>PENS</button>
                {expandedSection === 'pens' && (
                  <div className="flex flex-col gap-4 pb-4" style={{ fontSize: '11px', fontFamily: 'Manrope, sans-serif', letterSpacing: '0.12em' }}>
                    {[{ to: '/pens/quill', label: 'Quill Pens' }, { to: '/pens/fountain', label: 'Fountain Pens' }].map(({ to, label }) => (
                      <Link key={to} to={to} style={{ color: 'white', padding: '8px 0' }} onClick={() => setIsMobileMenuOpen(false)}
                        onMouseEnter={e => (e.currentTarget.style.color = '#a37a41')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'white')}>{label}</Link>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Link to="/inkwells" className="w-full text-center transition cursor-pointer block" style={{ paddingTop: '16px', paddingBottom: '16px', fontFamily: 'Manrope, sans-serif', fontWeight: 600, letterSpacing: '0.15em', color: 'white', background: 'none', border: 'none', textDecoration: 'none' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  onMouseEnter={e => (e.currentTarget.style.color = '#a37a41')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'white')}>INKWELLS</Link>
              </div>

              <div>
                <Link to="/compasses" className="w-full text-center transition cursor-pointer block" style={{ paddingTop: '16px', paddingBottom: '16px', fontFamily: 'Manrope, sans-serif', fontWeight: 600, letterSpacing: '0.15em', color: 'white', background: 'none', border: 'none', textDecoration: 'none' }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  onMouseEnter={e => (e.currentTarget.style.color = '#a37a41')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'white')}>COMPASSES</Link>
              </div>
            </div>
          </div>
        )}
      </nav>
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={items}
        onRemoveAll={removeAll}
        onUpdateQty={updateQty}
        onRemoveItem={removeItem}
      />
    </>
  );
};

export default Navbar;