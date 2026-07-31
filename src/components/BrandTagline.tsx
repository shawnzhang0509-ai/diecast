interface BrandTaglineProps {
  text: string;
  className?: string;
}

/** Gold flanking lines + uppercase label — matches DRIFTAE brand guide */
export default function BrandTagline({ text, className = '' }: BrandTaglineProps) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <span className="h-px w-10 bg-driftae-gold sm:w-16" />
      <span className="font-display text-[9px] font-medium uppercase tracking-[0.25em] text-driftae-gold sm:text-[10px]">
        {text}
      </span>
      <span className="h-px w-10 bg-driftae-gold sm:w-16" />
    </div>
  );
}
