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

export function ReviewCard({ review, className = '', compact = false, showImage = true }: ReviewCardProps) {
  const { t } = useLanguage();
  const description = getReferenceDescription(review);
  const initials = getInitials(review.kundenname);
  const modelLabel = getReferenceModelLabel(review.modell, t);
  const meta = [review.ort, modelLabel, review.jahr ? String(review.jahr) : ''].filter(Boolean).join(' · ');

  return (
    <article className={`overflow-hidden rounded-xl border border-[#dfd9cf] bg-white shadow-sm ${className}`}>
      {showImage && (
        <div className={`relative ${compact ? 'h-32' : 'h-44'} overflow-hidden bg-[#f3efe8]`}>
          {review.bildUrl ? (
            <ImageWithFallback
              src={review.bildUrl}
              alt={review.kundenname || modelLabel}
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
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
