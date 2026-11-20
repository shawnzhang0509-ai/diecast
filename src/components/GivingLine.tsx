import { useEffect, useState } from 'react';

// $1 from every model sold to the Westpac Rescue Helicopter (owner 2026-11-21). Totals come from the ledger's
// /api/give: pledged from the books, given = donations the team recorded with a receipt.
const giveUrl = import.meta.env.VITE_GIVE_URL?.trim() || 'https://ledger-nu-ruddy.vercel.app/api/give';

type Give = { given: number; sold: number; url: string };

export default function GivingLine() {
  const [give, setGive] = useState<Give | null>(null);
  useEffect(() => {
    fetch(giveUrl, { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : null))
      .then(setGive)
      .catch(() => setGive(null));
  }, []);
  return (
    <div className="mt-8 text-center">
      <p className="text-[12px] leading-relaxed text-driftae-white sm:text-[14px]">
        $1 from every model we sell goes to the{' '}
        <a href="https://www.rescuehelicopter.org.nz" target="_blank" rel="noopener noreferrer" className="text-driftae-gold hover:underline">
          Westpac Rescue Helicopter
        </a>
      </p>
      {give && give.sold > 0 && (
        <p className="mt-1 text-[11px] text-driftae-muted sm:text-[12px]">
          {give.sold} {give.sold === 1 ? 'model' : 'models'} sold so far{give.given > 0 ? ` · $${give.given.toFixed(0)} given` : ''}
        </p>
      )}
    </div>
  );
}
