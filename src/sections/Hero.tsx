import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';

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
      className="relative flex items-center justify-center overflow-hidden bg-[#0D0D0D]"
      style={{ minHeight: '100vh' }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: 'url(/images/hero-showroom.png)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D]/60 via-transparent to-[#0D0D0D]" />

      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center px-6 text-center"
        style={{ maxWidth: 700 }}
      >
        <p className="mb-6 font-body text-[12px] font-medium uppercase tracking-[0.2em] text-[#C7A96B]">
          Premium Classic Automobiles
        </p>

        <h1 className="font-display text-[56px] font-light leading-[1.0] tracking-[0.15em] text-[#F7F7F7] sm:text-[72px] md:text-[80px]">
          TIMELESS
          <br />
          <em className="font-serif not-italic italic" style={{ fontStyle: 'italic' }}>ELEGANCE</em>
        </h1>

        <p className="font-serif mt-6 text-[16px] font-normal italic leading-[1.6] text-[#C7A96B]">
          Passion for Classics. Built for Collectors.
        </p>

        <p className="mt-4 max-w-[480px] font-body text-[14px] font-normal leading-[1.6] text-[#777777]">
          精选全球经典老爷车，每一辆都承载着汽车工业的黄金时代。从法拉利到保时捷，为您呈现值得珍藏的传世之作。
        </p>

        <Link
          to="#new-arrivals"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('new-arrivals')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="mt-10 inline-block bg-[#C7A96B] px-10 py-4 font-body text-[13px] font-medium uppercase tracking-[0.1em] text-[#0D0D0D] transition-colors duration-300 hover:bg-[#A89258]"
        >
          探索收藏
        </Link>
      </div>
    </section>
  );
}
