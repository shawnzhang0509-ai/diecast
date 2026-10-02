import type { Product } from '../types/product';

/** Stable storefront id; Trade Me listing id changes on every relist. */
export type TrademeLinkEntry = {
  listingId?: number | string;
  /** Paste full URL after relist; prefer listingId long term. */
  trademeUrl?: string;
  price?: number;
  status?: Product['status'];
  sold?: boolean;
};

export type TrademeLinksFile = Record<string, TrademeLinkEntry>;

const LISTING_ID_RE = /\/a\/listing\/(\d+)/i;

export function trademeUrlFromListingId(listingId: number | string): string {
  return `https://www.trademe.co.nz/a/listing/${listingId}`;
}

export function parseListingIdFromUrl(url: string): string | undefined {
  const m = url.match(LISTING_ID_RE);
  return m?.[1];
}

export function resolveTrademeUrl(entry: TrademeLinkEntry | undefined): string | undefined {
  if (!entry) return undefined;
  if (entry.sold) return undefined;
  if (entry.listingId != null && String(entry.listingId).length > 0) {
    return trademeUrlFromListingId(entry.listingId);
  }
  if (entry.trademeUrl?.trim()) {
    return entry.trademeUrl.trim();
  }
  return undefined;
}

export function applyTrademeLinks(products: Product[], links: TrademeLinksFile): Product[] {
  return products.map((p) => {
    const link = links[p.id];
    if (!link) return p;

    const trademeUrl = resolveTrademeUrl(link);
    const status = link.sold ? ('sale' as const) : link.status ?? p.status;
    const price = typeof link.price === 'number' ? link.price : p.price;

    return {
      ...p,
      price,
      status,
      trademeUrl,
      trademeListingId:
        link.listingId != null
          ? String(link.listingId)
          : link.trademeUrl
            ? parseListingIdFromUrl(link.trademeUrl)
            : undefined,
    };
  });
}
