import { Link } from 'react-router';
import { formatPrice, pickMarqueeProducts, productMetaLine } from '../data/products';
import ProductImage from '../components/ProductImage';
import { useProducts } from '../context/ProductsContext';

export default function InStockNow() {
  const { products } = useProducts();
  const marqueeProducts = pickMarqueeProducts(products);
  if (marqueeProducts.length === 0) return null;

  const doubledProducts = [...marqueeProducts, ...marqueeProducts];

  return (
    <section
      id="in-stock"
      className="relative overflow-hidden bg-[#0D0D0D]"
      style={{ paddingTop: 96, paddingBottom: 96 }}
    >
      <div className="mx-auto mb-12 px-5 sm:mb-16 sm:px-10" style={{ maxWidth: 1400 }}>
        <h2 className="font-display text-[24px] font-light leading-[1.3] text-driftae-white">
          In Stock Now
        </h2>
        <p className="mt-2 font-body text-[12px] font-normal tracking-[0.05em] text-driftae-muted">
          1:18 diecast models — available to ship from New Zealand.
        </p>
      </div>

      {/* Desktop: slow loop that pauses on hover. Phones / reduced motion: swipe instead. */}
      <div className="marquee relative overflow-x-auto overscroll-x-contain px-5 md:overflow-hidden md:px-0">
        <div className="marquee-track flex gap-4 md:gap-6" style={{ width: 'max-content' }}>
          {doubledProducts.map((product, index) => (
            <Link
              key={`${product.id}-${index}`}
              to={`/product/${product.id}`}
              aria-hidden={index >= marqueeProducts.length || undefined}
              tabIndex={index >= marqueeProducts.length ? -1 : undefined}
              className={`group relative w-[260px] flex-shrink-0 sm:w-[340px] ${index >= marqueeProducts.length ? 'marquee-clone' : ''} overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111111] p-3 transition-all duration-300 hover:border-driftae-gold/25 hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)]`}
              data-cursor-hover
            >
              <div className="relative">
                <ProductImage
                  src={product.image}
                  alt={product.name}
                  aspectRatio="1/1"
                  padding="md"
                  hoverScale
                  className="rounded-xl"
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-500 group-hover:bg-black/30">
                  <span className="font-body text-[12px] font-medium uppercase tracking-[0.08em] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    View
                  </span>
                </div>
              </div>
              <div className="mt-4 px-1 pb-1">
                <p className="font-body text-[12px] font-normal tracking-[0.05em] text-[#777777]">
                  {productMetaLine(product)}
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

      <div className="pointer-events-none absolute left-0 top-0 hidden h-full w-32 bg-gradient-to-r from-[#0D0D0D] to-transparent md:block" />
      <div className="pointer-events-none absolute right-0 top-0 hidden h-full w-32 bg-gradient-to-l from-[#0D0D0D] to-transparent md:block" />
    </section>
  );
}
