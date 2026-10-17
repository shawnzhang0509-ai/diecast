import { useEffect } from 'react';

const SITE = 'DRIFTAE — 1:18 Diecast Model Cars, New Zealand';

/** Per-page <title>; undefined keeps the site title (home). */
export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | DRIFTAE` : SITE;
  }, [title]);
}
