import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { formatPrice } from '../data/products';
import BrandTagline from '../components/BrandTagline';

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedModel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content.children,
        { opacity: 0, x: 60 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const specs = [
    { label: 'Year', value: '1962' },
    { label: 'Mileage', value: '8,200 mi' },
    { label: 'Engine', value: 'Colombo V12' },
    { label: 'Condition', value: 'Concours' },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-y border-driftae-gold/10 bg-driftae-surface"
      style={{ minHeight: '100vh' }}
    >
      <div className="mx-auto flex min-h-screen flex-col lg:flex-row" style={{ maxWidth: 1400 }}>
        <div className="relative flex-1 lg:max-w-[55%]">
          <div className="relative h-[50vh] lg:h-screen">
            <img
              src="/images/product-ferrari-250gto.png"
              alt="Ferrari 250 GTO 1962"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
            <div className="absolute bottom-12 left-8 right-8">
              <h2
                className="font-display text-[48px] font-light uppercase leading-[0.9] tracking-[0.1em] text-white sm:text-[64px] lg:text-[80px]"
                style={{
                  textShadow: '0 4px 30px rgba(0,0,0,0.5)',
                  WebkitTextStroke: '1px rgba(255,255,255,0.1)',
                }}
              >
                FERRARI
                <br />
                250
                <br />
                GTO
              </h2>
            </div>
          </div>
        </div>

        <div
          ref={contentRef}
          className="flex flex-1 flex-col justify-center px-8 py-16 lg:max-w-[45%] lg:px-16"
        >
          <BrandTagline text="Featured Classic" className="mb-4" />
          <h2 className="font-display text-[36px] font-light leading-[1.2] tracking-[0.05em] text-driftae-white sm:text-[48px]">
            Ferrari 250 GTO
          </h2>

          <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-4">
            {specs.map((spec) => (
              <div key={spec.label}>
                <p className="font-body text-[12px] font-normal tracking-[0.05em] text-[#777777]">
                  {spec.label}
                </p>
                <p className="mt-1 font-display text-[14px] font-medium text-[#F7F7F7]">
                  {spec.value}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 font-body text-[14px] font-normal leading-[1.6] text-driftae-muted">
            The holy grail of classic automobiles. One of only 36 ever built, this 1962 Ferrari 250 GTO features the legendary Colombo V12 and a proven racing pedigree.
          </p>

          <p className="mt-6 font-display text-[24px] font-normal text-[#C7A96B]">
            {formatPrice(48500000)}
          </p>

          <Link
            to="/product/ferrari-250-gto"
            className="mt-8 inline-block self-start border border-[#C7A96B] bg-transparent px-8 py-3.5 font-body text-[13px] font-medium uppercase tracking-[0.1em] text-[#C7A96B] transition-all duration-300 hover:bg-[#C7A96B] hover:text-[#0D0D0D]"
          >
            View Details
          </Link>
        </div>
      </div>
    </section>
  );
}
