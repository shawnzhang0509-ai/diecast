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
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-500 ${
        scrolled || !isHome
          ? 'border-driftae-gold/10 bg-driftae-black/95 backdrop-blur-xl'
          : 'border-transparent bg-transparent'
      }`}
      style={{ height: 80 }}
    >
      <div className="mx-auto flex h-full items-center justify-between" style={{ maxWidth: 1400, padding: '0 40px' }}>
        <Link to="/" className="transition-opacity hover:opacity-80">
          <Logo variant="compact" />
        </Link>

        <div className="hidden items-center gap-10 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="group relative font-display text-[13px] font-normal uppercase tracking-[0.08em] text-driftae-white"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-driftae-gold transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-5 md:flex">
          <button className="text-driftae-white transition-colors duration-200 hover:text-driftae-gold">
            <Search size={20} strokeWidth={1.5} />
          </button>
          <button className="text-driftae-white transition-colors duration-200 hover:text-driftae-gold">
            <User size={20} strokeWidth={1.5} />
          </button>
          <button className="relative text-driftae-white transition-colors duration-200 hover:text-driftae-gold">
            <ShoppingCart size={20} strokeWidth={1.5} />
            <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-driftae-gold text-[10px] font-semibold text-driftae-black">
              0
            </span>
          </button>
        </div>

        <button
          className="text-driftae-white md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="absolute left-0 right-0 top-20 border-t border-driftae-gold/20 bg-driftae-black p-8 md:hidden">
          <div className="flex flex-col gap-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="font-display text-lg uppercase tracking-[0.08em] text-driftae-white"
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
