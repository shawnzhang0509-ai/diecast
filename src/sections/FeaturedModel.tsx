import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { formatPrice, pickFeaturedProduct } from '../data/products';
import BrandTagline from '../components/BrandTagline';
import { useProducts } from '../context/ProductsContext';
import ProductImage from '../components/ProductImage';

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedModel() {
  const { products } = useProducts();
  const featured = pickFeaturedProduct(products);
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
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, [featured?.id]);

  if (!featured) return null;

  const specEntries = Object.entries(featured.specs).slice(0, 4);
  const displaySpecs =
    specEntries.length > 0
      ? specEntries.map(([label, value]) => ({ label, value }))
      : featured.brand
        ? [{ label: 'Brand', value: featured.brand }]
        : [];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-y border-driftae-gold/10 bg-driftae-surface"
      style={{ minHeight: '100vh' }}
    >
      <div className="mx-auto flex min-h-screen flex-col lg:flex-row" style={{ maxWidth: 1400 }}>
        <div className="relative flex-1 lg:max-w-[55%]">
          <div className="relative flex h-[50vh] items-stretch p-4 sm:p-6 lg:h-screen lg:p-10">
            <div className="relative min-h-0 flex-1">
              <ProductImage
                src={featured.image}
                alt={featured.name}
                fill
                padding="lg"
                className="h-full rounded-2xl"
              />
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-[#141414]/90 via-transparent to-transparent" />
            </div>
          </div>
        </div>

        <div
          ref={contentRef}
          className="flex flex-1 flex-col justify-center px-8 py-16 lg:max-w-[45%] lg:px-16"
        >
          <BrandTagline text="Featured" className="mb-4" />
          <h2 className="font-display text-[36px] font-light leading-[1.2] tracking-[0.05em] text-driftae-white sm:text-[48px]">
            {featured.name}
          </h2>

          {displaySpecs.length > 0 && (
            <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-4">
              {displaySpecs.map((spec) => (
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
          )}

          <p className="mt-8 font-body text-[14px] font-normal leading-[1.6] text-driftae-muted">
            {featured.description}
          </p>

          <p className="mt-6 font-display text-[24px] font-normal text-[#C7A96B]">
            {formatPrice(featured.price)}
          </p>

          <Link
            to={`/product/${featured.id}`}
            className="mt-8 inline-block self-start border border-[#C7A96B] bg-transparent px-8 py-3.5 font-body text-[13px] font-medium uppercase tracking-[0.1em] text-[#C7A96B] transition-all duration-300 hover:bg-[#C7A96B] hover:text-[#0D0D0D]"
          >
            View Details
          </Link>
        </div>
      </div>
    </section>
  );
}
