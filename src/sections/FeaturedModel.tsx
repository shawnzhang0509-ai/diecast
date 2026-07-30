import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedModel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
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
    { label: 'Scale', value: '1:18' },
    { label: 'Material', value: 'Resin' },
    { label: 'Manufacturer', value: 'MR Collection' },
    { label: 'Edition', value: 'Limited 320 pcs' },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#111111]"
      style={{ minHeight: '100vh' }}
    >
      <div className="mx-auto flex min-h-screen flex-col lg:flex-row" style={{ maxWidth: 1400 }}>
        {/* Left - Image (55%) */}
        <div
          ref={imageRef}
          className="relative flex-1 lg:max-w-[55%]"
        >
          <div className="relative h-[50vh] lg:h-screen">
            <img
              src="/images/product-ferrari-sf90.png"
              alt="Ferrari SF90 Stradale 1:18 Scale Model"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
            {/* 3D Text Overlay */}
            <div className="absolute bottom-12 left-8 right-8">
              <h2
                className="font-display text-[48px] font-bold uppercase leading-[0.9] tracking-[-2px] text-white sm:text-[64px] lg:text-[80px]"
                style={{
                  textShadow: '0 4px 30px rgba(0,0,0,0.5)',
                  WebkitTextStroke: '1px rgba(255,255,255,0.1)',
                }}
              >
                FERRARI
                <br />
                SF90
                <br />
                STRADALE
              </h2>
            </div>
          </div>
        </div>

        {/* Right - Content (45%) */}
        <div
          ref={contentRef}
          className="flex flex-1 flex-col justify-center px-8 py-16 lg:max-w-[45%] lg:px-16"
        >
          <p className="mb-4 font-body text-[12px] font-medium uppercase tracking-[0.08em] text-[#777777]">
            Featured Model
          </p>

          <h2 className="font-display text-[36px] font-normal leading-[1.2] tracking-[-1px] text-[#F0F0F0] sm:text-[48px]">
            Ferrari SF90 Stradale
          </h2>

          {/* Specs Grid */}
          <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-4">
            {specs.map((spec) => (
              <div key={spec.label}>
                <p className="font-body text-[12px] font-normal tracking-[0.05em] text-[#777777]">
                  {spec.label}
                </p>
                <p className="mt-1 font-display text-[14px] font-medium text-[#F0F0F0]">
                  {spec.value}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 font-body text-[14px] font-normal leading-[1.6] text-[#777777]">
            A meticulous resin masterpiece capturing every aerodynamic detail of Ferrari's plug-in hybrid supercar. Hand-finished in Rosso Corsa with carbon fiber roof detail.
          </p>

          <p className="mt-6 font-display text-[24px] font-normal text-[#D24E35]">
            $499
          </p>

          <Link
            to="/product/ferrari-sf90-stradale"
            className="mt-8 inline-block self-start border border-[#F0F0F0] bg-transparent px-8 py-3.5 font-body text-[13px] font-medium uppercase tracking-[0.05em] text-[#F0F0F0] transition-all duration-300 hover:bg-white hover:text-black"
          >
            View Details
          </Link>
        </div>
      </div>
    </section>
  );
}
