import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Search, User, ShoppingCart, Menu, X } from 'lucide-react';

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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || !isHome
          ? 'bg-[rgba(12,12,12,0.95)] backdrop-blur-xl'
          : 'bg-transparent'
      }`}
      style={{ height: 80 }}
    >
      <div className="mx-auto flex h-full items-center justify-between" style={{ maxWidth: 1400, padding: '0 40px' }}>
        {/* Logo */}
        <Link to="/" className="font-display text-[20px] font-medium tracking-[0.1em] text-[#F0F0F0] uppercase">
          APEX DIECAST
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden items-center gap-10 md:flex">
          {[
            { label: 'Models', href: '/#new-arrivals' },
            { label: 'New Arrivals', href: '/#new-arrivals' },
            { label: 'About', href: '/about' },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="group relative font-display text-[14px] font-normal text-[#F0F0F0]"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-white transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Right Icons */}
        <div className="hidden items-center gap-5 md:flex">
          <button className="text-[#F0F0F0] transition-transform duration-200 hover:scale-110">
            <Search size={20} strokeWidth={1.5} />
          </button>
          <button className="text-[#F0F0F0] transition-transform duration-200 hover:scale-110">
            <User size={20} strokeWidth={1.5} />
          </button>
          <button className="relative text-[#F0F0F0] transition-transform duration-200 hover:scale-110">
            <ShoppingCart size={20} strokeWidth={1.5} />
            <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#D24E35] text-[10px] font-medium text-white">
              0
            </span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="text-[#F0F0F0] md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute left-0 right-0 top-20 border-t border-[#222222] bg-[#0C0C0C] p-8 md:hidden">
          <div className="flex flex-col gap-6">
            {[
              { label: 'Models', href: '/#new-arrivals' },
              { label: 'New Arrivals', href: '/#new-arrivals' },
              { label: 'About', href: '/about' },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="font-display text-lg text-[#F0F0F0]"
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
