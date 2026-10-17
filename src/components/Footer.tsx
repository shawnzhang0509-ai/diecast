import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { Facebook, MessageCircle } from 'lucide-react';
import Logo from './Logo';
import TikTokIcon from './TikTokIcon';
import {
  shopLinks,
  companyLinks,
  FACEBOOK_URL,
  TIKTOK_URL,
  CONTACT_EMAIL,
  MESSENGER_URL,
} from '@/config/site-links';

function FooterLink({
  to,
  href,
  external,
  children,
}: {
  to?: string;
  href?: string;
  external?: boolean;
  children: ReactNode;
}) {
  const className =
    'text-[14px] font-normal leading-relaxed text-driftae-muted transition-colors duration-200 hover:text-driftae-white';

  if (href) {
    return (
      <a
        href={href}
        className={className}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link to={to ?? '/'} className={className}>
      {children}
    </Link>
  );
}

export default function Footer() {
  const social = [
    FACEBOOK_URL && { label: 'Facebook', href: FACEBOOK_URL, Icon: Facebook },
    { label: 'Messenger', href: MESSENGER_URL, Icon: MessageCircle },
    TIKTOK_URL && { label: 'TikTok', href: TIKTOK_URL, Icon: TikTokIcon },
  ].filter(Boolean) as {
    label: string;
    href: string;
    Icon: typeof Facebook | typeof MessageCircle | typeof TikTokIcon;
  }[];

  return (
    <footer className="border-t border-driftae-gold/20 bg-driftae-black">
      <div className="mx-auto px-5 sm:px-10" style={{ maxWidth: 1400, paddingTop: 80, paddingBottom: 40 }}>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="inline-block transition-opacity hover:opacity-80">
              <Logo variant="full" showTagline />
            </Link>
          </div>

          <div>
            <h4 className="mb-5 font-display text-[13px] font-medium uppercase tracking-[0.1em] text-driftae-gold">
              Shop
            </h4>
            <ul className="space-y-3">
              {shopLinks.map((item) => (
                <li key={item.label}>
                  {'href' in item ? (
                    <FooterLink href={item.href} external={item.external}>
                      {item.label}
                    </FooterLink>
                  ) : (
                    <FooterLink to={item.to}>{item.label}</FooterLink>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 font-display text-[13px] font-medium uppercase tracking-[0.1em] text-driftae-gold">
              Company
            </h4>
            <ul className="space-y-3">
              {companyLinks.map((item) => (
                <li key={item.label}>
                  <FooterLink to={item.to}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 font-display text-[13px] font-medium uppercase tracking-[0.1em] text-driftae-gold">
              Connect
            </h4>
            <div className="mb-6 flex gap-4">
              {social.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-driftae-muted transition-colors duration-200 hover:text-driftae-gold"
                >
                  {Icon === TikTokIcon ? <TikTokIcon size={20} /> : <Icon size={20} strokeWidth={1.5} />}
                </a>
              ))}
            </div>
            <p className="mb-2 text-[13px] text-driftae-muted">
              <a href={`mailto:${CONTACT_EMAIL}`} className="transition-colors hover:text-driftae-gold">
                {CONTACT_EMAIL}
              </a>
            </p>
            <p className="text-[13px] text-driftae-muted">In stock in Auckland · Ships NZ-wide</p>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-driftae-gold/20 pt-8 sm:flex-row">
          <p className="text-[12px] text-driftae-muted">© 2026 DRIFTAE. All rights reserved.</p>
          <div className="flex gap-6">
            <a
              href="/privacy.html"
              className="text-[12px] text-driftae-muted transition-colors duration-200 hover:text-driftae-gold"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
