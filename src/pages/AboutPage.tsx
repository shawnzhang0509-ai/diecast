import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
      <h3 className="font-display text-[28px] font-normal leading-[1.3] text-[#F0F0F0] sm:text-[36px]">
        {title}
      </h3>
      {paragraphs.map((p, i) => (
        <p key={i} className="mt-4 font-body text-[14px] font-normal leading-[1.6] text-[#777777]">
          {p}
        </p>
      ))}
      {stats && (
        <div className="mt-8 grid grid-cols-3 gap-8">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-[28px] font-normal leading-[1.0] tracking-[-1px] text-[#F0F0F0]">
                {stat.value}
              </p>
              <p className="mt-2 font-body text-[12px] font-normal tracking-[0.05em] text-[#777777]">
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
    <div className="bg-[#0C0C0C]">
      {/* Hero */}
      <div
        ref={heroRef}
        className="flex flex-col items-center justify-center bg-[#111111] text-center"
        style={{ minHeight: '70vh', padding: '0 40px' }}
      >
        <h1 className="animate-in font-display text-[36px] font-normal leading-[1.2] tracking-[-1px] text-[#F0F0F0] sm:text-[48px]">
          Where Passion Meets Precision
        </h1>
        <p className="animate-in mt-6 max-w-[640px] font-body text-[14px] font-normal leading-[1.6] text-[#777777]">
          Founded by collectors, for collectors. Apex Diecast bridges the gap between automotive enthusiasts and the world's finest model manufacturers.
        </p>
      </div>

      {/* Story Sections */}
      <div className="mx-auto" style={{ maxWidth: 1400 }}>
        <StorySection
          title="Our Beginning"
          paragraphs={[
            'What started as a personal passion for automotive excellence has evolved into a global destination for discerning collectors. Our founder, a lifelong car enthusiast, recognized that the market lacked a curated platform for premium scale models — one that treated these miniatures with the reverence they deserve.',
            'In 2019, Apex Diecast was born with a simple mission: to connect collectors with the finest scale models from the world\'s most respected manufacturers. Every model we stock is hand-selected, authenticated, and presented with the care of a gallery exhibition.',
          ]}
          image="/images/about-craft.png"
          imageLeft={false}
        />

        <StorySection
          title="Curated Excellence"
          paragraphs={[
            'We maintain direct relationships with manufacturers including MR Collection, BBR Models, AUTOart, and Amalgam — ensuring every model is authentic and sourced through official channels. Our selection criteria are uncompromising: only models that demonstrate exceptional accuracy, finish quality, and attention to detail make it into our collection.',
            'Each listing includes comprehensive specifications, high-resolution photography, and detailed condition reports. We believe transparency is essential when investing in collectible automotive art.',
          ]}
          image="/images/collection-lifestyle.png"
          imageLeft={true}
        />

        <StorySection
          title="Global Community"
          paragraphs={[
            'Today, Apex Diecast serves collectors in over 85 countries. Our community ranges from first-time buyers seeking their centerpiece model to seasoned collectors completing decades-long acquisitions. We understand that each purchase represents both a financial investment and an emotional connection to automotive history.',
            'Our dedicated collector support team provides personalized guidance — whether you need help selecting your first model, advice on display and preservation, or assistance tracking down a rare discontinued piece.',
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
