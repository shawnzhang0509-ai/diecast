import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Search, User, ShoppingCart, Menu, X } from 'lucide-react';
import Logo from './Logo';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const isHome = location.pathname === '/';

  const navItems = [
    { label: '收藏', href: '/#new-arrivals' },
    { label: '最新上架', href: '/#new-arrivals' },
    { label: '关于我们', href: '/about' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || !isHome
          ? 'bg-[rgba(13,13,13,0.95)] backdrop-blur-xl'
          : 'bg-transparent'
      }`}
      style={{ height: 80 }}
    >
      <div className="mx-auto flex h-full items-center justify-between" style={{ maxWidth: 1400, padding: '0 40px' }}>
        <Link to="/" className="flex items-center gap-3">
          <Logo className="h-6 w-12" />
          <span className="font-display text-[20px] font-light tracking-[0.25em] text-[#F7F7F7] uppercase">
            DRIFTAE
          </span>
        </Link>

        <div className="hidden items-center gap-10 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="group relative font-display text-[14px] font-normal text-[#F7F7F7]"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-[#C7A96B] transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-5 md:flex">
          <button className="text-[#F7F7F7] transition-transform duration-200 hover:scale-110">
            <Search size={20} strokeWidth={1.5} />
          </button>
          <button className="text-[#F7F7F7] transition-transform duration-200 hover:scale-110">
            <User size={20} strokeWidth={1.5} />
          </button>
          <button className="relative text-[#F7F7F7] transition-transform duration-200 hover:scale-110">
            <ShoppingCart size={20} strokeWidth={1.5} />
            <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#C7A96B] text-[10px] font-medium text-[#0D0D0D]">
              0
            </span>
          </button>
        </div>

        <button
          className="text-[#F7F7F7] md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="absolute left-0 right-0 top-20 border-t border-[#1F1F1F] bg-[#0D0D0D] p-8 md:hidden">
          <div className="flex flex-col gap-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="font-display text-lg text-[#F7F7F7]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
