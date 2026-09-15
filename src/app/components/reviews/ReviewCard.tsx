import type { CSSProperties } from 'react';
import type { AdminReference } from '../../context/AdminDataContext';
import { useLanguage } from '../../context/LanguageContext';
import { getReferenceDescription, getReferenceModelLabel } from '../../lib/referenceUtils';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { StarRating } from './StarRating';

interface ReviewCardProps {
  review: AdminReference;
  className?: string;
  compact?: boolean;
  showImage?: boolean;
  variant?: 'standard' | 'polaroid';
  index?: number;
  truncateText?: boolean;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

const POLAROID_ROTATIONS = ['-2.8deg', '1.8deg', '-1.2deg', '2.6deg', '1.4deg', '-2.1deg', '2.2deg', '-1.6deg'];
const PIN_ROTATIONS = ['0deg'];

function getPolaroidRotation(index = 0) {
  return POLAROID_ROTATIONS[index % POLAROID_ROTATIONS.length];
}

function getPinRotation(index = 0) {
  return PIN_ROTATIONS[index % PIN_ROTATIONS.length];
}

export function ReviewCard({
  review,
  className = '',
  compact = false,
  showImage = true,
  variant = 'standard',
  index = 0,
  truncateText = false,
}: ReviewCardProps) {
  const { t } = useLanguage();
  const description = getReferenceDescription(review);
  const initials = getInitials(review.kundenname);
  const modelLabel = getReferenceModelLabel(review.modell, t);
  const meta = [review.ort, modelLabel, review.jahr ? String(review.jahr) : ''].filter(Boolean).join(' · ');
  const polaroidMeta = [review.ort, review.jahr ? String(review.jahr) : ''].filter(Boolean).join(' · ');

  if (variant === 'polaroid') {
    const style = {
      '--review-rotation': getPolaroidRotation(index),
      '--pin-rotation': getPinRotation(index),
    } as CSSProperties;

    return (
      <article
        className={`polaroid-review-card relative h-full bg-white p-3 pb-4 shadow-[0_14px_34px_rgba(47,47,45,0.13)] ${className}`}
        style={style}
      >
        <span className="polaroid-review-pin" aria-hidden="true">
          <img className="polaroid-review-pin-image" src="/review-gold-pin.png" alt="" draggable={false} />
        </span>

        {showImage && (
          <div className="relative aspect-[4/3] overflow-hidden border border-[#e5ded3] bg-[#f3efe8]">
            {review.bildUrl ? (
              <ImageWithFallback
                src={review.bildUrl}
                alt={review.kundenname || modelLabel}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-[linear-gradient(135deg,#eee7dc_0%,#fbfaf7_55%,#e7ddce_100%)] px-4 text-center">
                <span className="text-3xl font-extrabold tracking-[0.1em] text-[#b08a57]/80">ASEA</span>
                <span className="mt-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[#77756f]">
                  {modelLabel}
                </span>
              </div>
            )}
          </div>
        )}

        <div className={compact ? 'px-1 pt-3' : 'px-2 pt-3'}>
          <StarRating value={review.rating} size="sm" className="mb-2" />

          {description && (
            <p
              className={`text-[14px] leading-relaxed text-[#2f2f2d] ${
                truncateText ? 'line-clamp-3' : ''
              }`}
            >
              „{description}“
            </p>
          )}

          <div className="mt-4 border-t border-[#dfd9cf] pt-3">
            <h3 className="text-sm font-bold leading-tight text-[#2f2f2d]">
              {review.kundenname || t('review_anonymous_name')}
            </h3>
            {polaroidMeta && (
              <p className="mt-1 text-xs leading-relaxed text-[#77756f]">{polaroidMeta}</p>
            )}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className={`overflow-hidden rounded-xl border border-[#dfd9cf] bg-white shadow-sm ${className}`}>
      {showImage && (
        <div className={`relative ${compact ? 'h-32' : 'h-44'} overflow-hidden bg-[#f3efe8]`}>
          {review.bildUrl ? (
            <ImageWithFallback
              src={review.bildUrl}
              alt={review.kundenname || modelLabel}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-2xl font-bold tracking-[0.12em] text-[#b08a57]/70 md:text-3xl">
                {initials || 'ASEA'}
              </span>
            </div>
          )}
        </div>
      )}

      <div className={compact ? 'p-4' : 'p-5 md:p-6'}>
        <div className="flex flex-col gap-2">
          <div className="min-w-0">
            <h3 className={`${compact ? 'text-base' : 'text-lg'} font-semibold leading-tight text-[#2f2f2d]`}>
              {review.kundenname || t('review_anonymous_name')}
            </h3>
            {meta && <p className="mt-1 text-xs leading-relaxed text-[#77756f]">{meta}</p>}
          </div>

          <StarRating value={review.rating} size={compact ? 'sm' : 'md'} />
        </div>

        {description && (
          <p className={`mt-4 text-sm leading-relaxed text-[#5f5b53] ${compact ? 'text-sm' : ''}`}>
            {description}
          </p>
        )}
      </div>
    </article>
  );
}
