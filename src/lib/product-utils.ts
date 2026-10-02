import type { Product } from '../types/product';

export function getRelatedProducts(
  products: Product[],
  productId: string,
  limit: number = 4,
): Product[] {
  const product = products.find((p) => p.id === productId);
  if (!product) return products.slice(0, limit);
  return products
    .filter(
      (p) =>
        p.id !== productId &&
        (p.brand === product.brand || p.tags.some((t) => product.tags.includes(t))),
    )
    .slice(0, limit);
}

export function formatPrice(price: number): string {
  if (!price || price <= 0) return 'Inquire';
  if (price >= 1_000_000) {
    return `NZ$${(price / 1_000_000).toFixed(price % 1_000_000 === 0 ? 0 : 1)}M`;
  }
  return `NZ$${price.toLocaleString('en-NZ')}`;
}

export function deriveBrands(products: Product[]) {
  const seen = new Set<string>();
  const list: { name: string; descriptor: string; country: string }[] = [];
  for (const p of products) {
    const key = p.brand.toUpperCase();
    if (seen.has(key)) continue;
    seen.add(key);
    list.push({
      name: key,
      descriptor: p.brandShort || p.brand,
      country: '',
    });
  }
  return list.length ? list : [{ name: 'DRIFTAE', descriptor: 'Collectibles', country: 'NZ' }];
}

export function pickNewArrivals(products: Product[], limit = 8): Product[] {
  return [...products]
    .filter((p) => p.status === 'new' || p.status === 'instock')
    .slice(0, limit);
}

export function pickMarqueeProducts(products: Product[], limit = 12): Product[] {
  return products.length ? products.slice(0, limit) : [];
}

export function pickFeaturedProduct(products: Product[]): Product | undefined {
  return products.find((p) => p.status === 'new') ?? products[0];
}

export function productMetaLine(product: Product): string {
  const scale = product.specs?.Scale;
  return [product.brand, product.year || scale].filter(Boolean).join(' · ');
}
