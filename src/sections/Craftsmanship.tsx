import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Craftsmanship() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const image = imageRef.current;
    if (!section || !content || !image) return;

    const ctx = gsap.context(() => {
      // Content animation
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

      // Parallax on image
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
    { value: '500+', label: 'Models Curated' },
    { value: '12', label: 'Partner Brands' },
    { value: '48H', label: 'Global Shipping' },
  ];

  return (
    <section
      ref={sectionRef}
      className="bg-[#0C0C0C]"
      style={{ padding: '120px 0' }}
    >
      <div className="mx-auto grid grid-cols-1 items-center gap-0 lg:grid-cols-2" style={{ maxWidth: 1400 }}>
        {/* Left - Content */}
        <div ref={contentRef} style={{ padding: '0 40px' }}>
          <h2 className="font-display text-[36px] font-normal leading-[1.2] tracking-[-1px] text-[#F0F0F0] sm:text-[48px]">
            The Art of Precision
          </h2>

          <p className="mt-6 font-body text-[14px] font-normal leading-[1.6] text-[#777777]">
            Every model in our collection represents hundreds of hours of meticulous craftsmanship. From the initial 3D scanning of the original vehicle to the hand-polished clear coat, no detail is too small to perfect.
          </p>

          <p className="mt-4 font-body text-[14px] font-normal leading-[1.6] text-[#777777]">
            Our resin models are produced in strictly limited quantities — often fewer than 500 pieces worldwide. Each comes with a numbered certificate of authenticity, ensuring your acquisition is as exclusive as the full-scale supercar it replicates.
          </p>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-[32px] font-normal leading-[1.0] tracking-[-1px] text-[#F0F0F0]">
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
            className="mt-10 inline-block border border-[#F0F0F0] bg-transparent px-8 py-3.5 font-body text-[13px] font-medium uppercase tracking-[0.05em] text-[#F0F0F0] transition-all duration-300 hover:bg-white hover:text-black"
          >
            Our Story
          </Link>
        </div>

        {/* Right - Image */}
        <div ref={imageRef} className="relative h-[400px] overflow-hidden lg:h-[600px]">
          <img
            src="/images/collection-lifestyle.png"
            alt="Premium model car accessories and display cases"
            className="h-[120%] w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
