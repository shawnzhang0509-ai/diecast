/** Public URLs — set in .env (VITE_*) or edit defaults below. */

export const TRADEME_SHOP_URL =
  import.meta.env.VITE_TRADEME_SHOP_URL?.trim() ||
  'https://www.trademe.co.nz/a/search?member_listing=5600782';

export const FACEBOOK_URL = import.meta.env.VITE_FACEBOOK_URL?.trim() || '';

export const TIKTOK_URL = import.meta.env.VITE_TIKTOK_URL?.trim() || '';

export const CONTACT_EMAIL =
  import.meta.env.VITE_CONTACT_EMAIL?.trim() || 'hello@driftae.co.nz';

export const shopLinks = [
  { label: 'All Models', to: '/#in-stock' },
  { label: 'New Arrivals', to: '/#new-arrivals' },
  { label: 'Pre-Orders', to: '/#new-arrivals' },
  { label: 'Trade Me Shop', href: TRADEME_SHOP_URL, external: true },
  { label: 'Consignment', to: '/about#contact' },
] as const;

export const companyLinks = [
  { label: 'About Us', to: '/about' },
  { label: 'Our Brands', to: '/#brands' },
  { label: 'Shipping & Delivery', to: '/about#shipping' },
  { label: 'FAQ', to: '/about#faq' },
  { label: 'Contact', to: '/about#contact' },
] as const;
