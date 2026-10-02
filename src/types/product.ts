export interface Product {
  id: string;
  name: string;
  brand: string;
  brandShort: string;
  year: string;
  mileage: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  edition?: string;
  status: 'new' | 'preorder' | 'instock' | 'sale';
  description: string;
  specs: Record<string, string>;
  tags: string[];
  /** Resolved at runtime from trademe-links.json (changes when you relist). */
  trademeUrl?: string;
  trademeListingId?: string;
}

export interface ProductsCatalog {
  generatedAt?: string;
  products: Product[];
}
