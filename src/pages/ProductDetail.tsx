import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router';
import gsap from 'gsap';
import { formatPrice } from '../data/products';
import { ShieldCheck, Truck, RotateCcw, Headphones, Heart, ExternalLink } from 'lucide-react';
import type { Product } from '../data/products';
import { useProducts } from '../context/ProductsContext';
import ProductImage from '../components/ProductImage';
import { productMetaLine, extractMarque } from '../data/products';

function RelatedCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group block overflow-hidden rounded-2xl border border-white/[0.06] bg-driftae-black p-2 transition-all duration-300 hover:-translate-y-1 hover:border-driftae-gold/20 hover:shadow-[0_12px_36px_rgba(0,0,0,0.4)]"
      data-cursor-hover
    >
      <ProductImage src={product.image} alt={product.name} aspectRatio="4/3" hoverScale className="rounded-xl" />
      <div style={{ padding: 20 }}>
        <p className="font-body text-[12px] font-normal tracking-[0.05em] text-driftae-muted">{product.brand}</p>
        <h3 className="mt-1 font-display text-[14px] font-medium leading-[1.4] text-driftae-white">{product.name}</h3>
        <p className="mt-1 font-body text-[12px] tracking-[0.05em] text-driftae-gold">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { getProductById, getRelatedProducts, loading } = useProducts();
  const product = getProductById(id || '');
  const related = product ? getRelatedProducts(product.id, 4) : [];
  const [activeImage, setActiveImage] = useState(0);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!product) return;
    window.scrollTo(0, 0);
    setActiveImage(0);
  }, [id, product]);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    gsap.fromTo(
      page,
      { opacity: 0, scale: 1.02 },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }
    );
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-driftae-black">
        <p className="font-body text-driftae-muted">Loading…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-driftae-black">
        <div className="text-center">
          <h2 className="font-display text-[24px] text-driftae-white">Product Not Found</h2>
          <Link to="/" className="mt-4 inline-block text-driftae-gold hover:underline">Return to Home</Link>
        </div>
      </div>
    );
  }

  const subtitle = productMetaLine(product) || product.edition || '';

  const specEntries = Object.entries(product.specs);

  return (
    <div ref={pageRef} className="bg-driftae-black">
      <div className="mx-auto pt-20" style={{ maxWidth: 1400, padding: '120px 40px 0' }}>
        <nav className="mb-8 flex items-center gap-2 font-body text-[12px] tracking-[0.05em] text-driftae-muted">
          <Link to="/" className="transition-colors hover:text-driftae-white">Home</Link>
          <span>/</span>
          <Link to="/collection" className="transition-colors hover:text-driftae-white">
            Collection
          </Link>
          {extractMarque(product) && (
            <>
              <span>/</span>
              <Link
                to={`/collection?marque=${encodeURIComponent(extractMarque(product))}`}
                className="transition-colors hover:text-driftae-white"
              >
                {extractMarque(product)}
              </Link>
            </>
          )}
        </nav>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ProductImage
              src={product.images[activeImage]}
              alt={product.name}
              aspectRatio="4/3"
              padding="lg"
              className="rounded-2xl bg-driftae-surface"
            />

            {product.images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 bg-[#1a1a1a] transition-colors ${
                      i === activeImage ? 'border-driftae-gold' : 'border-white/10'
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-2 lg:pl-8">
            <div className="mb-3 flex items-center gap-2">
              <span className="font-body text-[12px] font-medium uppercase tracking-[0.08em] text-driftae-gold">
                {(extractMarque(product) || product.brand).toUpperCase()}
              </span>
            </div>

            <h1 className="font-display text-[36px] font-light leading-[1.2] tracking-[0.05em] text-driftae-white sm:text-[42px]">
              {product.name}
            </h1>

            {(product.vehicleModel || product.specs?.Model) && (
              <p className="mt-2 font-display text-[18px] text-driftae-white">
                {product.vehicleModel || product.specs.Model}
              </p>
            )}
            {subtitle && (
              <p className="mt-1 font-body text-[14px] text-driftae-muted">{subtitle}</p>
            )}

            <div className="mt-6">
              <p className="font-display text-[28px] font-normal text-driftae-gold">
                {formatPrice(product.price)}
              </p>
            </div>

            {specEntries.length > 0 && (
              <div className="mt-8 border-t border-driftae-border">
                {specEntries.map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between border-b border-driftae-border py-3"
                  >
                    <span className="font-body text-[13px] text-driftae-muted">{key}</span>
                    <span className="font-body text-[13px] text-driftae-white">{value}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8">
              {product.trademeUrl ? (
                <a
                  href={product.trademeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold flex w-full items-center justify-center gap-2 py-4"
                >
                  Buy on Trade Me
                  <ExternalLink size={16} strokeWidth={1.5} />
                </a>
              ) : (
                <button type="button" className="btn-gold w-full py-4">
                  Inquire to purchase
                </button>
              )}
              <button
                type="button"
                className="mt-3 flex w-full items-center justify-center gap-2 border border-driftae-border bg-transparent py-4 font-body text-[13px] font-medium uppercase tracking-[0.1em] text-driftae-white transition-colors duration-200 hover:border-driftae-gold"
              >
                <Heart size={16} strokeWidth={1.5} />
                Add to Wishlist
              </button>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { icon: ShieldCheck, label: 'Authentic diecast' },
                { icon: Truck, label: 'NZ shipping' },
                { icon: RotateCcw, label: 'Carefully packed' },
                { icon: Headphones, label: 'Questions welcome' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon size={16} strokeWidth={1.5} className="flex-shrink-0 text-driftae-gold" />
                  <span className="font-body text-[11px] text-driftae-muted">{label}</span>
                </div>
              ))}
            </div>

            <p className="mt-8 font-body text-[14px] leading-[1.6] text-driftae-muted">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="bg-driftae-surface" style={{ marginTop: 100, padding: '100px 0' }}>
          <div className="mx-auto" style={{ maxWidth: 1400, padding: '0 40px' }}>
            <h2 className="mb-10 font-display text-[24px] font-light leading-[1.3] text-driftae-white">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <RelatedCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
