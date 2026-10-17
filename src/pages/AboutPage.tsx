import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Logo from '../components/Logo';
import { usePageTitle } from '../hooks/use-page-title';
import { CONTACT_EMAIL, FACEBOOK_URL, MESSENGER_URL, TRADEME_SHOP_URL } from '@/config/site-links';
import { SHIPPING_ZONES, formatNzd } from '@/config/shipping';

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
    <div className="relative h-[300px] overflow-hidden lg:h-[450px]">
      <img
        src={image}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover"
      />
    </div>
  );

  const contentEl = (
    <div ref={contentRef} className="flex flex-col justify-center px-5 pt-8 sm:px-10 lg:pt-0">
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
  usePageTitle('About');

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
        style={{ minHeight: '60vh', padding: '96px 20px 0' }}
      >
        <div className="animate-in">
          <Logo variant="full" showTagline />
        </div>
        <p className="animate-in mt-8 max-w-[640px] font-body text-[14px] font-normal leading-[1.7] text-driftae-muted">
          A small New Zealand shop for 1:18 diecast model cars, run by collectors for collectors.
        </p>
      </div>

      <div className="mx-auto" style={{ maxWidth: 1400 }}>
        <StorySection
          title="Why DRIFTAE"
          paragraphs={[
            'We collect 1:18 diecast ourselves, and in New Zealand the good ones are hard to find: rally cars that won here, the Porsches and Mercedes we grew up with, the hot hatches of the 70s and 80s.',
            'DRIFTAE sources those models from trusted suppliers of makers like NOREV and Sun Star and delivers them NZ-wide. Every model is brand new in its original manufacturer packaging and inspected before dispatch.',
          ]}
          image="/images/about-craft.jpg"
          imageLeft={false}
        />

        <StorySection
          title="Honest Listings"
          paragraphs={[
            'Each model page shows the real photos, the maker, the scale and what opens or steers, so you know exactly what you are getting.',
            'Most of our range is also on Trade Me, where you can buy with Trade Me\'s buyer protection. If a model is not listed right now, message us and we will confirm price and availability.',
          ]}
          image="/social/mcrae-555-rear.jpg"
          imageLeft={true}
        />
      </div>

      <div
        className="mx-auto border-t border-driftae-gold/20 bg-driftae-surface px-5 py-20 sm:px-10"
        style={{ maxWidth: 1400 }}
      >
        <section id="shipping" className="scroll-mt-28">
          <h2 className="font-display text-[28px] font-light text-driftae-white">Shipping & Delivery</h2>
          <p className="mt-4 max-w-[720px] font-body text-[14px] leading-relaxed text-driftae-muted">
            We source each model from trusted overseas suppliers, inspect it, and dispatch it within New
            Zealand by tracked courier (Aramex / NZ Post). Delivery is usually about 2–3 weeks after your
            order is confirmed. Need it sooner, or outside New Zealand? Message us before ordering.
          </p>
          <table className="mt-6 w-full max-w-[520px] font-body text-[14px]">
            <thead>
              <tr className="border-b border-driftae-border text-left text-[12px] uppercase tracking-[0.1em] text-driftae-muted">
                <th className="py-2 font-medium">Delivery to</th>
                <th className="py-2 font-medium">Courier</th>
                <th className="py-2 text-right font-medium">Cost</th>
              </tr>
            </thead>
            <tbody>
              {SHIPPING_ZONES.map((z) => (
                <tr key={z.id} className="border-b border-driftae-border text-driftae-muted">
                  <td className="py-2 text-driftae-white">{z.label}</td>
                  <td className="py-2">{z.courier}</td>
                  <td className="py-2 text-right text-driftae-white">{formatNzd(z.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section id="faq" className="mt-16 scroll-mt-28">
          <h2 className="font-display text-[28px] font-light text-driftae-white">FAQ</h2>
          <ul className="mt-6 max-w-[720px] space-y-4 font-body text-[14px] leading-relaxed text-driftae-muted">
            <li>
              <strong className="text-driftae-white">Where do I buy?</strong> — Many items are listed
              on our{' '}
              <a
                href={TRADEME_SHOP_URL}
                className="text-driftae-gold hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Trade Me shop
              </a>
               — each model page has a &quot;Buy on Trade Me&quot; button when it&apos;s listed. Otherwise, message us.
            </li>
            <li>
              <strong className="text-driftae-white">Are they new?</strong> — Yes, every model is brand
              new in its original manufacturer packaging.
            </li>
            <li>
              <strong className="text-driftae-white">Are photos exact?</strong> — Photos show the model
              we sell. Colours may vary slightly by screen.
            </li>
          </ul>
        </section>

        <section id="contact" className="mt-16 scroll-mt-28">
          <h2 className="font-display text-[28px] font-light text-driftae-white">Contact</h2>
          <p className="mt-4 font-body text-[14px] text-driftae-muted">
            Message us on{' '}
            <a href={MESSENGER_URL} target="_blank" rel="noopener noreferrer" className="text-driftae-gold hover:underline">
              Messenger
            </a>
            , find us on{' '}
            <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="text-driftae-gold hover:underline">
              Facebook
            </a>
            , or email{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-driftae-gold hover:underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
