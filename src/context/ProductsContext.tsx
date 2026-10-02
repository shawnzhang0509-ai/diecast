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
          const linksRes = await fetch(linksUrl, { cache: 'no-cache' });
          if (linksRes.ok) {
            const linksRaw = (await linksRes.json()) as TrademeLinksFile;
            base = applyTrademeLinks(base, stripMetaKeys(linksRaw));
          }
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
