import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useProducts } from '../context/ProductsContext';

gsap.registerPlugin(ScrollTrigger);

export default function Craftsmanship() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const { products } = useProducts();

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const image = imageRef.current;
    if (!section || !content || !image) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content.children,
        { opacity: 0, x: -40 },
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

      gsap.to(image.querySelector('img'), {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const stats = [
    { value: products.length ? String(products.length) : '—', label: 'Models in stock' },
    { value: '1:18', label: 'Collector scale' },
    { value: 'NZ', label: 'Tracked shipping' },
  ];

  return (
    <section
      ref={sectionRef}
      className="bg-[#0D0D0D]"
      style={{ padding: '120px 0' }}
    >
      <div className="mx-auto grid grid-cols-1 items-center gap-0 lg:grid-cols-2" style={{ maxWidth: 1400 }}>
        <div ref={contentRef} className="px-5 sm:px-10">
          <h2 className="font-display text-[36px] font-light leading-[1.2] tracking-[0.05em] text-driftae-white sm:text-[48px]">
            Chosen by Collectors
          </h2>

          <p className="mt-6 font-body text-[14px] font-normal leading-[1.6] text-driftae-muted">
            We pick the models we&apos;d want on our own shelves: rally winners, Porsche icons, classic Mercedes and the hot hatches of the 70s and 80s, mostly from NOREV and Sun Star.
          </p>

          <p className="mt-4 font-body text-[14px] font-normal leading-[1.6] text-driftae-muted">
            Every model is brand new in its original box, checked before it ships and packed carefully for the courier. Questions about a model? Message us. We&apos;re collectors too.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-[32px] font-light leading-[1.0] tracking-[-1px] text-[#C7A96B]">
                  {stat.value}
                </p>
                <p className="mt-2 font-body text-[12px] font-normal tracking-[0.05em] text-[#777777]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <Link
            to="/about"
            className="mt-10 inline-block border border-[#C7A96B] bg-transparent px-8 py-3.5 font-body text-[13px] font-medium uppercase tracking-[0.1em] text-[#C7A96B] transition-all duration-300 hover:bg-[#C7A96B] hover:text-[#0D0D0D]"
          >
            Our Story
          </Link>
        </div>

        <div ref={imageRef} className="relative h-[400px] overflow-hidden lg:h-[600px]">
          <img
            src="/social/mcrae-555-rear.jpg"
            alt="Sun Star 1:18 Subaru Impreza 555, Colin McRae 1994"
            className="h-[120%] w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
