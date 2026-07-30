import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router';
import gsap from 'gsap';
import { getProductById, getRelatedProducts } from '../data/products';
import { ShieldCheck, Truck, RotateCcw, Headphones, Heart } from 'lucide-react';
import type { Product } from '../data/products';

function RelatedCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group block bg-[#0C0C0C] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
      data-cursor-hover
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-105"
        />
      </div>
      <div style={{ padding: 20 }}>
        <p className="font-body text-[12px] font-normal tracking-[0.05em] text-[#777777]">{product.brand}</p>
        <h3 className="mt-1 font-display text-[14px] font-medium leading-[1.4] text-[#F0F0F0]">{product.name}</h3>
        <p className="mt-1 font-body text-[12px] tracking-[0.05em] text-[#D24E35]">${product.price.toLocaleString()}</p>
      </div>
    </Link>
  );
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
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

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0C0C0C]">
        <div className="text-center">
          <h2 className="font-display text-[24px] text-[#F0F0F0]">Product Not Found</h2>
          <Link to="/" className="mt-4 inline-block text-[#D24E35] hover:underline">Return to Home</Link>
        </div>
      </div>
    );
  }

  const specEntries = Object.entries(product.specs);

  return (
    <div ref={pageRef} className="bg-[#0C0C0C]">
      {/* Product Detail */}
      <div className="mx-auto pt-20" style={{ maxWidth: 1400, padding: '120px 40px 0' }}>
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 font-body text-[12px] tracking-[0.05em] text-[#777777]">
          <Link to="/" className="transition-colors hover:text-[#F0F0F0]">Home</Link>
          <span>/</span>
          <span className="cursor-pointer transition-colors hover:text-[#F0F0F0]">Models</span>
          <span>/</span>
          <span className="text-[#F0F0F0]">{product.brand}</span>
        </nav>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          {/* Gallery - 60% */}
          <div className="lg:col-span-3">
            {/* Main Image */}
            <div className="relative overflow-hidden bg-[#111111]" style={{ aspectRatio: '4/3' }}>
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="h-full w-full object-cover transition-opacity duration-300"
              />
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden border-2 transition-colors ${
                      i === activeImage ? 'border-[#D24E35]' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info - 40% */}
          <div className="lg:col-span-2 lg:pl-8">
            {/* Brand Badge */}
            <div className="mb-3 flex items-center gap-2">
              <span className="font-body text-[12px] font-medium uppercase tracking-[0.08em] text-[#777777]">
                {product.brand.toUpperCase()}
              </span>
            </div>

            <h1 className="font-display text-[36px] font-normal leading-[1.2] tracking-[-1px] text-[#F0F0F0] sm:text-[42px]">
              {product.name}
            </h1>

            <p className="mt-2 font-body text-[14px] text-[#777777]">
              {product.scale} Scale {product.material} Model — {product.edition || 'Limited Edition'}
            </p>

            {/* Price */}
            <div className="mt-6">
              <p className="font-display text-[28px] font-normal text-[#D24E35]">
                ${product.price.toLocaleString()}
              </p>
              <p className="mt-1 font-body text-[12px] text-[#777777]">
                or 4 interest-free payments of ${(product.price / 4).toFixed(2)}
              </p>
            </div>

            {/* Spec Table */}
            {specEntries.length > 0 && (
              <div className="mt-8 border-t border-[#222222]">
                {specEntries.map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between border-b border-[#222222] py-3"
                  >
                    <span className="font-body text-[13px] text-[#777777]">{key}</span>
                    <span className="font-body text-[13px] text-[#F0F0F0]">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8">
              <button className="w-full bg-[#D24E35] py-4 font-body text-[13px] font-medium uppercase tracking-[0.05em] text-white transition-colors duration-200 hover:bg-[#B84028]">
                Add to Cart
              </button>
              <button className="mt-3 flex w-full items-center justify-center gap-2 border border-[#444444] bg-transparent py-4 font-body text-[13px] font-medium uppercase tracking-[0.05em] text-[#F0F0F0] transition-colors duration-200 hover:border-[#F0F0F0]">
                <Heart size={16} strokeWidth={1.5} />
                Add to Wishlist
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { icon: ShieldCheck, label: 'Authenticity Guaranteed' },
                { icon: Truck, label: 'Global Insured Shipping' },
                { icon: RotateCcw, label: '14-Day Returns' },
                { icon: Headphones, label: 'Collector Support' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon size={16} strokeWidth={1.5} className="flex-shrink-0 text-[#777777]" />
                  <span className="font-body text-[11px] text-[#777777]">{label}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <p className="mt-8 font-body text-[14px] leading-[1.6] text-[#777777]">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="bg-[#111111]" style={{ marginTop: 100, padding: '100px 0' }}>
          <div className="mx-auto" style={{ maxWidth: 1400, padding: '0 40px' }}>
            <h2 className="mb-10 font-display text-[24px] font-normal leading-[1.3] text-[#F0F0F0]">
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
