import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { brands } from '../data/products';

gsap.registerPlugin(ScrollTrigger);

export default function Brands() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    if (!section || !grid) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        grid.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[#0D0D0D]"
      style={{ padding: '120px 0' }}
    >
      <div className="mx-auto" style={{ maxWidth: 1400, padding: '0 40px' }}>
        <div className="mb-16 text-center">
          <h2 className="font-display text-[36px] font-light leading-[1.2] tracking-[0.05em] text-driftae-white sm:text-[48px]">
            Legendary Marques
          </h2>
          <p className="mx-auto mt-4 max-w-[600px] font-body text-[14px] font-normal leading-[1.6] text-driftae-muted">
            We focus on the world's most iconic automotive brands — each representing the pinnacle of motoring's golden age.
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-2 border border-[#1F1F1F] md:grid-cols-4"
        >
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="group flex flex-col items-center justify-center border border-[#1F1F1F] py-12 transition-colors duration-300 hover:bg-[#141414] md:py-16"
            >
              <h3 className="font-display text-[18px] font-light tracking-[0.1em] text-[#F7F7F7] transition-colors duration-300 group-hover:text-[#C7A96B] md:text-[20px]">
                {brand.name}
              </h3>
              <p className="mt-2 font-body text-[12px] font-normal tracking-[0.05em] text-[#777777]">
                {brand.descriptor}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
