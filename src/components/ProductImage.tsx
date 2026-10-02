import { cn } from '@/lib/utils';

type ProductImageProps = {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  padding?: 'sm' | 'md' | 'lg';
  hoverScale?: boolean;
  fill?: boolean;
};

const padMap = { sm: 'p-2', md: 'p-4', lg: 'p-6' };

/** Shows full model without cropping (letterboxed on dark canvas). */
export default function ProductImage({
  src,
  alt,
  className,
  aspectRatio = '4/3',
  padding = 'md',
  hoverScale = false,
  fill = false,
}: ProductImageProps) {
  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden bg-[#1a1a1a]',
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
            'transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-[1.03]',
        )}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
