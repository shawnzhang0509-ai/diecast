import { GIVE_PHOTO, GIVE_SITE, useGive } from '../components/GivingLine';

// The rescue helicopter on the home page (owner 2026-11-22: 「也要上网站，一个宣传利器」): the Trust's own photo and
// logo (they agreed 2026-11-21), the same picture that closes every Trade Me listing, and the running count.
export default function Giving() {
  const give = useGive();
  return (
    <section className="bg-[#0D0D0D] px-5 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-14">
        <a href={GIVE_SITE} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-2xl border border-driftae-border">
          <img src={GIVE_PHOTO} alt="Westpac Rescue Helicopter: $1 from every DRIFTAE model sold" loading="lazy"
            width={1200} height={1200} className="h-auto w-full" />
        </a>
        <div className="text-center md:text-left">
          <p className="font-display text-[11px] tracking-[0.3em] text-driftae-gold">GIVING BACK</p>
          <h2 className="mt-3 font-display text-[30px] font-light leading-[1.2] text-driftae-white sm:text-[40px]">
            Every model helps keep a rescue helicopter flying
          </h2>
          <p className="mt-5 font-body text-[15px] leading-[1.6] text-driftae-muted">
            $1 from every model we sell goes to the Westpac Rescue Helicopter, the crews who fly to New Zealanders in trouble, day and night.
          </p>
          {give && give.sold > 0 && (
            <div className="mt-6 inline-flex gap-3">
              {[[String(give.sold), give.sold === 1 ? 'MODEL SOLD' : 'MODELS SOLD'], ...(give.given > 0 ? [[`$${give.given.toFixed(0)}`, 'GIVEN']] : [])].map(([v, k]) => (
                <div key={k} className="rounded-xl border border-driftae-border px-5 py-3 text-center">
                  <b className="block font-display text-[26px] font-semibold text-driftae-white">{v}</b>
                  <span className="font-display text-[10px] tracking-widest text-driftae-muted">{k}</span>
                </div>
              ))}
            </div>
          )}
          <p className="mt-6">
            <a href={GIVE_SITE} target="_blank" rel="noopener noreferrer" className="font-body text-[14px] text-driftae-gold hover:underline">
              About the rescue helicopter →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
