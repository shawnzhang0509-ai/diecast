import { cn } from '@/lib/utils';

type ProductImageProps = {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  padding?: 'sm' | 'md' | 'lg';
  hoverScale?: boolean;
  fill?: boolean;
  /** Softer showroom frame; set false for full-bleed hero if needed */
  framed?: boolean;
};

const padMap = { sm: 'p-3', md: 'p-5', lg: 'p-8' };

/** Full model visible (letterboxed) inside a soft rounded frame. */
export default function ProductImage({
  src,
  alt,
  className,
  aspectRatio = '4/3',
  padding = 'md',
  hoverScale = false,
  fill = false,
  framed = true,
}: ProductImageProps) {
  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden',
        framed &&
          'rounded-2xl border border-white/[0.07] bg-gradient-to-b from-[#1f1f1f] to-[#121212] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_12px_40px_rgba(0,0,0,0.35)]',
        !framed && 'bg-[#1a1a1a]',
        fill && 'h-full w-full',
        className,
      )}
      style={fill ? undefined : { aspectRatio }}
    >
      <img
        src={src}
        alt={alt}
        className={cn(
          'max-h-full max-w-full object-contain',
          padMap[padding],
          hoverScale &&
            'transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-[1.02]',
        )}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
