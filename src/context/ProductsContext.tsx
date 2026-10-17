import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Product, ProductsCatalog } from '../types/product';
import { getRelatedProducts as relatedFromList } from '../lib/product-utils';
import { applyTrademeLinks, type TrademeLinksFile } from '../lib/trademe-links';

const catalogUrl =
  import.meta.env.VITE_PRODUCTS_URL?.trim() || `${import.meta.env.BASE_URL}products.json`;

const trademeLinksEnabled = import.meta.env.VITE_TRADEME_LINKS === 'true';

const linksUrl =
  import.meta.env.VITE_TRADEME_LINKS_URL?.trim() ||
  `${import.meta.env.BASE_URL}trademe-links.json`;

/** Live prices + Trade Me listing ids from the ledger app (refreshed by the ops server every 30 min). */
const feedUrl =
  import.meta.env.VITE_STOREFRONT_FEED_URL?.trim() || 'https://ledger-nu-ruddy.vercel.app/api/storefront';

type FeedFile = { products?: Record<string, { price?: number; listingId?: string }> };

async function fetchJson<T>(url: string, timeoutMs: number): Promise<T | null> {
  try {
    const res = await fetch(url, { cache: 'no-cache', signal: AbortSignal.timeout(timeoutMs) });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

/** The live feed decides which listing is live; the static file only fills in a price the feed lacks. */
function mergeLinks(staticLinks: TrademeLinksFile, feed: FeedFile | null): TrademeLinksFile {
  if (!feed?.products) return staticLinks;
  const out: TrademeLinksFile = {};
  for (const id of new Set([...Object.keys(staticLinks), ...Object.keys(feed.products)])) {
    const live = feed.products[id];
    const price = live?.price ?? staticLinks[id]?.price;
    out[id] = { ...(price ? { price } : {}), ...(live?.listingId ? { listingId: live.listingId } : {}) };
  }
  return out;
}

type ProductsContextValue = {
  products: Product[];
  loading: boolean;
  error: string | null;
  getProductById: (id: string) => Product | undefined;
  getRelatedProducts: (productId: string, limit?: number) => Product[];
};

const ProductsContext = createContext<ProductsContextValue | null>(null);

function stripMetaKeys(raw: TrademeLinksFile): TrademeLinksFile {
  return Object.fromEntries(
    Object.entries(raw).filter(([key]) => !key.startsWith('_')),
  );
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const catalogRes = await fetch(catalogUrl, { cache: 'no-cache' });
        if (!catalogRes.ok) throw new Error(`Could not load catalog (${catalogRes.status})`);

        const data = (await catalogRes.json()) as ProductsCatalog;
        let base = Array.isArray(data.products) ? data.products : [];

        if (trademeLinksEnabled) {
          const [linksRaw, feed] = await Promise.all([
            fetchJson<TrademeLinksFile>(linksUrl, 5000),
            fetchJson<FeedFile>(feedUrl, 3000),
          ]);
          base = applyTrademeLinks(base, mergeLinks(stripMetaKeys(linksRaw ?? {}), feed));
        }

        if (!cancelled) {
          setProducts(base);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setProducts([]);
          setError(e instanceof Error ? e.message : 'Failed to load products');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<ProductsContextValue>(
    () => ({
      products,
      loading,
      error,
      getProductById: (id) => products.find((p) => p.id === id),
      getRelatedProducts: (productId, limit) => relatedFromList(products, productId, limit),
    }),
    [products, loading, error],
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
  return ctx;
}
