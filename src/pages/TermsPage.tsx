import { Link } from 'react-router';
import { usePageTitle } from '../hooks/use-page-title';
import { CONTACT_EMAIL } from '@/config/site-links';

// Terms of service (owner 2026-11-17): needed for the YouTube API audit.
export default function TermsPage() {
  usePageTitle('Terms of Service');
  const link = 'text-driftae-gold hover:underline';
  const h2 = 'mb-2 text-[18px] text-driftae-white';
  return (
    <div className="mx-auto px-5 pb-24 pt-32 sm:px-10" style={{ maxWidth: 900 }}>
      <h1 className="font-display text-[36px] font-light text-driftae-white">Terms of Service</h1>
      <p className="mt-2 font-body text-[13px] text-driftae-muted">Last updated 17 November 2026</p>
      <div className="mt-8 space-y-8 font-body text-[15px] leading-relaxed text-driftae-muted">
        <section>
          <h2 className={h2}>Who we are</h2>
          <p>Driftae sells new 1:18 diecast model cars to customers in New Zealand, through this website, Trade Me and our social media pages.</p>
        </section>
        <section>
          <h2 className={h2}>Orders and prices</h2>
          <p>
            Prices are in New Zealand dollars. Each model is ordered in from overseas for you; delivery is usually 2–3
            weeks after your order is confirmed, by tracked courier. Shipping costs are shown on the{' '}
            <Link to="/about#shipping" className={link}>Shipping &amp; Delivery</Link> page.
          </p>
        </section>
        <section>
          <h2 className={h2}>Returns</h2>
          <p>See our <Link to="/returns" className={link}>Returns &amp; Refunds</Link> policy. Nothing here limits your rights under the Consumer Guarantees Act.</p>
        </section>
        <section>
          <h2 className={h2}>Our videos and photos</h2>
          <p>
            Our product videos are published on our own channels, including YouTube, and are subject to the{' '}
            <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" className={link}>YouTube Terms of Service</a>.
            Please don't reuse our photos or videos without asking.
          </p>
        </section>
        <section>
          <h2 className={h2}>Privacy</h2>
          <p>How we handle your information is in our <Link to="/privacy" className={link}>Privacy Policy</Link>.</p>
        </section>
        <section>
          <h2 className={h2}>Contact</h2>
          <p>Email <a href={`mailto:${CONTACT_EMAIL}`} className={link}>{CONTACT_EMAIL}</a>.</p>
        </section>
      </div>
    </div>
  );
}
