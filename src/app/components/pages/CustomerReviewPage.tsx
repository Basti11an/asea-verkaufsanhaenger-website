import { FormEvent, useMemo, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useLanguage } from '../../context/LanguageContext';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';

interface CustomerReviewPageProps {
  onNavigate?: (page: string) => void;
}

type SubmitState = 'idle' | 'sending' | 'success' | 'invalid' | 'error';

function getTokenFromUrl() {
  if (typeof window === 'undefined') return '';
  return new URLSearchParams(window.location.search).get('token')?.trim() ?? '';
}

export function CustomerReviewPage({ onNavigate }: CustomerReviewPageProps) {
  const { t } = useLanguage();
  const token = useMemo(getTokenFromUrl, []);
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [publicConsent, setPublicConsent] = useState(false);
  const [state, setState] = useState<SubmitState>(token ? 'idle' : 'invalid');
  const [validationMessage, setValidationMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationMessage('');

    if (!token) {
      setState('invalid');
      return;
    }

    if (rating < 1 || rating > 5) {
      setValidationMessage(t('customer_review_rating_required'));
      return;
    }

    const trimmedDescription = description.trim();
    if (trimmedDescription.length < 10) {
      setValidationMessage(t('customer_review_text_required'));
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setState('error');
      return;
    }

    setState('sending');

    try {
      const { data, error } = await supabase.rpc('submit_customer_review_with_token', {
        p_token: token,
        p_rating: rating,
        p_beschreibung: trimmedDescription,
        p_ort: location.trim(),
        p_public_consent: publicConsent,
      });

      if (error) throw error;

      setState(data === false ? 'invalid' : 'success');
    } catch (error) {
      console.error('Customer review submission failed:', error);
      setState('error');
    }
  };

  if (state === 'success' || state === 'invalid') {
    const isSuccess = state === 'success';

    return (
      <section className="min-h-[72vh] bg-[#f8f7f3] py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24">
          <div className="mx-auto max-w-xl rounded-xl border border-[#dfd9cf] bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-5 h-1.5 w-20 rounded-full bg-[#b08a57]" />
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#9a7445]">ASEA</p>
            <h1 className="text-2xl md:text-3xl font-bold text-[#2f2f2d]">
              {isSuccess ? t('customer_review_thanks_title') : t('customer_review_invalid_title')}
            </h1>
            <p className="mt-4 text-[#77756f] leading-relaxed">
              {isSuccess ? t('customer_review_thanks_desc') : t('customer_review_invalid_desc')}
            </p>
            <Button
              type="button"
              onClick={() => onNavigate?.('home')}
              className="mt-7 bg-[#2f2f2d] hover:bg-[#1c1c1a] text-white"
            >
              {t('customer_review_back_home')}
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[72vh] bg-[#f8f7f3] py-12 md:py-20">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-xl border border-[#dfd9cf] bg-[#2f2f2d] p-7 text-white shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#d8bd91]">ASEA</p>
            <h1 className="mt-5 text-3xl md:text-4xl font-bold leading-tight">
              {t('customer_review_title')}
            </h1>
            <p className="mt-5 text-white/78 leading-relaxed">
              {t('customer_review_intro')}
            </p>
            <div className="mt-8 border-t border-white/15 pt-5 text-sm leading-relaxed text-white/68">
              {t('customer_review_privacy_hint')}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-[#dfd9cf] bg-white p-6 md:p-8 shadow-sm"
          >
            <div>
              <Label className="text-[#2f2f2d]">{t('customer_review_rating_label')}</Label>
              <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label={t('customer_review_rating_label')}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={rating === value}
                    onClick={() => setRating(value)}
                    className={`h-12 w-12 rounded-md border text-2xl transition-colors ${
                      value <= rating
                        ? 'border-[#b08a57] bg-[#b08a57] text-white'
                        : 'border-[#dfd9cf] bg-[#f8f7f3] text-[#8a867d] hover:border-[#b08a57]'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <Label htmlFor="review-description" className="text-[#2f2f2d]">
                {t('customer_review_text_label')}
              </Label>
              <Textarea
                id="review-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder={t('customer_review_text_placeholder')}
                maxLength={1600}
                className="mt-2 min-h-36 border-[#dfd9cf] bg-[#fbfaf7] focus-visible:border-[#b08a57] focus-visible:ring-[#b08a57]/25"
              />
            </div>

            <div className="mt-6">
              <Label htmlFor="review-location" className="text-[#2f2f2d]">
                {t('customer_review_location_label')}
              </Label>
              <Input
                id="review-location"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder={t('customer_review_location_placeholder')}
                maxLength={120}
                className="mt-2 border-[#dfd9cf] bg-[#fbfaf7] focus-visible:border-[#b08a57] focus-visible:ring-[#b08a57]/25"
              />
            </div>

            <label className="mt-6 flex items-start gap-3 rounded-lg border border-[#dfd9cf] bg-[#f8f7f3] p-4 text-sm leading-relaxed text-[#5f5b53]">
              <input
                type="checkbox"
                checked={publicConsent}
                onChange={(event) => setPublicConsent(event.target.checked)}
                className="mt-1 h-4 w-4 accent-[#b08a57]"
              />
              <span>{t('customer_review_public_consent')}</span>
            </label>

            {validationMessage && (
              <p className="mt-4 rounded-md border border-[#c85d4f]/25 bg-[#c85d4f]/10 px-3 py-2 text-sm text-[#8b332a]">
                {validationMessage}
              </p>
            )}

            {state === 'error' && (
              <p className="mt-4 rounded-md border border-[#c85d4f]/25 bg-[#c85d4f]/10 px-3 py-2 text-sm text-[#8b332a]">
                {t('customer_review_error')}
              </p>
            )}

            <Button
              type="submit"
              disabled={state === 'sending'}
              className="mt-6 w-full bg-[#b08a57] hover:bg-[#9a7445] text-white"
            >
              {state === 'sending' ? t('customer_review_sending') : t('customer_review_submit')}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
