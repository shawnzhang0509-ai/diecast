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

    // Entrance animation
    gsap.fromTo(
      content.children,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 0.3 }
    );

    // Scroll-based scale/opacity
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
      className="relative flex items-center justify-center overflow-hidden bg-[#0C0C0C]"
      style={{ minHeight: '100vh' }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: 'url(/images/hero-showroom.png)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0C0C0C]/60 via-transparent to-[#0C0C0C]" />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center px-6 text-center"
        style={{ maxWidth: 700 }}
      >
        <p
          className="mb-6 font-body text-[12px] font-medium uppercase tracking-[0.08em] text-[#777777]"
        >
          Curated Automotive Masterpieces
        </p>

        <h1 className="font-display text-[56px] font-normal leading-[1.0] tracking-[-2px] text-[#F0F0F0] sm:text-[72px] md:text-[80px]">
          SCALE
          <br />
          <em className="not-italic" style={{ fontStyle: 'italic' }}>PERFECTION</em>
        </h1>

        <p
          className="mt-8 max-w-[480px] font-body text-[14px] font-normal leading-[1.6] text-[#777777]"
        >
          Museum-grade resin and die-cast scale models from the world's most exclusive automotive brands. Every piece tells a story of engineering excellence.
        </p>

        <Link
          to="#new-arrivals"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('new-arrivals')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="mt-10 inline-block bg-[#D24E35] px-10 py-4 font-body text-[13px] font-medium uppercase tracking-[0.05em] text-white transition-colors duration-300 hover:bg-[#B84028]"
        >
          Explore Collection
        </Link>
      </div>
    </section>
  );
}
