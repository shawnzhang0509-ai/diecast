import { Link } from 'react-router';
import { usePageTitle } from '../hooks/use-page-title';

export default function NotFound() {
  usePageTitle('Page not found');
  return (
    <div className="flex min-h-screen items-center justify-center bg-driftae-black px-5">
      <div className="text-center">
        <h1 className="font-display text-[28px] font-light text-driftae-white">Page not found</h1>
        <p className="mt-3 font-body text-[14px] text-driftae-muted">This page doesn&apos;t exist, or the model has moved.</p>
        <Link to="/collection" className="btn-gold mt-8 inline-block px-10 py-4">
          Browse the collection
        </Link>
      </div>
    </div>
  );
}
