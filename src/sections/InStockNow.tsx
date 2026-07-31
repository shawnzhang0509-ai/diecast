import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { marqueeProducts, formatPrice } from '../data/products';

export default function InStockNow() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const animate = () => {
      if (!track) return;
      const currentX = parseFloat(track.getAttribute('data-x') || '0');
      const newX = currentX - 0.5;
      track.setAttribute('data-x', String(newX));
      track.style.transform = `translateX(${newX}px)`;
      requestAnimationFrame(animate);
    };

    const raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const doubledProducts = [...marqueeProducts, ...marqueeProducts];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0D0D0D]"
      style={{ paddingTop: 120, paddingBottom: 120 }}
    >
      <div className="mb-16 px-6" style={{ maxWidth: 1400, margin: '0 auto 64px', paddingLeft: 40, paddingRight: 40 }}>
        <h2 className="font-display text-[24px] font-light leading-[1.3] text-driftae-white">
          In Stock Now
        </h2>
        <p className="mt-2 font-body text-[12px] font-normal tracking-[0.05em] text-driftae-muted">
          Limited classic vehicles available for immediate delivery.
        </p>
      </div>

      <div className="relative overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-6"
          data-x="0"
          style={{ width: 'max-content' }}
        >
          {doubledProducts.map((product, index) => (
            <Link
              key={`${product.id}-${index}`}
              to={`/product/${product.id}`}
              className="group relative flex-shrink-0"
              style={{ width: 340 }}
              data-cursor-hover
            >
              <div className="relative overflow-hidden bg-[#141414]" style={{ aspectRatio: '3/4' }}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-500 group-hover:bg-black/30">
                  <span className="font-body text-[12px] font-medium uppercase tracking-[0.08em] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    View
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <p className="font-body text-[12px] font-normal tracking-[0.05em] text-[#777777]">
                  {product.brand} · {product.year}
                </p>
                <h3 className="mt-1 font-display text-[16px] font-medium leading-[1.4] tracking-[0.05em] text-[#F7F7F7]">
                  {product.name}
                </h3>
                <p className="mt-1 font-body text-[12px] font-normal tracking-[0.05em] text-[#C7A96B]">
                  {formatPrice(product.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-[#0D0D0D] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-[#0D0D0D] to-transparent" />
    </section>
  );
}
