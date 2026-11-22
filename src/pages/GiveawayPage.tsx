import { useEffect, useRef, useState, type FormEvent } from 'react';
import { usePageTitle } from '../hooks/use-page-title';
import { CONTACT_EMAIL, INSTAGRAM_URL } from '@/config/site-links';

// The monthly draw (owner 2026-11-19). Everything comes from the ledger's /api/giveaway: prize, end time, masked
// entries and, once drawn, the winner's position. The winner is drawn there (once, at random); this page only replays it.
// Entering = an Instagram post tagging us + name + email + its link + one consent box; it counts once the email is
// confirmed (owner 2026-11-21/22: the draw grows the email list, and every entrant posts about us).
const feedUrl =
  import.meta.env.VITE_GIVEAWAY_URL?.trim() || 'https://ledger-nu-ruddy.vercel.app/api/giveaway';

type Entry = { display: string; via: string };
type Feed = {
  draw: { month: string; prize: string; prize_value: number | null; image: string | null; ends_at: string; drawn_at: string | null; product_id: string | null } | null;
  entries?: Entry[];
  winner?: { index: number; display: string; via: string } | null;
};

const ROW = 60;
const pad = (n: number) => String(Math.max(0, Math.floor(n))).padStart(2, '0');
const pick = (n: number) => crypto.getRandomValues(new Uint32Array(1))[0] % n;
const monthName = (m: string) => new Date(`${m}-01T12:00:00`).toLocaleString('en-NZ', { month: 'long' });

function useCountdown(end: string | undefined) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const s = end ? Math.max(0, (Date.parse(end) - now) / 1000) : 0;
  return { done: s === 0, d: pad(s / 86400), h: pad((s % 86400) / 3600), m: pad((s % 3600) / 60), sec: pad(s % 60) };
}

function confetti(canvas: HTMLCanvasElement) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cx = canvas.getContext('2d');
  if (!cx) return;
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  const cols = ['#C7A96B', '#E9D3A0', '#F7F7F7', '#A89258'];
  let bits = Array.from({ length: 220 }, (_, i) => ({
    x: innerWidth / 2, y: innerHeight * 0.55, vx: (Math.random() - 0.5) * 16, vy: -Math.random() * 18 - 4,
    r: Math.random() * 6 + 3, a: Math.random() * 6, va: (Math.random() - 0.5) * 0.4, c: cols[i % 4], life: 160,
  }));
  const draw = () => {
    cx.clearRect(0, 0, canvas.width, canvas.height);
    bits = bits.filter((b) => b.life-- > 0);
    for (const b of bits) {
      b.vy += 0.35; b.vx *= 0.99; b.x += b.vx; b.y += b.vy; b.a += b.va;
      cx.save(); cx.translate(b.x, b.y); cx.rotate(b.a); cx.globalAlpha = Math.min(1, b.life / 40);
      cx.fillStyle = b.c; cx.fillRect(-b.r / 2, -b.r / 4, b.r, b.r / 2); cx.restore();
    }
    if (bits.length) requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
}

export default function GiveawayPage() {
  usePageTitle('Monthly Giveaway');
  const [feed, setFeed] = useState<Feed | null>(null);
  const [failed, setFailed] = useState(false);
  const [reel, setReel] = useState<Entry[]>([]);
  const [offset, setOffset] = useState(ROW);
  const [spinning, setSpinning] = useState(false);
  const [shown, setShown] = useState(false);
  const fx = useRef<HTMLCanvasElement>(null);
  const draw = feed?.draw ?? null;
  const entries = feed?.entries ?? [];
  const winner = feed?.winner ?? null;
  const clock = useCountdown(draw?.ends_at);
  const [form, setForm] = useState({ name: '', email: '', post: '', consent: false, website: '' });
  const [sending, setSending] = useState(false);
  const [entered, setEntered] = useState<{ code: string | null; invited: number; chances: number } | null>(null);
  const [pending, setPending] = useState(false);
  const back = new URLSearchParams(window.location.search).get('entered');
  const [copied, setCopied] = useState(false);
  const ref = new URLSearchParams(window.location.search).get('r');
  const invite = entered?.code ? `${window.location.origin}/giveaway?r=${entered.code}` : '';
  const [error, setError] = useState('');

  const load = () =>
    fetch(feedUrl, { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((f: Feed) => { setFeed(f); setReel((f.entries ?? []).slice(0, 6)); })
      .catch(() => setFailed(true));
  useEffect(() => { load(); }, []);
  useEffect(() => {                       // back from the confirmation mail: ?entered=<invite code>
    if (!back || !/^[A-Za-z0-9]{4,12}$/.test(back)) return;
    fetch(`${feedUrl}?code=${back}`, { cache: 'no-cache' })
      .then((r) => r.json())
      .then((j) => j.code && setEntered({ code: j.code, invited: j.invited ?? 0, chances: j.chances ?? 1 }))
      .catch(() => {});
  }, [back]);

  const enter = async (ev: FormEvent) => {
    ev.preventDefault();
    setError('');
    if (!form.consent) return setError('Tick the box to enter.');
    setSending(true);
    try {
      const r = await fetch(feedUrl, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'join', ref, ...form }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || 'Please try again in a minute.');
      if (j.confirmed) setEntered({ code: j.code ?? null, invited: j.invited ?? 0, chances: j.chances ?? 1 });
      else setPending(true);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Please try again in a minute.');
    } finally {
      setSending(false);
    }
  };

  const replay = () => {
    if (!winner || spinning || !entries.length) return;
    const spin = Array.from({ length: 60 }, () => entries[pick(entries.length)]);
    spin.push(entries[winner.index], entries[pick(entries.length)]);
    setShown(false);
    setSpinning(true);
    setReel(spin);
    setOffset(ROW);
    requestAnimationFrame(() => requestAnimationFrame(() => setOffset(ROW - (spin.length - 2) * ROW)));
    setTimeout(() => {
      setSpinning(false);
      setShown(true);
      if (fx.current) confetti(fx.current);
    }, 6100);
  };

  const share = async () => {
    if (!invite) return;
    const text = `I just entered a free diecast model draw. Enter here (free): ${invite}`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Driftae Monthly Draw', text, url: invite }); return; } catch { /* closed: fall back to copy */ }
    }
    try { await navigator.clipboard.writeText(invite); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* shown in the box */ }
  };

  const link = 'text-driftae-gold hover:underline';
  const field = 'w-full rounded-xl border border-driftae-border bg-black/40 px-4 py-3 text-driftae-white placeholder:text-driftae-muted focus:border-driftae-gold focus:outline-none';
  return (
    <div className="relative mx-auto px-4 pb-24 pt-28 sm:px-6" style={{ maxWidth: 560 }}>
      <canvas ref={fx} className="pointer-events-none fixed inset-0 z-50" aria-hidden="true" />
      <p className="text-center font-display text-[12px] font-semibold tracking-[0.5em] text-driftae-gold">DRIFTAE</p>
      <h1 className="mt-2 text-center font-serif text-[34px] text-driftae-white">
        The <em className="text-driftae-gold">Monthly</em> Draw
      </h1>
      <p className="mt-1 text-center font-body text-[13px] text-driftae-muted">
        One diecast model, free to one collector each month.
      </p>

      {!draw && (
        <p className="mt-12 text-center font-body text-[15px] text-driftae-muted">
          {failed ? 'The draw could not load. Please try again in a minute.' : feed ? 'The first draw opens soon. Follow us to hear when it starts.' : 'Loading…'}
        </p>
      )}

      {draw && (
        <>
          <div className="relative mt-6 overflow-hidden rounded-[18px] border border-driftae-border bg-driftae-surface">
            {draw.image && <img src={draw.image} alt={draw.prize} className="aspect-[2/1] w-full object-cover" />}
            <span className="absolute left-3 top-3 rounded-full bg-driftae-gold px-3 py-1 font-display text-[11px] font-bold tracking-wider text-black">
              {monthName(draw.month).toUpperCase()} PRIZE
            </span>
            <div className="flex items-end justify-between gap-3 px-4 pb-4 pt-3">
              <div className="min-w-0">
                <p className="font-display text-[16px] font-semibold text-driftae-white">{draw.prize}</p>
                <p className="mt-1 font-body text-[12px] text-driftae-muted">Diecast model, delivered free in NZ</p>
              </div>
              {draw.prize_value && <p className="whitespace-nowrap font-display text-[18px] font-bold text-driftae-gold">NZ${draw.prize_value}</p>}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
            {(winner || clock.done
              ? [['—', 'DAYS'], ['—', 'HRS'], ['—', 'MIN'], [String(entries.length), 'ENTRIES']]
              : [[clock.d, 'DAYS'], [clock.h, 'HRS'], [clock.m, 'MIN'], [String(entries.length), 'ENTRIES']]
            ).map(([v, k]) => (
              <div key={k} className="rounded-xl border border-driftae-border bg-driftae-surface py-2.5 text-center">
                <b className="block font-display text-[22px] font-semibold tabular-nums text-driftae-white">{v}</b>
                <span className="font-display text-[10px] tracking-widest text-driftae-muted">{k}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[20px] bg-gradient-to-br from-[#E9D3A0] via-driftae-gold to-[#6b5631] p-[3px]">
            <div className="relative h-[180px] overflow-hidden rounded-[17px] bg-[#070707]">
              <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[62px] bg-gradient-to-b from-[#070707] to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[62px] bg-gradient-to-t from-[#070707] to-transparent" />
              <div className="absolute inset-x-3.5 top-[60px] z-10 h-[60px] border-y border-driftae-gold/50" />
              <div
                className="absolute inset-x-0 top-0"
                style={{ transform: `translateY(${offset}px)`, transition: spinning ? 'transform 6s cubic-bezier(.12,.75,.12,1)' : 'none' }}
              >
                {(reel.length ? reel : [{ display: 'Be the first entry', via: '' }]).map((e, i) => (
                  <div key={i} className="flex h-[60px] items-center justify-center gap-2.5 font-display text-[22px] font-medium text-[#cfc6b4]">
                    {e.display}
                    {e.via && <small className="rounded-full border border-driftae-border px-2 py-0.5 text-[11px] text-driftae-muted">{e.via}</small>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {winner ? (
            <button
              onClick={replay}
              disabled={spinning}
              className="mt-4 w-full rounded-[14px] bg-gradient-to-r from-driftae-gold via-[#E9D3A0] to-driftae-gold py-4 font-display text-[15px] font-bold tracking-[0.15em] text-black disabled:opacity-50"
            >
              {spinning ? 'DRAWING…' : shown ? 'WATCH IT AGAIN' : 'WATCH THE DRAW'}
            </button>
          ) : (
            <p className="mt-4 text-center font-body text-[13px] text-driftae-muted">
              {clock.done ? 'Entries are closed. The winner is drawn shortly.' : `Drawn at random after entries close on ${new Date(draw.ends_at).toLocaleString('en-NZ', { day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit' })}.`}
            </p>
          )}

          {winner && shown && (
            <div className="mt-4 rounded-[18px] border border-driftae-gold bg-driftae-gold/5 px-4 py-5 text-center">
              <p className="font-display text-[11px] tracking-[0.4em] text-driftae-gold">WINNER</p>
              <p className="my-2 font-serif text-[40px] text-driftae-white">{winner.display}</p>
              <p className="font-body text-[12px] leading-relaxed text-driftae-muted">
                entered via {winner.via} · 1 of {entries.length} entries<br />We'll email the winner to send their model.
              </p>
            </div>
          )}
        </>
      )}

      {draw && !winner && !clock.done && (
        <section id="enter" className="mt-8 rounded-[18px] border border-driftae-gold/60 bg-driftae-surface px-4 py-5">
          <h2 className="text-center font-display text-[18px] font-semibold text-driftae-white">Enter free</h2>
          {back && ['bad', 'closed', 'error'].includes(back) && !entered && (
            <p className="mt-3 text-center font-body text-[13px] text-red-400">
              {back === 'closed' ? 'Entries for this draw are closed.' : back === 'bad' ? 'That confirmation link is not valid. Enter again below.' : 'Something went wrong. Please tap the link in your email again.'}
            </p>
          )}
          {pending && !entered ? (
            <div className="mt-3 text-center font-body">
              <p className="text-[18px] text-driftae-white">📧 Check your email</p>
              <p className="mt-2 text-[14px] leading-relaxed text-driftae-muted">
                We sent a link to <b className="text-driftae-white">{form.email}</b>. Tap it to confirm your entry.<br />
                It arrives within a few minutes. Not there? Check spam.
              </p>
            </div>
          ) : entered ? (
            <div className="mt-3 text-center font-body">
              <p className="text-[16px] text-driftae-white">You're in! Email confirmed. Good luck. 🍀</p>
              {invite && (
                <>
                  <p className="mt-4 text-[13px] text-driftae-muted">Your invite link: +1 chance for every friend who enters with it (up to 5).</p>
                  <p className="mt-2 break-all rounded-xl border border-driftae-gold/60 bg-black/40 px-3 py-3 text-[14px] text-driftae-white select-all">{invite}</p>
                  <button onClick={share}
                    className="mt-3 w-full rounded-[14px] bg-gradient-to-r from-driftae-gold via-[#E9D3A0] to-driftae-gold py-3.5 font-display text-[14px] font-bold tracking-[0.15em] text-black">
                    {copied ? 'COPIED ✓' : 'SHARE MY LINK'}
                  </button>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {[[String(entered?.invited ?? 0), 'FRIENDS JOINED'], [String(entered?.chances ?? 1), 'YOUR CHANCES']].map(([v, k]) => (
                      <div key={k} className="rounded-xl border border-driftae-border py-2.5">
                        <b className="block font-display text-[22px] font-semibold text-driftae-white">{v}</b>
                        <span className="font-display text-[10px] tracking-widest text-driftae-muted">{k}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-[12px] text-driftae-muted">Enter again with the same email any time to see your count.</p>
                </>
              )}
            </div>
          ) : (
            <form onSubmit={enter} className="mt-4 space-y-3 font-body text-[14px]">
              {ref && <p className="text-center text-[13px] text-driftae-gold">A friend invited you 🎁</p>}
              <ol className="list-decimal space-y-1 rounded-xl bg-black/30 py-3 pl-8 pr-3 text-[13px] leading-snug text-driftae-muted">
                <li>Post on Instagram (a photo of a car you love works) and tag <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={link}>@driftaenz</a> with <b className="text-driftae-white">#driftaegiveaway</b>.</li>
                <li>Copy the post's link (⋯ → Copy link) and paste it below.</li>
                <li>Confirm your email with the link we send.</li>
              </ol>
              <input required maxLength={60} autoComplete="name" placeholder="Your name" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} />
              <input required type="email" maxLength={254} autoComplete="email" placeholder="Your email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} className={field} />
              <input required type="url" inputMode="url" autoCapitalize="none" maxLength={300} placeholder="Your Instagram post link (instagram.com/p/…)"
                value={form.post} onChange={(e) => setForm({ ...form, post: e.target.value })} className={field} />
              <input tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })} className="hidden" />
              <label className="flex items-start gap-3 text-[13px] leading-snug text-driftae-muted">
                <input type="checkbox" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                  className="mt-0.5 h-5 w-5 shrink-0 accent-[#C7A96B]" />
                <span>Enter me in the draw and email me new arrivals and deals from DRIFTAE. Unsubscribe anytime.</span>
              </label>
              {error && <p className="text-[13px] text-red-400">{error}</p>}
              <button disabled={sending}
                className="w-full rounded-[14px] bg-gradient-to-r from-driftae-gold via-[#E9D3A0] to-driftae-gold py-4 font-display text-[15px] font-bold tracking-[0.15em] text-black disabled:opacity-50">
                {sending ? 'ENTERING…' : 'ENTER THE DRAW'}
              </button>
            </form>
          )}
        </section>
      )}

      <section id="rules" className="mt-8 font-body text-[13px] leading-relaxed text-driftae-muted">
        <h2 className="mb-2 font-display text-[16px] font-semibold text-driftae-white">Rules</h2>
        <ol className="list-decimal space-y-1.5 pl-5">
          <li>The promoter is Driftae, a New Zealand diecast model shop. Open to New Zealand residents.</li>
          <li>Entry is free and no purchase is needed. To enter: (1) publish a post on Instagram that tags @driftaenz and uses #driftaegiveaway, (2) fill in the form on this page with your name, your email and that post's link, box ticked, and (3) confirm your email with the link we send. An entry counts once the email is confirmed.</li>
          <li>One entry per person (one email address) each month, plus one extra entry for each friend who enters through your invite link for the first time (up to 5). Entries close at the time shown above.</li>
          <li>One winner each month, drawn at random from all valid entries after entries close. The draw is shown on this page. We check the winner's post: if it doesn't exist, doesn't tag us, or was deleted before the draw, or the details are fake, we draw again.</li>
          <li>We email the winner within 3 days. If there is no reply within 14 days, we draw again.</li>
          <li>The prize is the model shown, delivered free within New Zealand. It can't be exchanged for cash. If that model is unavailable we send one of equal or higher value.</li>
          <li>Only a shortened name (like "J*** S.") is shown publicly. Entering adds your email to our mailing list (new arrivals and deals); every email has an unsubscribe link. We never sell or share it. See our <a href="/privacy" className={link}>Privacy Policy</a>.</li>
          <li>These rules do not change once a month's draw has started.</li>
          <li>This promotion is not sponsored, endorsed or administered by, or associated with, Meta, Facebook, Instagram or Trade Me. Entrants release Meta and Instagram from any liability for it.</li>
          <li>Questions: <a href={`mailto:${CONTACT_EMAIL}`} className={link}>{CONTACT_EMAIL}</a>.</li>
        </ol>
      </section>
    </div>
  );
}
