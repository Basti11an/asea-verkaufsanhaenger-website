import { useMemo, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ReviewCard } from '../reviews/ReviewCard';
import { useAdminData } from '../../context/AdminDataContext';
import { useLanguage } from '../../context/LanguageContext';
import { getReferenceModelLabel, isApprovedVisibleReference, normalizeModelName, sortReferencesNewestFirst } from '../../lib/referenceUtils';

const RATING_OPTIONS = [5, 4, 3, 2, 1];

export function ReviewsPage() {
  const { references, referencesLoading, referencesError } = useAdminData();
  const { t } = useLanguage();
  const [modelFilter, setModelFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');

  const publicReviews = useMemo(
    () => sortReferencesNewestFirst(references).filter(isApprovedVisibleReference),
    [references],
  );

  const modelOptions = useMemo(() => {
    const values = new Map<string, string>();
    publicReviews.forEach((review) => {
      if (!review.modell) return;
      values.set(normalizeModelName(review.modell), review.modell);
    });
    return [...values.values()];
  }, [publicReviews]);

  const filteredReviews = useMemo(() => {
    const normalizedLocation = locationFilter.trim().toLowerCase();
    const selectedRating = ratingFilter === 'all' ? null : Number(ratingFilter);

    return publicReviews.filter((review) => {
      const modelMatches = modelFilter === 'all' || normalizeModelName(review.modell) === normalizeModelName(modelFilter);
      const ratingMatches = selectedRating === null || review.rating === selectedRating;
      const locationMatches = !normalizedLocation || review.ort.toLowerCase().includes(normalizedLocation);
      return modelMatches && ratingMatches && locationMatches;
    });
  }, [locationFilter, modelFilter, publicReviews, ratingFilter]);

  const resetFilters = () => {
    setModelFilter('all');
    setRatingFilter('all');
    setLocationFilter('');
  };

  return (
    <div className="overflow-hidden bg-[#f8f7f3]">
      <section className="border-b border-[#dfd9cf] bg-white py-14 md:py-20">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#9a7445]">
              ASEA
            </p>
            <h1 className="text-3xl font-bold leading-tight text-[#2f2f2d] md:text-5xl">
              {t('reviews_page_title')}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-[#77756f] md:text-lg">
              {t('reviews_page_intro')}
            </p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-8 md:py-10">
        <div className="absolute inset-0 opacity-[0.35] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(176,138,87,0.11) 1px, transparent 0)', backgroundSize: '30px 30px' }} />
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24">
          <div className="relative z-10 rounded-xl border border-[#dfd9cf] bg-white p-4 shadow-sm md:p-5">
            <div className="grid gap-3 md:grid-cols-[1fr_180px_1fr_auto] md:items-end">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-[#77756f]">
                  {t('reviews_filter_model')}
                </span>
                <select
                  value={modelFilter}
                  onChange={(event) => setModelFilter(event.target.value)}
                  className="h-10 w-full rounded-md border border-[#dfd9cf] bg-white px-3 text-sm text-[#2f2f2d] focus:outline-none focus:border-[#b08a57]"
                >
                  <option value="all">{t('reviews_filter_all_models')}</option>
                  {modelOptions.map((model) => (
                    <option key={model} value={model}>
                      {getReferenceModelLabel(model, t)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-[#77756f]">
                  {t('reviews_filter_rating')}
                </span>
                <select
                  value={ratingFilter}
                  onChange={(event) => setRatingFilter(event.target.value)}
                  className="h-10 w-full rounded-md border border-[#dfd9cf] bg-white px-3 text-sm text-[#2f2f2d] focus:outline-none focus:border-[#b08a57]"
                >
                  <option value="all">{t('reviews_filter_all_ratings')}</option>
                  {RATING_OPTIONS.map((rating) => (
                    <option key={rating} value={rating}>
                      {t('reviews_filter_rating_option').replace('{rating}', String(rating))}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-[#77756f]">
                  {t('reviews_filter_location')}
                </span>
                <Input
                  value={locationFilter}
                  onChange={(event) => setLocationFilter(event.target.value)}
                  placeholder={t('reviews_filter_location_placeholder')}
                  className="h-10 border-[#dfd9cf] bg-white"
                />
              </label>

              <Button
                type="button"
                variant="outline"
                onClick={resetFilters}
                className="h-10 border-[#b08a57]/40 text-[#2f2f2d]"
              >
                {t('reviews_filter_reset')}
              </Button>
            </div>
          </div>

          {referencesLoading && (
            <div className="mt-6 rounded-xl border border-[#b08a57]/20 bg-white px-4 py-3 text-sm text-[#77756f]">
              {t('reviews_loading')}
            </div>
          )}

          {referencesError && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {referencesError}
            </div>
          )}

          {filteredReviews.length === 0 ? (
            <div className="mt-8 rounded-xl border border-[#dfd9cf] bg-white p-10 text-center shadow-sm">
              <h2 className="text-xl font-semibold text-[#2f2f2d]">{t('reviews_empty_title')}</h2>
              <p className="mt-2 text-sm text-[#77756f]">{t('reviews_empty_desc')}</p>
            </div>
          ) : (
            <div className="relative z-10 mt-10 grid grid-cols-1 gap-x-6 gap-y-9 px-1 py-3 sm:grid-cols-2 md:px-3 lg:grid-cols-4 lg:gap-x-7 lg:gap-y-11">
              {filteredReviews.map((review, index) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  variant="polaroid"
                  index={index}
                  className="mx-auto w-full max-w-[320px]"
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
