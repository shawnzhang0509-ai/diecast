import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Logo from '../components/Logo';

gsap.registerPlugin(ScrollTrigger);

interface StorySectionProps {
  title: string;
  paragraphs: string[];
  image: string;
  imageLeft?: boolean;
  stats?: { value: string; label: string }[];
}

function StorySection({ title, paragraphs, image, imageLeft, stats }: StorySectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content.children,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.1,
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

  const imageEl = (
    <div className="relative h-[350px] overflow-hidden lg:h-[450px]">
      <img
        src={image}
        alt={title}
        className="h-full w-full object-cover"
      />
    </div>
  );

  const contentEl = (
    <div ref={contentRef} className="flex flex-col justify-center" style={{ padding: '0 40px' }}>
      <h3 className="font-display text-[28px] font-light leading-[1.3] tracking-[0.05em] text-driftae-white sm:text-[36px]">
        {title}
      </h3>
      {paragraphs.map((p, i) => (
        <p key={i} className="mt-4 font-body text-[14px] font-normal leading-[1.6] text-driftae-muted">
          {p}
        </p>
      ))}
      {stats && (
        <div className="mt-8 grid grid-cols-3 gap-8">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-[28px] font-light leading-[1.0] tracking-[-1px] text-driftae-gold">
                {stat.value}
              </p>
              <p className="mt-2 font-body text-[12px] font-normal tracking-[0.05em] text-driftae-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div
      ref={sectionRef}
      className="grid grid-cols-1 items-center gap-0 lg:grid-cols-2"
      style={{ padding: '80px 0' }}
    >
      {imageLeft ? (
        <>
          {imageEl}
          {contentEl}
        </>
      ) : (
        <>
          {contentEl}
          {imageEl}
        </>
      )}
    </div>
  );
}

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const hero = heroRef.current;
    if (!hero) return;

    gsap.fromTo(
      hero.querySelectorAll('.animate-in'),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  return (
    <div className="bg-driftae-black">
      <div
        ref={heroRef}
        className="flex flex-col items-center justify-center border-b border-driftae-gold/20 bg-driftae-surface text-center"
        style={{ minHeight: '70vh', padding: '0 40px' }}
      >
        <div className="animate-in">
          <Logo variant="full" showTagline />
        </div>
        <p className="animate-in mt-8 max-w-[640px] font-body text-[14px] font-normal leading-[1.7] text-driftae-muted">
          Founded by collectors, for collectors. DRIFTAE connects automotive enthusiasts with the world's finest classic and vintage automobiles.
        </p>
      </div>

      <div className="mx-auto" style={{ maxWidth: 1400 }}>
        <StorySection
          title="Our Beginning"
          paragraphs={[
            'What started as a personal passion for automotive excellence has evolved into a global destination for discerning collectors. Our founder, a lifelong car enthusiast, recognized that the market lacked a curated platform for classic automobiles — one that treats every vehicle with the reverence of a gallery exhibition.',
            'In 2019, DRIFTAE was born with a simple mission: to connect collectors with the finest classic and vintage automobiles from around the world. Every vehicle we offer is rigorously vetted, professionally inspected, and presented with museum-grade care.',
          ]}
          image="/images/about-craft.png"
          imageLeft={false}
        />

        <StorySection
          title="Curated Excellence"
          paragraphs={[
            'We maintain close relationships with the world\'s leading classic car dealers, auction houses, and private collectors — ensuring every vehicle is authentic, fully documented, and legally clear. Our selection criteria are uncompromising: only vehicles with exceptional condition, clear provenance, and genuine collector value enter our showroom.',
            'Each listing includes a comprehensive inspection report, high-resolution photography, and complete historical documentation. We believe transparency is essential when investing in automotive heritage.',
          ]}
          image="/images/collection-lifestyle.png"
          imageLeft={true}
        />

        <StorySection
          title="Global Community"
          paragraphs={[
            'Today, DRIFTAE serves collectors in over 85 countries. Our community ranges from first-time buyers seeking their dream classic to seasoned collectors completing decades-long pursuits. We understand that every acquisition represents both a financial investment and an emotional connection to automotive history.',
            'Our dedicated advisory team provides personalized guidance — whether you need help selecting your first classic, advice on storage and maintenance, or assistance tracking down a rare automotive treasure.',
          ]}
          image="/images/hero-showroom.png"
          imageLeft={false}
          stats={[
            { value: '10,000+', label: 'Collectors' },
            { value: '85', label: 'Countries' },
            { value: '98%', label: 'Satisfaction' },
          ]}
        />
      </div>
    </div>
  );
}
