import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router';
import { ChevronDown } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
import { extractMarque, formatPrice, productMetaLine } from '../data/products';
import type { Product } from '../data/products';
import ProductImage from '../components/ProductImage';
import { usePageTitle } from '../hooks/use-page-title';
import { MESSENGER_URL } from '@/config/site-links';

const KNOWN_MAKERS = ['NOREV', 'Sun Star'];
const PRICE_BANDS = [
  { id: 'under-200', label: 'Under NZ$200', test: (p: number) => p < 200 },
  { id: '200-250', label: 'NZ$200–250', test: (p: number) => p >= 200 && p <= 250 },
  { id: 'over-250', label: 'Over NZ$250', test: (p: number) => p > 250 },
];
const SORTS = [
  { id: '', label: 'Featured' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'year-asc', label: 'Year: oldest first' },
  { id: 'year-desc', label: 'Year: newest first' },
];

const makerOf = (p: Product) => (KNOWN_MAKERS.includes(p.brand) ? p.brand : 'Other');
const yearOf = (p: Product) => {
  const y = parseInt(p.year || p.specs?.Year || '', 10);
  return Number.isFinite(y) ? y : null;
};
const eraOf = (p: Product) => {
  const y = yearOf(p);
  return y ? `${Math.floor(y / 10) * 10}s` : null;
};

function FilterSelect({ label, value, onChange, options }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="font-body text-[11px] uppercase tracking-[0.1em] text-driftae-muted">{label}</span>
      <span className="relative mt-1.5 block">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full appearance-none border bg-[#0D0D0D] py-2.5 pl-3 pr-9 font-body text-[13px] focus:border-driftae-gold focus:outline-none ${value ? 'border-driftae-gold/60 text-driftae-white' : 'border-driftae-border text-driftae-muted'}`}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown size={14} strokeWidth={1.5} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-driftae-muted" />
      </span>
    </label>
  );
}

export default function CollectionPage() {
  const [params, setParams] = useSearchParams();
  const { products, loading } = useProducts();
  const marque = params.get('marque') ?? '';
  const maker = params.get('maker') ?? '';
  const era = params.get('era') ?? '';
  const price = params.get('price') ?? '';
  const buyNow = params.get('buy') === '1';
  const sort = params.get('sort') ?? '';

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true, preventScrollReset: true });
  };

  // Options come from the catalogue, so a filter never offers a choice with zero models.
  const options = useMemo(() => {
    const uniq = (xs: (string | null)[]) => [...new Set(xs.filter(Boolean) as string[])];
    return {
      marques: uniq(products.map(extractMarque)).sort(),
      makers: uniq(products.map(makerOf)).sort((a, b) => (a === 'Other' ? 1 : b === 'Other' ? -1 : a.localeCompare(b))),
      eras: uniq(products.map(eraOf)).sort(),
      prices: PRICE_BANDS.filter((b) => products.some((p) => p.price > 0 && b.test(p.price))),
    };
  }, [products]);

  const filtered = useMemo(() => {
    const band = PRICE_BANDS.find((b) => b.id === price);
    const out = products.filter(
      (p) =>
        (!marque || extractMarque(p).toLowerCase() === marque.toLowerCase()) &&
        (!maker || makerOf(p) === maker) &&
        (!era || eraOf(p) === era) &&
        (!band || (p.price > 0 && band.test(p.price))) &&
        (!buyNow || Boolean(p.trademeUrl)),
    );
    const priced = (p: Product, dir: 1 | -1) => (p.price > 0 ? p.price * dir : Infinity);
    const year = (p: Product, dir: 1 | -1) => (yearOf(p) ?? Infinity * dir) * dir;
    if (sort === 'price-asc') out.sort((a, b) => priced(a, 1) - priced(b, 1));
    if (sort === 'price-desc') out.sort((a, b) => priced(a, -1) - priced(b, -1));
    if (sort === 'year-asc') out.sort((a, b) => year(a, 1) - year(b, 1));
    if (sort === 'year-desc') out.sort((a, b) => year(a, -1) - year(b, -1));
    return out;
  }, [products, marque, maker, era, price, buyNow, sort]);

  const marqueLabel = options.marques.find((m) => m.toLowerCase() === marque.toLowerCase()) ?? marque;
  const anyFilter = Boolean(marque || maker || era || price || buyNow);
  const title = marque ? marqueLabel : 'All models';
  usePageTitle(marque ? `${marqueLabel} diecast models` : 'All diecast models');

  return (
    <div className="bg-driftae-black pt-28" style={{ paddingBottom: 100 }}>
      <div className="mx-auto px-5 sm:px-10" style={{ maxWidth: 1400 }}>
        <nav className="mb-6 flex items-center gap-2 font-body text-[12px] tracking-[0.05em] text-driftae-muted">
          <Link to="/" className="hover:text-driftae-white">
            Home
          </Link>
          <span>/</span>
          <span className="text-driftae-white">Collection</span>
          {marque && (
            <>
              <span>/</span>
              <span className="text-driftae-gold">{marqueLabel}</span>
            </>
          )}
        </nav>

        <h1 className="font-display text-[36px] font-light tracking-[0.05em] text-driftae-white sm:text-[48px]">
          {title}
        </h1>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <FilterSelect label="Make" value={marqueLabel} onChange={(v) => set('marque', v)}
            options={[{ value: '', label: 'All makes' }, ...options.marques.map((m) => ({ value: m, label: m }))]} />
          <FilterSelect label="Model maker" value={maker} onChange={(v) => set('maker', v)}
            options={[{ value: '', label: 'All makers' }, ...options.makers.map((m) => ({ value: m, label: m }))]} />
          <FilterSelect label="Era" value={era} onChange={(v) => set('era', v)}
            options={[{ value: '', label: 'All years' }, ...options.eras.map((e) => ({ value: e, label: e }))]} />
          <FilterSelect label="Price" value={price} onChange={(v) => set('price', v)}
            options={[{ value: '', label: 'Any price' }, ...options.prices.map((b) => ({ value: b.id, label: b.label }))]} />
          <FilterSelect label="Availability" value={buyNow ? '1' : ''} onChange={(v) => set('buy', v)}
            options={[{ value: '', label: 'All models' }, { value: '1', label: 'Buy now on Trade Me' }]} />
          <FilterSelect label="Sort" value={sort} onChange={(v) => set('sort', v)}
            options={SORTS.map((s) => ({ value: s.id, label: s.label }))} />
        </div>

        <div className="mt-5 flex items-center gap-4 font-body text-[13px] text-driftae-muted">
          <span>
            {filtered.length} of {products.length} model{products.length === 1 ? '' : 's'}
          </span>
          {anyFilter && (
            <button
              type="button"
              onClick={() => setParams(sort ? { sort } : {}, { replace: true, preventScrollReset: true })}
              className="text-driftae-gold hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {loading && <p className="mt-12 text-driftae-muted">Loading…</p>}

        {!loading && filtered.length === 0 && (
          <p className="mt-12 text-driftae-muted">
            No models match these filters.{' '}
            <a
              href={MESSENGER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-driftae-gold hover:underline"
            >
              Message us
            </a>{' '}
            and tell us what you&apos;re after.
          </p>
        )}

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
