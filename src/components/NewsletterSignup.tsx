import { useState, type FormEvent } from 'react';

// Email list sign-up → ledger /api/subscribe. The tick box is the consent (NZ Unsolicited Electronic Messages Act);
// its wording is stored with the address on the ledger side, so keep the two in step.
const SUBSCRIBE_URL =
  import.meta.env.VITE_SUBSCRIBE_URL?.trim() || 'https://ledger-nu-ruddy.vercel.app/api/subscribe';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(''); // honeypot, hidden from people
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!consent) {
      setState('error');
      setError('Tick the box so we know you want our emails.');
      return;
    }
    setState('sending');
    try {
      const res = await fetch(SUBSCRIBE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent, website }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Please try again later.');
      }
      setState('done');
    } catch (err) {
      setState('error');
      setError(err instanceof Error ? err.message : 'Please try again later.');
    }
  }

  if (state === 'done') {
    return (
      <p className="text-[13px] leading-relaxed text-driftae-muted">
        You&apos;re on the list. We&apos;ll email you when new models land.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3" noValidate>
      <p className="text-[13px] leading-relaxed text-driftae-muted">New arrivals and members-only deals, by email.</p>
      <div className="flex gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Email
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="min-w-0 flex-1 border border-driftae-border bg-transparent px-3 py-2 text-[14px] text-driftae-white placeholder:text-driftae-muted/60 focus:border-driftae-gold focus:outline-none"
        />
        <button
          type="submit"
          disabled={state === 'sending'}
          className="border border-driftae-gold px-4 py-2 text-[13px] uppercase tracking-[0.1em] text-driftae-gold transition-colors hover:bg-driftae-gold hover:text-driftae-black disabled:opacity-50"
        >
          {state === 'sending' ? '…' : 'Join'}
        </button>
      </div>
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="hidden"
        name="website"
      />
      <label className="flex items-start gap-2 text-[12px] leading-snug text-driftae-muted">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 accent-[#c9a961]"
        />
        <span>
          Email me new arrivals and members-only deals from DRIFTAE. Unsubscribe anytime.{' '}
          <a href="/privacy.html#email-list" className="underline hover:text-driftae-gold">
            Privacy
          </a>
        </span>
      </label>
      {state === 'error' && <p className="text-[12px] text-red-400">{error}</p>}
    </form>
  );
}
