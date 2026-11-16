/**
 * Delivery time we promise (About page and product page: "usually 2–3 weeks after your order is confirmed").
 * Google wants a date on the page for made-to-order models (availability_date), so the product page shows the late
 * end as a date. driftae-ops tools/merchant/settings.json lead_days uses the same 21 days: change both together.
 */
export const DELIVERY_DAYS = { min: 14, max: 21 } as const;

/** "8 December", the latest a model ordered today should arrive. */
export function arrivesBy(from = new Date()): string {
  const d = new Date(from.getTime() + DELIVERY_DAYS.max * 86_400_000);
  return d.toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', timeZone: 'Pacific/Auckland' });
}
