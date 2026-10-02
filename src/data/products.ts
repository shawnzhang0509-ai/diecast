export type { Product, ProductsCatalog } from '../types/product';
export {
  formatPrice,
  getRelatedProducts,
  deriveBrands,
  pickNewArrivals,
  pickMarqueeProducts,
  pickFeaturedProduct,
  productMetaLine,
  extractMarque,
  filterByMarque,
} from '../lib/product-utils';
