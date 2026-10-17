import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SHIPPING_ZONES, formatNzd } from '@/config/shipping';

const STORAGE_KEY = 'driftae-shipping-zone';

function savedZone(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

/** Customer picks their region; we show the courier cost and, when the model has a price, the total. */
export default function ShippingEstimate({ price }: { price?: number }) {
  const [zoneId, setZoneId] = useState(savedZone);
  const zone = SHIPPING_ZONES.find((z) => z.id === zoneId);

  const choose = (id: string) => {
    setZoneId(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* private mode: the choice just isn't remembered */
    }
  };

  return (
    <div className="mt-6 border border-driftae-border p-4">
      <label htmlFor="shipping-zone" className="font-body text-[12px] uppercase tracking-[0.1em] text-driftae-muted">
        Delivery to
      </label>
      <div className="relative mt-2">
      <select
        id="shipping-zone"
        value={zoneId}
        onChange={(e) => choose(e.target.value)}
        className="w-full appearance-none border border-driftae-border bg-[#0D0D0D] py-2.5 pl-3 pr-9 font-body text-[14px] text-driftae-white focus:border-driftae-gold focus:outline-none"
      >
        <option value="">Choose your area…</option>
        {SHIPPING_ZONES.map((z) => (
          <option key={z.id} value={z.id}>
            {z.label}
          </option>
        ))}
      </select>
      <ChevronDown size={16} strokeWidth={1.5} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-driftae-muted" />
      </div>
      {zone ? (
        <div className="mt-3 space-y-1 font-body text-[13px]">
          <p className="flex justify-between text-driftae-muted">
            <span>Tracked shipping ({zone.courier})</span>
            <span className="text-driftae-white">{formatNzd(zone.price)}</span>
          </p>
          {price && price > 0 ? (
            <p className="flex justify-between text-driftae-muted">
              <span>Total</span>
              <span className="text-driftae-gold">{formatNzd(price + zone.price)}</span>
            </p>
          ) : null}
        </div>
      ) : (
        <p className="mt-3 font-body text-[12px] text-driftae-muted">
          Tracked courier NZ-wide from {formatNzd(Math.min(...SHIPPING_ZONES.map((z) => z.price)))}. Rural addresses
          cost a little more. Not sure which you are? Message us.
        </p>
      )}
    </div>
  );
}
