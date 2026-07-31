const GOLD = '#C7A96B';

/** Classic vintage coupe side-profile silhouette — single continuous stroke */
function CarIcon({ className = '', color = GOLD }: { className?: string; color?: string }) {
  return (
    <svg
      viewBox="0 0 100 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M3 20.5
           C3 19 4.5 18 6.5 18
           H12
           C12.5 15.5 14.5 13.5 17 13.5
           H20
           C20.5 11 22.5 9 25 8.5
           L38 6
           C44 5 50 4.5 56 5.5
           L68 8
           C72 9 75.5 10.5 78 12
           L82 13.5
           C84.5 14.5 86 16 86 18
           C86 19.5 84.5 20.5 83 20.5
           H77
           M22 20.5
           C22 18.5 23.5 17 25.5 17
           C27.5 17 29 18.5 29 20.5
           M67 20.5
           C67 18.5 68.5 17 70.5 17
           C72.5 17 74 18.5 74 20.5
           H6.5"
        stroke={color}
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  /** compact = nav bar, full = hero/footer, icon = car only */
  variant?: 'compact' | 'full' | 'icon';
  /** light text on dark bg (default), dark text on light bg */
  theme?: 'dark' | 'light';
  showTagline?: boolean;
}

export default function Logo({
  className = '',
  variant = 'compact',
  theme = 'dark',
  showTagline = false,
}: LogoProps) {
  const textColor = theme === 'dark' ? '#F7F7F7' : '#0D0D0D';
  const goldColor = GOLD;

  if (variant === 'icon') {
    return <CarIcon className={className} color={goldColor} />;
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <CarIcon className="h-8 w-32 sm:h-10 sm:w-40" color={goldColor} />
        <span
          className="mt-4 font-display text-[28px] font-semibold uppercase sm:text-[36px]"
          style={{ color: textColor, letterSpacing: '0.35em' }}
        >
          DRIFTAE
        </span>
        <div className="mt-4 flex items-center gap-4">
          <span className="h-px w-12 sm:w-16" style={{ backgroundColor: goldColor }} />
          <span
            className="font-display text-[9px] font-medium uppercase sm:text-[10px]"
            style={{ color: goldColor, letterSpacing: '0.25em' }}
          >
            Premium Classic Automobiles
          </span>
          <span className="h-px w-12 sm:w-16" style={{ backgroundColor: goldColor }} />
        </div>
        {showTagline && (
          <p
            className="font-serif mt-5 text-[14px] italic sm:text-[16px]"
            style={{ color: goldColor }}
          >
            Passion for Classics. Built for Collectors.
          </p>
        )}
      </div>
    );
  }

  /* compact — stacked icon + wordmark for nav/footer */
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <CarIcon className="h-4 w-14" color={goldColor} />
      <span
        className="mt-1 font-display text-[13px] font-semibold uppercase leading-none sm:text-[14px]"
        style={{ color: textColor, letterSpacing: '0.3em' }}
      >
        DRIFTAE
      </span>
    </div>
  );
}

export { CarIcon };
