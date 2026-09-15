import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { AdminReference } from '../context/AdminDataContext';
import { getLatestApprovedReferences, isApprovedVisibleReference } from './referenceUtils';

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

  it('uses one shared star and review form system across public and admin review surfaces', () => {
    expect(read('src/app/components/pages/CustomerReviewPage.tsx')).toContain("import { ReviewForm }");
    expect(read('src/app/components/references/ReferenceSubmitPanel.tsx')).toContain("import { ReviewForm }");
    expect(read('src/app/components/admin/ReferenzenTab.tsx')).toContain("import { StarRating }");
    expect(read('src/app/components/admin/EingaengeTab.tsx')).toContain("import { StarRating }");
    expect(read('src/app/components/reviews/ReviewCard.tsx')).toContain("import { StarRating }");
  });

  it('exposes the public reviews page and keeps public fallback reads consent-filtered', () => {
    expect(read('src/app/App.tsx')).toContain("reviews: '/bewertungen'");
    expect(read('src/app/App.tsx')).toContain("'/bewertungen': 'reviews'");
    expect(read('src/app/lib/referencesRepository.ts')).toContain(".eq('public_consent', true)");
  });
});
