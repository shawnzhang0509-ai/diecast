import { Link, useSearchParams } from 'react-router';
import { useProducts } from '../context/ProductsContext';
import { filterByMarque, formatPrice, productMetaLine } from '../data/products';
import ProductImage from '../components/ProductImage';

export default function CollectionPage() {
  const [params] = useSearchParams();
  const marque = params.get('marque');
  const { products, loading } = useProducts();
  const filtered = filterByMarque(products, marque);

  const title = marque ? marque : 'All models';

  return (
    <div className="bg-driftae-black pt-28" style={{ paddingBottom: 100 }}>
      <div className="mx-auto" style={{ maxWidth: 1400, padding: '0 40px' }}>
        <nav className="mb-6 flex items-center gap-2 font-body text-[12px] tracking-[0.05em] text-driftae-muted">
          <Link to="/" className="hover:text-driftae-white">
            Home
          </Link>
          <span>/</span>
          <span className="text-driftae-white">Collection</span>
          {marque && (
            <>
              <span>/</span>
              <span className="text-driftae-gold">{marque}</span>
            </>
          )}
        </nav>

        <h1 className="font-display text-[36px] font-light tracking-[0.05em] text-driftae-white sm:text-[48px]">
          {title}
        </h1>
        <p className="mt-3 font-body text-[14px] text-driftae-muted">
          {marque
            ? `${filtered.length} diecast model${filtered.length === 1 ? '' : 's'}`
            : `${products.length} models in catalog`}
        </p>

        {loading && <p className="mt-12 text-driftae-muted">Loading…</p>}

        {!loading && filtered.length === 0 && (
          <p className="mt-12 text-driftae-muted">
            No models for this marque yet.{' '}
            <Link to="/" className="text-driftae-gold hover:underline">
              Back to home
            </Link>
          </p>
        )}

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0D0D0D] p-3 transition-all hover:border-driftae-gold/20"
            >
              <ProductImage src={product.image} alt={product.name} aspectRatio="4/3" hoverScale className="rounded-xl" />
              <div className="mt-4 px-1 pb-2">
                <p className="font-body text-[12px] text-driftae-muted">{productMetaLine(product)}</p>
                <h2 className="mt-1 font-display text-[15px] font-medium leading-snug text-driftae-white">
                  {product.vehicleModel || product.name}
                </h2>
                <p className="mt-2 text-[12px] text-driftae-gold">{formatPrice(product.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
