import { Star } from 'lucide-react';
import type { TranslationKey } from '../../context/LanguageContext';
import { useLanguage } from '../../context/LanguageContext';

interface StarRatingProps {
  value?: number | null;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
  disabled?: boolean;
}

const SIZE_CLASSES = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-7 w-7',
};

const BUTTON_SIZE_CLASSES = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

function clampRating(value?: number | null) {
  if (!value || value < 1 || value > 5) return null;
  return Math.round(value);
}

export function StarRating({
  value,
  onChange,
  size = 'md',
  className = '',
  label,
  disabled = false,
}: StarRatingProps) {
  const { t } = useLanguage();
  const rating = clampRating(value);
  const isInteractive = Boolean(onChange);
  const ariaLabel = label ?? (rating ? t('review_star_label').replace('{rating}', String(rating)) : t('review_no_rating'));

  if (!isInteractive) {
    if (!rating) return null;

    return (
      <div className={`inline-flex items-center gap-0.5 ${className}`} aria-label={ariaLabel} title={ariaLabel}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${SIZE_CLASSES[size]} ${star <= rating ? 'text-[#c8a96e] fill-[#c8a96e]' : 'text-[#c9c5bd]'}`}
            strokeWidth={1.7}
            aria-hidden="true"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1 ${className}`} role="radiogroup" aria-label={label ?? t('review_rating_group_label')}>
      {[1, 2, 3, 4, 5].map((star) => {
        const selected = rating === star;
        const active = rating ? star <= rating : false;
        const starLabelKey = `review_star_option_${star}` as TranslationKey;

        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={t(starLabelKey)}
            disabled={disabled}
            onClick={() => onChange?.(star)}
            className={`${BUTTON_SIZE_CLASSES[size]} inline-flex items-center justify-center rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8a96e]/40 ${
              active
                ? 'border-[#c8a96e]/70 bg-[#c8a96e]/10 text-[#c8a96e]'
                : 'border-[#dfd9cf] bg-[#fbfaf7] text-[#aaa59c] hover:border-[#c8a96e]/70 hover:text-[#c8a96e]'
            } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
          >
            <Star
              className={`${SIZE_CLASSES[size]} ${active ? 'fill-[#c8a96e]' : 'fill-transparent'}`}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </button>
        );
      })}
    </div>
  );
}
