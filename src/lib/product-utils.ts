import type { Product } from '../types/product';

/** Diecast makers in titles — not the vehicle marque. */
const MAKERS = /\b(Sun Star|NOREV|MINI GT|AutoArt|Kyosho|OttOmobile|Ignition Model)\b/i;

/** Longest first so "Mercedes-Benz" wins over "Mercedes". */
const MARQUES = [
  'Mercedes-Benz',
  'Alfa Romeo',
  'Aston Martin',
  'Land Rover',
  'DeLorean',
  'Volkswagen',
  'Lamborghini',
  'Porsche',
  'Ferrari',
  'McLaren',
  'Subaru',
  'Bugatti',
  'Jaguar',
  'Bentley',
  'Rolls-Royce',
  'Mustang',
  'Audi',
  'Ford',
  'BMW',
  'MINI',
  'Jeep',
  'Lexus',
  'Toyota',
  'Nissan',
  'Honda',
  'Mazda',
  'Volvo',
  'Peugeot',
  'Renault',
  'Citroën',
  'Citroen',
];

const MARQUE_TAGLINES: Record<string, string> = {
  Subaru: 'Rally & performance',
  Porsche: 'Sports car icon',
  'Mercedes-Benz': 'German engineering',
  Volkswagen: 'Classic VW',
  'Alfa Romeo': 'Italian soul',
  DeLorean: 'Back to the Future',
  Audi: 'Quattro legend',
  Ford: 'American muscle',
  MINI: 'British icon',
};

export function extractMarque(product: Product): string {
  if (product.tags?.includes('marque:')) {
    const t = product.tags.find((x) => x.startsWith('marque:'));
    if (t) return t.slice(7);
  }
  let title = product.name.replace(MAKERS, ' ').replace(/\s+/g, ' ').trim();
  for (const m of MARQUES) {
    const re = new RegExp(`\\b${m.replace(/-/g, '[- ]')}\\b`, 'i');
    if (re.test(title)) {
      if (m.toLowerCase() === 'mustang') return 'Ford';
      return m === 'Citroen' ? 'Citroën' : m;
    }
  }
  return '';
}

export function getRelatedProducts(
  products: Product[],
  productId: string,
  limit: number = 4,
): Product[] {
  const product = products.find((p) => p.id === productId);
  if (!product) return products.slice(0, limit);
  const marque = extractMarque(product);
  return products
    .filter((p) => {
      if (p.id === productId) return false;
      if (marque && extractMarque(p) === marque) return true;
      return p.brand === product.brand || p.tags.some((t) => product.tags.includes(t));
    })
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
  const counts = new Map<string, number>();
  for (const p of products) {
    const marque = extractMarque(p);
    if (!marque) continue;
    counts.set(marque, (counts.get(marque) ?? 0) + 1);
  }

  const list = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name, count]) => ({
      name: name.toUpperCase(),
      descriptor: MARQUE_TAGLINES[name] ?? `${count} model${count === 1 ? '' : 's'}`,
      country: '',
    }));

  return list.length ? list : [{ name: 'COLLECTORS', descriptor: '1:18 diecast', country: 'NZ' }];
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
  const marque = extractMarque(product);
  return [marque || product.brand, product.year || scale].filter(Boolean).join(' · ');
}
