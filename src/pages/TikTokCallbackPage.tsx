import { useState } from 'react';
import { usePageTitle } from '../hooks/use-page-title';

// TikTok Login Kit lands here after @driftaenz allows our app (owner 2026-11-18). Staff copy this address to the server
// (`dt tiktok oauth-save`), which swaps the code for a token; the page itself keeps and sends nothing.
export default function TikTokCallbackPage() {
  usePageTitle('TikTok connected');
  const q = new URLSearchParams(window.location.search);
  const ok = !!q.get('code') && !q.get('error');
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      /* the address bar still has it */
    }
  };
  return (
    <div className="mx-auto px-5 pb-24 pt-32 text-center sm:px-10" style={{ maxWidth: 640 }}>
      <h1 className="font-display text-[32px] font-light text-driftae-white">
        {ok ? 'TikTok connected' : 'TikTok not connected'}
      </h1>
      <p className="mt-4 font-body text-[15px] leading-relaxed text-driftae-muted">
        {ok
          ? 'Driftae can now send our product videos to our TikTok inbox as drafts. Nothing is posted until we post it in the TikTok app.'
          : q.get('error_description') || q.get('error') || 'No authorization code in this link.'}
      </p>
      {ok && (
        <button
          onClick={copy}
          className="mt-8 rounded-full bg-driftae-gold px-6 py-3 font-body text-[14px] font-medium text-black"
        >
          {copied ? 'Copied ✓' : 'Copy this link for the Driftae server'}
        </button>
      )}
    </div>
  );
}
