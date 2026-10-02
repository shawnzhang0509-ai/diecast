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
} from '../lib/product-utils';
