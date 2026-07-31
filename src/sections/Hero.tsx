import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';
import Logo from '../components/Logo';

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    gsap.fromTo(
      content.children,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 0.3 }
    );

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const progress = Math.min(scrollY / vh, 1);
      const scale = 1 - progress * 0.05;
      const opacity = 1 - progress * 0.5;
      content.style.transform = `scale(${scale})`;
      content.style.opacity = String(opacity);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex items-center justify-center overflow-hidden bg-driftae-black"
      style={{ minHeight: '100vh' }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{ backgroundImage: 'url(/images/hero-showroom.png)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-driftae-black/80 via-driftae-black/40 to-driftae-black" />

      {/* Decorative gold corner accents */}
      <div className="pointer-events-none absolute left-8 top-28 h-16 w-px bg-gradient-to-b from-driftae-gold/60 to-transparent sm:left-16" />
      <div className="pointer-events-none absolute left-8 top-28 h-px w-16 bg-gradient-to-r from-driftae-gold/60 to-transparent sm:left-16" />
      <div className="pointer-events-none absolute bottom-16 right-8 h-16 w-px bg-gradient-to-t from-driftae-gold/60 to-transparent sm:right-16" />
      <div className="pointer-events-none absolute bottom-16 right-8 h-px w-16 bg-gradient-to-l from-driftae-gold/60 to-transparent sm:right-16" />

      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center px-6 text-center"
        style={{ maxWidth: 760 }}
      >
        {/* Brand logo — matches style guide layout */}
        <Logo variant="full" showTagline className="mb-10" />

        <p className="mt-2 max-w-[520px] font-body text-[14px] font-normal leading-[1.7] text-driftae-muted">
          精选全球经典老爷车，每一辆都承载着汽车工业的黄金时代。从法拉利到保时捷，为您呈现值得珍藏的传世之作。
        </p>

        <Link
          to="#new-arrivals"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('new-arrivals')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="btn-gold mt-10 px-12 py-4"
        >
          探索收藏
        </Link>
      </div>
    </section>
  );
}
