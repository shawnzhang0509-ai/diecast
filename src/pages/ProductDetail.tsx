import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router';
import gsap from 'gsap';
import { getProductById, getRelatedProducts, formatPrice } from '../data/products';
import { ShieldCheck, Truck, RotateCcw, Headphones, Heart } from 'lucide-react';
import type { Product } from '../data/products';

function RelatedCard({ product }: { product: Product }) {
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
      <div style={{ padding: 20 }}>
        <p className="font-body text-[12px] font-normal tracking-[0.05em] text-[#777777]">{product.brand}</p>
        <h3 className="mt-1 font-display text-[14px] font-medium leading-[1.4] text-[#F7F7F7]">{product.name}</h3>
        <p className="mt-1 font-body text-[12px] tracking-[0.05em] text-[#C7A96B]">{formatPrice(product.price)}</p>
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
      <div className="flex min-h-screen items-center justify-center bg-[#0D0D0D]">
        <div className="text-center">
          <h2 className="font-display text-[24px] text-[#F7F7F7]">未找到车辆</h2>
          <Link to="/" className="mt-4 inline-block text-[#C7A96B] hover:underline">返回首页</Link>
        </div>
      </div>
    );
  }

  const specEntries = Object.entries(product.specs);

  return (
    <div ref={pageRef} className="bg-[#0D0D0D]">
      <div className="mx-auto pt-20" style={{ maxWidth: 1400, padding: '120px 40px 0' }}>
        <nav className="mb-8 flex items-center gap-2 font-body text-[12px] tracking-[0.05em] text-[#777777]">
          <Link to="/" className="transition-colors hover:text-[#F7F7F7]">首页</Link>
          <span>/</span>
          <span className="cursor-pointer transition-colors hover:text-[#F7F7F7]">收藏</span>
          <span>/</span>
          <span className="text-[#F7F7F7]">{product.brand}</span>
        </nav>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="relative overflow-hidden bg-[#141414]" style={{ aspectRatio: '4/3' }}>
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="h-full w-full object-cover transition-opacity duration-300"
              />
            </div>

            {product.images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden border-2 transition-colors ${
                      i === activeImage ? 'border-[#C7A96B]' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-2 lg:pl-8">
            <div className="mb-3 flex items-center gap-2">
              <span className="font-body text-[12px] font-medium uppercase tracking-[0.08em] text-[#C7A96B]">
                {product.brand.toUpperCase()}
              </span>
            </div>

            <h1 className="font-display text-[36px] font-light leading-[1.2] tracking-[0.05em] text-[#F7F7F7] sm:text-[42px]">
              {product.name}
            </h1>

            <p className="mt-2 font-body text-[14px] text-[#777777]">
              {product.year} · {product.mileage} — {product.edition || '经典收藏'}
            </p>

            <div className="mt-6">
              <p className="font-display text-[28px] font-normal text-[#C7A96B]">
                {formatPrice(product.price)}
              </p>
              {product.price < 1000000 && (
                <p className="mt-1 font-body text-[12px] text-[#777777]">
                  或分 4 期免息，每期 ${(product.price / 4).toLocaleString()}
                </p>
              )}
            </div>

            {specEntries.length > 0 && (
              <div className="mt-8 border-t border-[#1F1F1F]">
                {specEntries.map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between border-b border-[#1F1F1F] py-3"
                  >
                    <span className="font-body text-[13px] text-[#777777]">{key}</span>
                    <span className="font-body text-[13px] text-[#F7F7F7]">{value}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8">
              <button className="w-full bg-[#C7A96B] py-4 font-body text-[13px] font-medium uppercase tracking-[0.1em] text-[#0D0D0D] transition-colors duration-200 hover:bg-[#A89258]">
                预约看车
              </button>
              <button className="mt-3 flex w-full items-center justify-center gap-2 border border-[#444444] bg-transparent py-4 font-body text-[13px] font-medium uppercase tracking-[0.1em] text-[#F7F7F7] transition-colors duration-200 hover:border-[#C7A96B]">
                <Heart size={16} strokeWidth={1.5} />
                加入收藏
              </button>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { icon: ShieldCheck, label: '车况认证' },
                { icon: Truck, label: '全球运输保险' },
                { icon: RotateCcw, label: '专业检测' },
                { icon: Headphones, label: '专属顾问' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon size={16} strokeWidth={1.5} className="flex-shrink-0 text-[#C7A96B]" />
                  <span className="font-body text-[11px] text-[#777777]">{label}</span>
                </div>
              ))}
            </div>

            <p className="mt-8 font-body text-[14px] leading-[1.6] text-[#777777]">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="bg-[#141414]" style={{ marginTop: 100, padding: '100px 0' }}>
          <div className="mx-auto" style={{ maxWidth: 1400, padding: '0 40px' }}>
            <h2 className="mb-10 font-display text-[24px] font-light leading-[1.3] text-[#F7F7F7]">
              您可能还喜欢
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
