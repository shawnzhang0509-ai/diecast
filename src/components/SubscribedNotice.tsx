import { useState } from 'react';

// Where the email sign-up confirmation link lands (ledger /api/subscribe/confirm → /?subscribed=1|bad|error).
const TEXT: Record<string, string> = {
  '1': "You're on the list. We'll email you when new models land.",
  bad: 'That link has already been used or has expired. Sign up again at the bottom of the page.',
  error: 'Something went wrong. Please tap the link in your email again.',
};

export default function SubscribedNotice() {
  const [state] = useState(() => new URLSearchParams(window.location.search).get('subscribed'));
  const [open, setOpen] = useState(true);
  if (!state || !TEXT[state] || !open) return null;
  return (
    <div className="fixed inset-x-4 top-20 z-50 mx-auto flex max-w-md items-start gap-3 rounded-[14px] border border-driftae-gold bg-driftae-black/95 px-4 py-3 text-[14px] text-driftae-white shadow-lg">
      <span className="flex-1">{TEXT[state]}</span>
      <button onClick={() => setOpen(false)} aria-label="Close" className="text-driftae-gold">
        ✕
      </button>
    </div>
  );
}
