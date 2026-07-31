import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { newArrivals, formatPrice } from '../data/products';
import type { Product } from '../data/products';

gsap.registerPlugin(ScrollTrigger);

function ProductCard({ product }: { product: Product }) {
  const statusLabel = product.status === 'new' ? 'NEW' : product.status === 'preorder' ? 'PRE-ORDER' : '';
  const statusColor = product.status === 'preorder' ? 'text-[#F7F7F7]' : 'text-[#C7A96B]';

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block bg-[#0D0D0D] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
      data-cursor-hover
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-105"
        />
      </div>

      <div style={{ padding: 24 }}>
        {statusLabel && (
          <span className={`font-body text-[12px] font-medium uppercase tracking-[0.08em] ${statusColor}`}>
            {statusLabel}
          </span>
        )}
        <h3 className="mt-2 font-display text-[16px] font-medium leading-[1.4] tracking-[0.05em] text-[#F7F7F7]">
          {product.name}
        </h3>
        <p className="mt-1 font-body text-[12px] font-normal tracking-[0.05em] text-[#777777]">
          {product.year} · {product.mileage}
        </p>
        <p className="mt-2 font-body text-[12px] font-normal tracking-[0.05em] text-[#C7A96B]">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}

export default function NewArrivals() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    if (!section || !grid) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        grid.children,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
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

  return (
    <section
      id="new-arrivals"
      ref={sectionRef}
      className="bg-[#141414]"
      style={{ padding: '120px 0' }}
    >
      <div className="mx-auto" style={{ maxWidth: 1400, padding: '0 40px' }}>
        <div className="mb-12 flex items-end justify-between">
          <h2 className="font-display text-[36px] font-light leading-[1.2] tracking-[0.05em] text-driftae-white sm:text-[48px]">
            New Arrivals
          </h2>
          <button className="group hidden items-center gap-2 font-body text-[14px] font-normal text-driftae-muted transition-colors duration-200 hover:text-driftae-white sm:flex">
            View All
            <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
