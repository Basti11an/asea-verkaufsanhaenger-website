import { useEffect, useState, type CSSProperties } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { AdminReference } from '../../context/AdminDataContext';
import { useLanguage } from '../../context/LanguageContext';
import { getReferenceImageUrls } from '../../lib/referenceImages';
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

function getPolaroidRotation(index = 0) {
  return POLAROID_ROTATIONS[index % POLAROID_ROTATIONS.length];
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
  const imageUrls = getReferenceImageUrls(review.bildUrl);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const selectedImageUrl = imageUrls[selectedImageIndex] ?? imageUrls[0] ?? '';

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [review.id, review.bildUrl]);

  const showImageControls = imageUrls.length > 1;

  const showPreviousImage = () => {
    setSelectedImageIndex((current) => (current - 1 + imageUrls.length) % imageUrls.length);
  };

  const showNextImage = () => {
    setSelectedImageIndex((current) => (current + 1) % imageUrls.length);
  };

  if (variant === 'polaroid') {
    const style = {
      '--review-rotation': getPolaroidRotation(index),
    } as CSSProperties;

    return (
      <article
        className={`polaroid-review-card relative h-full bg-white p-3 pb-4 shadow-[0_14px_34px_rgba(47,47,45,0.13)] ${className}`}
        style={style}
      >
        {showImage && (
          <div className="relative aspect-[4/3] overflow-hidden border border-[#e5ded3] bg-[#f3efe8]">
            {selectedImageUrl ? (
              <ImageWithFallback
                src={selectedImageUrl}
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
            {showImageControls && (
              <>
                <button
                  type="button"
                  onClick={showPreviousImage}
                  className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/86 text-[#2f2f2d] shadow-md transition hover:bg-white"
                  aria-label={t('review_image_previous')}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={showNextImage}
                  className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/86 text-[#2f2f2d] shadow-md transition hover:bg-white"
                  aria-label={t('review_image_next')}
                >
                  <ChevronRight size={18} />
                </button>
                <div className="absolute bottom-2 left-0 right-0 z-10 flex justify-center gap-1.5">
                  {imageUrls.map((url, imageIndex) => (
                    <button
                      key={`${url}-${imageIndex}`}
                      type="button"
                      onClick={() => setSelectedImageIndex(imageIndex)}
                      className={`h-2.5 w-2.5 rounded-full border border-white/90 shadow-sm transition ${
                        selectedImageIndex === imageIndex ? 'bg-[#b08a57]' : 'bg-white/80 hover:bg-white'
                      }`}
                      aria-label={t('review_image_select').replace('{number}', String(imageIndex + 1))}
                    />
                  ))}
                </div>
              </>
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
          {selectedImageUrl ? (
            <ImageWithFallback
              src={selectedImageUrl}
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
          {showImageControls && (
            <>
              <button
                type="button"
                onClick={showPreviousImage}
                className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/86 text-[#2f2f2d] shadow-md transition hover:bg-white"
                aria-label={t('review_image_previous')}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={showNextImage}
                className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/86 text-[#2f2f2d] shadow-md transition hover:bg-white"
                aria-label={t('review_image_next')}
              >
                <ChevronRight size={18} />
              </button>
              <div className="absolute bottom-2 left-0 right-0 z-10 flex justify-center gap-1.5">
                {imageUrls.map((url, imageIndex) => (
                  <button
                    key={`${url}-${imageIndex}`}
                    type="button"
                    onClick={() => setSelectedImageIndex(imageIndex)}
                    className={`h-2.5 w-2.5 rounded-full border border-white/90 shadow-sm transition ${
                      selectedImageIndex === imageIndex ? 'bg-[#b08a57]' : 'bg-white/80 hover:bg-white'
                    }`}
                    aria-label={t('review_image_select').replace('{number}', String(imageIndex + 1))}
                  />
                ))}
              </div>
            </>
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
