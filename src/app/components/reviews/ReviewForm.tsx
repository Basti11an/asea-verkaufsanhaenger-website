import { useId, type FormEvent, type ReactNode } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useLanguage } from '../../context/LanguageContext';
import { StarRating } from './StarRating';

interface ReviewFormProps {
  rating: number;
  onRatingChange: (value: number) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  location?: string;
  onLocationChange?: (value: string) => void;
  publicConsent?: boolean;
  onPublicConsentChange?: (value: boolean) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submitLabel: string;
  sendingLabel: string;
  isSending?: boolean;
  validationMessage?: string;
  errorContent?: ReactNode;
  childrenBefore?: ReactNode;
  childrenAfter?: ReactNode;
  className?: string;
  idPrefix?: string;
}

export function ReviewForm({
  rating,
  onRatingChange,
  description,
  onDescriptionChange,
  location,
  onLocationChange,
  publicConsent,
  onPublicConsentChange,
  onSubmit,
  submitLabel,
  sendingLabel,
  isSending = false,
  validationMessage,
  errorContent,
  childrenBefore,
  childrenAfter,
  className = '',
  idPrefix,
}: ReviewFormProps) {
  const { t } = useLanguage();
  const generatedId = useId();
  const fieldIdPrefix = idPrefix ?? `review-${generatedId}`;
  const descriptionId = `${fieldIdPrefix}-description`;
  const locationId = `${fieldIdPrefix}-location`;

  return (
    <form onSubmit={onSubmit} className={className}>
      {childrenBefore}

      <div>
        <Label className="text-[#2f2f2d]">{t('customer_review_rating_label')}</Label>
        <div className="mt-3">
          <StarRating
            value={rating}
            onChange={onRatingChange}
            size="lg"
            disabled={isSending}
            label={t('review_rating_group_label')}
          />
        </div>
      </div>

      <div className="mt-6">
        <Label htmlFor={descriptionId} className="text-[#2f2f2d]">
          {t('customer_review_text_label')}
        </Label>
        <Textarea
          id={descriptionId}
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          placeholder={t('customer_review_text_placeholder')}
          maxLength={1600}
          disabled={isSending}
          className="mt-2 min-h-36 border-[#dfd9cf] bg-[#fbfaf7] focus-visible:border-[#b08a57] focus-visible:ring-[#b08a57]/25"
        />
      </div>

      {onLocationChange && (
        <div className="mt-6">
          <Label htmlFor={locationId} className="text-[#2f2f2d]">
            {t('customer_review_location_label')}
          </Label>
          <Input
            id={locationId}
            value={location ?? ''}
            onChange={(event) => onLocationChange(event.target.value)}
            placeholder={t('customer_review_location_placeholder')}
            maxLength={120}
            disabled={isSending}
            className="mt-2 border-[#dfd9cf] bg-[#fbfaf7] focus-visible:border-[#b08a57] focus-visible:ring-[#b08a57]/25"
          />
        </div>
      )}

      {onPublicConsentChange && (
        <label className="mt-6 flex items-start gap-3 rounded-lg border border-[#dfd9cf] bg-[#f8f7f3] p-4 text-sm leading-relaxed text-[#5f5b53]">
          <input
            type="checkbox"
            checked={Boolean(publicConsent)}
            onChange={(event) => onPublicConsentChange(event.target.checked)}
            disabled={isSending}
            className="mt-1 h-4 w-4 accent-[#b08a57]"
          />
          <span>{t('customer_review_public_consent')}</span>
        </label>
      )}

      {childrenAfter}

      {validationMessage && (
        <p className="mt-4 rounded-md border border-[#c85d4f]/25 bg-[#c85d4f]/10 px-3 py-2 text-sm text-[#8b332a]">
          {validationMessage}
        </p>
      )}

      {errorContent}

      <Button
        type="submit"
        disabled={isSending}
        className="mt-6 w-full bg-[#2f2f2d] text-white hover:bg-[#1c1c1a] sm:w-auto"
      >
        {isSending ? sendingLabel : submitLabel}
      </Button>
    </form>
  );
}
