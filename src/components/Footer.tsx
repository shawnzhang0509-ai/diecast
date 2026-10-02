import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { Facebook } from 'lucide-react';
import Logo from './Logo';
import TikTokIcon from './TikTokIcon';
import {
  shopLinks,
  companyLinks,
  FACEBOOK_URL,
  TIKTOK_URL,
  CONTACT_EMAIL,
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
    TIKTOK_URL && { label: 'TikTok', href: TIKTOK_URL, Icon: TikTokIcon },
  ].filter(Boolean) as {
    label: string;
    href: string;
    Icon: typeof Facebook | typeof TikTokIcon;
  }[];

  return (
    <footer className="border-t border-driftae-gold/20 bg-driftae-black">
      <div className="mx-auto" style={{ maxWidth: 1400, padding: '80px 40px 40px' }}>
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
              {social.length > 0 ? (
                social.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-driftae-muted transition-colors duration-200 hover:text-driftae-gold"
                  >
                    {Icon === TikTokIcon ? (
                      <TikTokIcon size={20} />
                    ) : (
                      <Icon size={20} strokeWidth={1.5} />
                    )}
                  </a>
                ))
              ) : (
                <p className="text-[13px] text-driftae-muted">
                  Add{' '}
                  <code className="text-driftae-gold/80">VITE_FACEBOOK_URL</code> /{' '}
                  <code className="text-driftae-gold/80">VITE_TIKTOK_URL</code> in env.
                </p>
              )}
            </div>
            <p className="mb-4 text-[13px] text-driftae-muted">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="transition-colors hover:text-driftae-gold"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 rounded-md border border-driftae-border bg-transparent px-4 py-2.5 text-[13px] text-driftae-white placeholder:text-driftae-muted/50 focus:border-driftae-gold focus:outline-none"
              />
              <button type="button" className="btn-gold rounded-md px-4 py-2.5 text-[12px]">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-driftae-gold/20 pt-8 sm:flex-row">
          <p className="text-[12px] text-driftae-muted">© 2026 DRIFTAE. All rights reserved.</p>
          <div className="flex gap-6">
            <Link
              to="/about#contact"
              className="text-[12px] text-driftae-muted transition-colors duration-200 hover:text-driftae-gold"
            >
              Privacy Policy
            </Link>
            <Link
              to="/about#contact"
              className="text-[12px] text-driftae-muted transition-colors duration-200 hover:text-driftae-gold"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
