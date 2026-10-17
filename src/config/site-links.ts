/** Public URLs — set in .env (VITE_*) or edit defaults below. */

export const SITE_URL = 'https://www.driftae.com';

export const TRADEME_SHOP_URL =
  import.meta.env.VITE_TRADEME_SHOP_URL?.trim() ||
  'https://www.trademe.co.nz/a/search?member_listing=5600782';

/** Facebook Page "Driftaenz" (page id 1421932517666374). */
export const FACEBOOK_URL =
  import.meta.env.VITE_FACEBOOK_URL?.trim() || 'https://www.facebook.com/61594900396673';

/** Opens a Messenger chat with the Page; replies go through the team's approval flow. */
export const MESSENGER_URL =
  import.meta.env.VITE_MESSENGER_URL?.trim() || 'https://m.me/1421932517666374';

export const TIKTOK_URL = import.meta.env.VITE_TIKTOK_URL?.trim() || '';

export const CONTACT_EMAIL =
  import.meta.env.VITE_CONTACT_EMAIL?.trim() || 'driftaenz@gmail.com';

/** Messenger link that tells us which model the customer was looking at. */
export function messengerUrlFor(productId?: string): string {
  return productId ? `${MESSENGER_URL}?ref=${encodeURIComponent(productId)}` : MESSENGER_URL;
}

export function mailtoFor(subject: string): string {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

export const shopLinks = [
  { label: 'All Models', to: '/collection' },
  { label: 'New Arrivals', to: '/#new-arrivals' },
  { label: 'Trade Me Shop', href: TRADEME_SHOP_URL, external: true },
  { label: 'Consignment', to: '/about#faq' },
] as const;

export const companyLinks = [
  { label: 'About Us', to: '/about' },
  { label: 'Our Brands', to: '/#brands' },
  { label: 'Shipping & Delivery', to: '/about#shipping' },
  { label: 'FAQ', to: '/about#faq' },
  { label: 'Contact', to: '/about#contact' },
] as const;
