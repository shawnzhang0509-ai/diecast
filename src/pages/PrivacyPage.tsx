import { usePageTitle } from '../hooks/use-page-title';
import { CONTACT_EMAIL } from '@/config/site-links';

// Privacy policy (owner 2026-11-17): needed for the YouTube API audit and Google Merchant Center.
export default function PrivacyPage() {
  usePageTitle('Privacy Policy');
  const link = 'text-driftae-gold hover:underline';
  const h2 = 'mb-2 text-[18px] text-driftae-white';
  return (
    <div className="mx-auto px-5 pb-24 pt-32 sm:px-10" style={{ maxWidth: 900 }}>
      <h1 className="font-display text-[36px] font-light text-driftae-white">Privacy Policy</h1>
      <p className="mt-2 font-body text-[13px] text-driftae-muted">Last updated 17 November 2026</p>
      <div className="mt-8 space-y-8 font-body text-[15px] leading-relaxed text-driftae-muted">
        <p>
          Driftae sells 1:18 diecast model cars in New Zealand. This page explains what we collect, why, and what you
          can ask us to do with it. We follow the New Zealand Privacy Act 2020.
        </p>
        <section>
          <h2 className={h2}>What we collect</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Your name, delivery address and order details when you buy from us (on Trade Me or directly), so we can send your model.</li>
            <li>Messages you send us on Messenger, Instagram or email, so we can answer you.</li>
            <li>Your email address if you ask to hear about new models. You can unsubscribe from any email.</li>
            <li>Anonymous visit statistics for this website (pages viewed, no personal profile), to see what people look at.</li>
          </ul>
        </section>
        <section>
          <h2 className={h2}>What we don't do</h2>
          <p>We don't sell or rent your information, and we only share it with the courier delivering your order.</p>
        </section>
        <section>
          <h2 className={h2}>YouTube</h2>
          <p>
            We use the YouTube API Services only to upload our own product videos to our own YouTube channel. We don't
            read, collect or store any data about YouTube viewers. YouTube is run by Google: see the{' '}
            <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" className={link}>YouTube Terms of Service</a>{' '}
            and the{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className={link}>Google Privacy Policy</a>.
          </p>
        </section>
        <section>
          <h2 className={h2}>Your rights</h2>
          <p>
            You can ask to see, correct or delete the information we hold about you: email{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className={link}>{CONTACT_EMAIL}</a>. We reply within 20 working days.
          </p>
        </section>
      </div>
    </div>
  );
}
