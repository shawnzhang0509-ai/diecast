/**
 * Courier rates, the same as on our Trade Me listings (driftae-ops trademe/listing-defaults.json).
 * Change both together. No pick-up.
 */
export const SHIPPING_ZONES = [
  { id: 'akl-urban', label: 'Auckland — urban', courier: 'Aramex', price: 6.84 },
  { id: 'akl-rural', label: 'Auckland — rural', courier: 'NZ Post', price: 12.73 },
  { id: 'ni-urban', label: 'North Island — urban', courier: 'NZ Post', price: 8.79 },
  { id: 'ni-rural', label: 'North Island — rural', courier: 'NZ Post', price: 14.68 },
  { id: 'si-urban', label: 'South Island — urban', courier: 'Aramex', price: 12.54 },
  { id: 'si-rural', label: 'South Island — rural', courier: 'NZ Post', price: 18.43 },
] as const;

export type ShippingZoneId = (typeof SHIPPING_ZONES)[number]['id'];

export const formatNzd = (n: number) => `NZ$${n.toFixed(2)}`;
