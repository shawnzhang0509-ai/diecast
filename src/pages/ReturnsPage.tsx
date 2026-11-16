import { usePageTitle } from '../hooks/use-page-title';
import { CONTACT_EMAIL, MESSENGER_URL } from '@/config/site-links';

// Returns & refunds (owner 2026-11-17): faulty, damaged or wrong models are replaced or refunded; no change-of-mind
// returns. Matches what Google Merchant Center was told (defective only, no exchanges, 30 days).
export default function ReturnsPage() {
  usePageTitle('Returns & Refunds');
  const link = 'text-driftae-gold hover:underline';
  return (
    <div className="mx-auto px-5 pb-24 pt-32 sm:px-10" style={{ maxWidth: 900 }}>
      <h1 className="font-display text-[36px] font-light text-driftae-white">Returns &amp; Refunds</h1>
      <div className="mt-8 space-y-8 font-body text-[15px] leading-relaxed text-driftae-muted">
        <section>
          <h2 className="mb-2 text-[18px] text-driftae-white">Faulty, damaged or wrong model</h2>
          <p>
            If your model arrives damaged, faulty, with parts missing, or is not the model you ordered, tell us within
            30 days of delivery. We will replace it or give you a full refund, your choice. We pay the return postage.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-[18px] text-driftae-white">Change of mind</h2>
          <p>
            Each model is ordered in from overseas for you, so we do not accept returns or exchanges for a change of
            mind. Not sure about a model? Message us before ordering and we will send more photos.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-[18px] text-driftae-white">How to return</h2>
          <ol className="list-decimal space-y-1 pl-5">
            <li>
              Message us on{' '}
              <a href={MESSENGER_URL} target="_blank" rel="noopener noreferrer" className={link}>Messenger</a> or email{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className={link}>{CONTACT_EMAIL}</a> with your order and a photo of the problem.
            </li>
            <li>We reply with a prepaid courier label (New Zealand addresses).</li>
            <li>Send the model back in its original box. We refund within 5 working days of receiving it, or send the replacement.</li>
          </ol>
        </section>
        <section>
          <h2 className="mb-2 text-[18px] text-driftae-white">Your rights</h2>
          <p>
            This policy does not limit your rights under the New Zealand Consumer Guarantees Act. Models bought on
            Trade Me are also covered by Trade Me&apos;s buyer protection.
          </p>
        </section>
      </div>
    </div>
  );
}
