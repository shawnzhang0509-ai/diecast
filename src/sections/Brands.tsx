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
      className="bg-[#0C0C0C]"
      style={{ padding: '120px 0' }}
    >
      <div className="mx-auto" style={{ maxWidth: 1400, padding: '0 40px' }}>
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="font-display text-[36px] font-normal leading-[1.2] tracking-[-1px] text-[#F0F0F0] sm:text-[48px]">
            Brands We Carry
          </h2>
          <p className="mx-auto mt-4 max-w-[600px] font-body text-[14px] font-normal leading-[1.6] text-[#777777]">
            We partner exclusively with the world's most respected model manufacturers, each selected for their uncompromising commitment to accuracy and craftsmanship.
          </p>
        </div>

        {/* Brand Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 border border-[#222222] md:grid-cols-4"
        >
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="group flex flex-col items-center justify-center border border-[#222222] py-12 transition-colors duration-300 hover:bg-[#111111] md:py-16"
            >
              <h3 className="font-display text-[18px] font-normal tracking-[-0.5px] text-[#F0F0F0] transition-colors duration-300 group-hover:text-[#D24E35] md:text-[20px]">
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
