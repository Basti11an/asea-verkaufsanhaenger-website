import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { AdminReference } from '../context/AdminDataContext';
import {
  CUSTOMER_REVIEW_RPC_NAME,
  CUSTOMER_REVIEW_RPC_PARAM_NAMES,
  createCustomerReviewRpcPayload,
  createSafeReviewRpcErrorLog,
} from './customerReviewRpc';
import { getHomepagePreviewReferences, getLatestApprovedReferences, isApprovedVisibleReference } from './referenceUtils';

const ROOT = process.cwd();
const read = (path: string) => readFileSync(join(ROOT, path), 'utf8');

const baseReview: AdminReference = {
  id: 1,
  kundenname: 'ASEA Kunde',
  ort: 'Linz',
  modell: 'Verkaufsanhänger',
  jahr: 2026,
  beschreibung: 'Sehr gute Erfahrung mit dem Anhänger.',
  bildUrl: '',
  rating: 5,
  publicConsent: true,
  sichtbar: true,
  status: 'approved',
  kontaktEmail: '',
  kontaktTelefon: '',
};

describe('central review system', () => {
  it('shows only approved, visible and publicly consented reviews', () => {
    const approved = { ...baseReview, id: 1 };
    const pending = { ...baseReview, id: 2, status: 'pending' as const };
    const hidden = { ...baseReview, id: 3, sichtbar: false };
    const privateReview = { ...baseReview, id: 4, publicConsent: false };
    const oldReviewWithoutRating = { ...baseReview, id: 5, rating: null };

    expect(isApprovedVisibleReference(approved)).toBe(true);
    expect(isApprovedVisibleReference(oldReviewWithoutRating)).toBe(true);
    expect(isApprovedVisibleReference(pending)).toBe(false);
    expect(isApprovedVisibleReference(hidden)).toBe(false);
    expect(isApprovedVisibleReference(privateReview)).toBe(false);

    expect(getLatestApprovedReferences([approved, pending, hidden, privateReview, oldReviewWithoutRating], 10).map((review) => review.id))
      .toEqual([5, 1]);
  });

  it('limits the homepage review wall to the latest eight public reviews', () => {
    const manyApprovedReviews = Array.from({ length: 10 }, (_, index) => ({
      ...baseReview,
      id: index + 1,
    }));

    expect(getLatestApprovedReferences(manyApprovedReviews, 8).map((review) => review.id))
      .toEqual([10, 9, 8, 7, 6, 5, 4, 3]);
  });

  it('uses only four and five star reviews for the responsive homepage preview', () => {
    const reviews: AdminReference[] = [
      { ...baseReview, id: 1, rating: 3 },
      { ...baseReview, id: 2, rating: 4 },
      { ...baseReview, id: 3, rating: 5 },
      { ...baseReview, id: 4, rating: 4 },
      { ...baseReview, id: 5, rating: null },
      { ...baseReview, id: 6, rating: 5 },
    ];

    expect(getHomepagePreviewReferences(reviews, 1).map((review) => review.id))
      .toEqual([6]);
    expect(getHomepagePreviewReferences(reviews, 2).map((review) => review.id))
      .toEqual([6, 3]);
  });

  it('uses one shared star and review form system across public and admin review surfaces', () => {
    expect(read('src/app/components/pages/CustomerReviewPage.tsx')).toContain("import { ReviewForm }");
    expect(read('src/app/components/references/ReferenceSubmitPanel.tsx')).toContain("import { ReviewForm }");
    expect(read('src/app/components/admin/ReferenzenTab.tsx')).toContain("import { StarRating }");
    expect(read('src/app/components/admin/EingaengeTab.tsx')).toContain("import { StarRating }");
    expect(read('src/app/components/reviews/ReviewCard.tsx')).toContain("import { StarRating }");
  });

  it('keeps the contact review form stable when returning from the native image picker', () => {
    const submitPanel = read('src/app/components/references/ReferenceSubmitPanel.tsx');
    const imageUpload = read('src/app/components/ImageUploadField.tsx');
    const globalStyles = read('src/styles/globals.css');

    expect(submitPanel).not.toContain("from 'motion/react'");
    expect(submitPanel).not.toContain("height: 'auto'");
    expect(submitPanel).toContain('className="border-t border-[#dfd9cf] p-6 md:p-8"');
    expect(imageUpload).toContain('restoreScrollAfterFilePicker');
    expect(globalStyles).toContain('overflow-x: clip;');
  });

  it('renders public reviews as shared polaroid cards without the old homepage carousel', () => {
    const homePage = read('src/app/components/pages/HomePage.tsx');
    const reviewsPage = read('src/app/components/pages/ReviewsPage.tsx');
    const reviewCard = read('src/app/components/reviews/ReviewCard.tsx');

    expect(homePage).toContain('getLatestApprovedReferences(references, 8)');
    expect(homePage).toContain('getHomepagePreviewReferences(references, 1)');
    expect(homePage).toContain('getHomepagePreviewReferences(references, 2)');
    expect(homePage).not.toContain('ReferenceCarousel');
    expect(homePage).toContain('lg:grid-cols-4');
    expect(homePage).toContain('md:hidden');
    expect(homePage).toContain('md:grid lg:hidden');
    expect(homePage).toContain('variant="polaroid"');
    expect(reviewsPage).toContain('lg:grid-cols-4');
    expect(reviewsPage).toContain('variant="polaroid"');
    expect(reviewCard).toContain('polaroid-review-card');
    expect(reviewCard).toContain('--review-rotation');
  });

  it('exposes the public reviews page and keeps public fallback reads consent-filtered', () => {
    const referencesRepository = read('src/app/lib/referencesRepository.ts');
    const referencesSql = read('supabase/references.sql');

    expect(read('src/app/App.tsx')).toContain("reviews: '/bewertungen'");
    expect(read('src/app/App.tsx')).toContain("'/bewertungen': 'reviews'");
    expect(referencesRepository).toContain("publicResult.error.code === '42501'");
    expect(referencesRepository).toContain('RLS-filtered table read');
    expect(referencesSql).toContain('public_consent,\n  sichtbar,\n  status,\n  created_at');
    expect(referencesSql).toContain('using (status = \'approved\' and sichtbar = true and public_consent = true)');
  });

  it('calls the customer review RPC with the exact public SQL signature', () => {
    expect(CUSTOMER_REVIEW_RPC_NAME).toBe('submit_customer_review_with_token');
    expect(CUSTOMER_REVIEW_RPC_PARAM_NAMES).toEqual([
      'p_token',
      'p_rating',
      'p_beschreibung',
      'p_ort',
      'p_public_consent',
    ]);
  });

  it('normalizes review RPC payload types for rating, empty location and consent', () => {
    expect(createCustomerReviewRpcPayload({
      token: 'review-token',
      rating: 1,
      description: 'Eine gute Bewertung.',
      location: '',
      publicConsent: true,
    })).toEqual({
      p_token: 'review-token',
      p_rating: 1,
      p_beschreibung: 'Eine gute Bewertung.',
      p_ort: '',
      p_public_consent: true,
    });

    expect(createCustomerReviewRpcPayload({
      token: 'review-token',
      rating: 5.8,
      description: 'Noch eine Bewertung.',
      location: null,
      publicConsent: false,
    })).toMatchObject({
      p_rating: 5,
      p_ort: '',
      p_public_consent: false,
    });
  });

  it('logs safe 42883 RPC diagnostics without exposing the review token', () => {
    const safeLog = createSafeReviewRpcErrorLog({
      code: '42883',
      message: 'function digest(text, unknown) does not exist',
      details: 'No function matches the given name and argument types.',
      hint: 'You might need to add explicit type casts.',
    });

    expect(safeLog).toMatchObject({
      provider: 'supabase',
      rpc: 'submit_customer_review_with_token',
      code: '42883',
      param_names: CUSTOMER_REVIEW_RPC_PARAM_NAMES,
    });
    expect(JSON.stringify(safeLog)).not.toContain('review-token');
  });
});
