import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Facebook, MessageCircle, Menu, X } from 'lucide-react';
import Logo from './Logo';
import { FACEBOOK_URL, MESSENGER_URL, TRADEME_SHOP_URL } from '@/config/site-links';

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
    { label: 'Collection', href: '/collection' },
    { label: 'New Arrivals', href: '/#new-arrivals' },
    { label: 'About', href: '/about' },
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
      <div className="mx-auto flex h-full items-center justify-between px-5 sm:px-10" style={{ maxWidth: 1400 }}>
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
          <a
            href={TRADEME_SHOP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-[12px] uppercase tracking-[0.08em] text-driftae-gold transition-colors duration-200 hover:text-driftae-white"
          >
            Trade Me Shop
          </a>
          <a
            href={MESSENGER_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Message us on Messenger"
            className="text-driftae-white transition-colors duration-200 hover:text-driftae-gold"
          >
            <MessageCircle size={20} strokeWidth={1.5} />
          </a>
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Driftae on Facebook"
            className="text-driftae-white transition-colors duration-200 hover:text-driftae-gold"
          >
            <Facebook size={20} strokeWidth={1.5} />
          </a>
        </div>

        <button
          className="text-driftae-white md:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
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
            <a
              href={TRADEME_SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display text-lg uppercase tracking-[0.08em] text-driftae-gold"
            >
              Trade Me Shop
            </a>
            <a
              href={MESSENGER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display text-lg uppercase tracking-[0.08em] text-driftae-white"
            >
              Message us
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
