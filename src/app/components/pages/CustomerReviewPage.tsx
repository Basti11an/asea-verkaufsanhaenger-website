import { FormEvent, useMemo, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { useLanguage } from '../../context/LanguageContext';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import {
  CUSTOMER_REVIEW_RPC_NAME,
  createCustomerReviewRpcPayload,
  createSafeReviewRpcErrorLog,
  getReviewErrorCode,
} from '../../lib/customerReviewRpc';
import { ReviewForm } from '../reviews/ReviewForm';

interface CustomerReviewPageProps {
  onNavigate?: (page: string) => void;
}

type SubmitState = 'idle' | 'sending' | 'success' | 'invalid' | 'error';

type ReviewRpcResult = 'not_called' | 'success' | 'invalid' | 'error';

interface ReviewSubmitDiagnostic {
  token_present: boolean;
  rating_present: boolean;
  description_length: number;
  rpc_called: boolean;
  rpc_result: ReviewRpcResult;
  error_code?: string;
}

const REVIEW_TOKEN_STORAGE_KEY = 'asea-customer-review-token';

function readTokenFromParams(params: string) {
  try {
    return new URLSearchParams(params).get('token')?.trim() ?? '';
  } catch {
    return '';
  }
}

function rememberReviewToken(token: string) {
  try {
    sessionStorage.setItem(REVIEW_TOKEN_STORAGE_KEY, token);
  } catch {
    // Session storage is only a convenience for mobile browsers that rewrite URLs.
  }
}

function readRememberedReviewToken() {
  try {
    return sessionStorage.getItem(REVIEW_TOKEN_STORAGE_KEY)?.trim() ?? '';
  } catch {
    return '';
  }
}

function getTokenFromUrl() {
  if (typeof window === 'undefined') return '';

  const searchToken = readTokenFromParams(window.location.search);
  if (searchToken) {
    rememberReviewToken(searchToken);
    return searchToken;
  }

  const hash = window.location.hash ?? '';
  const hashQueryStart = hash.indexOf('?');
  const hashParams = hashQueryStart >= 0 ? hash.slice(hashQueryStart) : hash.replace(/^#/, '');
  const hashToken = readTokenFromParams(hashParams);
  if (hashToken) {
    rememberReviewToken(hashToken);
    return hashToken;
  }

  return readRememberedReviewToken();
}

function logReviewSubmitDiagnostic(diagnostic: ReviewSubmitDiagnostic) {
  const logPayload = {
    token_present: diagnostic.token_present,
    rating_present: diagnostic.rating_present,
    description_length: diagnostic.description_length,
    rpc_called: diagnostic.rpc_called,
    rpc_result: diagnostic.rpc_result,
    error_code: diagnostic.error_code,
  };

  if (diagnostic.rpc_result === 'error' || diagnostic.error_code) {
    console.warn('Customer review submit diagnostic:', logPayload);
    return;
  }

  console.info('Customer review submit diagnostic:', logPayload);
}

export function CustomerReviewPage({ onNavigate }: CustomerReviewPageProps) {
  const { t } = useLanguage();
  const token = useMemo(getTokenFromUrl, []);
  const submitInFlightRef = useRef(false);
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [publicConsent, setPublicConsent] = useState(false);
  const [state, setState] = useState<SubmitState>(token ? 'idle' : 'invalid');
  const [validationMessage, setValidationMessage] = useState('');
  const [submitDiagnostic, setSubmitDiagnostic] = useState<ReviewSubmitDiagnostic | null>(null);

  const updateDiagnostic = (diagnostic: ReviewSubmitDiagnostic) => {
    setSubmitDiagnostic(diagnostic);
    logReviewSubmitDiagnostic(diagnostic);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationMessage('');
    setSubmitDiagnostic(null);

    const trimmedDescription = description.trim();
    const baseDiagnostic = {
      token_present: Boolean(token),
      rating_present: rating >= 1 && rating <= 5,
      description_length: trimmedDescription.length,
    };

    if (!token) {
      updateDiagnostic({
        ...baseDiagnostic,
        rpc_called: false,
        rpc_result: 'not_called',
        error_code: 'missing_token',
      });
      setState('invalid');
      return;
    }

    if (rating < 1 || rating > 5) {
      updateDiagnostic({
        ...baseDiagnostic,
        rpc_called: false,
        rpc_result: 'not_called',
        error_code: 'missing_rating',
      });
      setValidationMessage(t('customer_review_rating_required'));
      return;
    }

    if (trimmedDescription.length < 10) {
      updateDiagnostic({
        ...baseDiagnostic,
        rpc_called: false,
        rpc_result: 'not_called',
        error_code: 'description_too_short',
      });
      setValidationMessage(t('customer_review_text_required'));
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      updateDiagnostic({
        ...baseDiagnostic,
        rpc_called: false,
        rpc_result: 'error',
        error_code: 'supabase_not_configured',
      });
      setState('error');
      return;
    }

    if (submitInFlightRef.current) return;

    submitInFlightRef.current = true;
    setState('sending');
    let finished = false;

    try {
      const rpcPayload = createCustomerReviewRpcPayload({
        token,
        rating,
        description: trimmedDescription,
        location: location.trim(),
        publicConsent,
      });

      const { data, error } = await supabase.rpc(CUSTOMER_REVIEW_RPC_NAME, rpcPayload);

      if (error) throw error;

      const nextState = data === false ? 'invalid' : 'success';
      updateDiagnostic({
        ...baseDiagnostic,
        rpc_called: true,
        rpc_result: data === false ? 'invalid' : 'success',
        error_code: data === false ? 'token_rejected' : undefined,
      });
      setState(nextState);
      finished = true;
    } catch (error) {
      const errorCode = getReviewErrorCode(error);
      updateDiagnostic({
        ...baseDiagnostic,
        rpc_called: true,
        rpc_result: 'error',
        error_code: errorCode,
      });
      console.error('Customer review submission failed:', {
        ...createSafeReviewRpcErrorLog(error),
        error_code: errorCode,
        token_present: Boolean(token),
        rating_present: rating >= 1 && rating <= 5,
        description_length: trimmedDescription.length,
      });
      setState('error');
    } finally {
      if (!finished) {
        submitInFlightRef.current = false;
      }
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

          <ReviewForm
            onSubmit={handleSubmit}
            rating={rating}
            onRatingChange={setRating}
            description={description}
            onDescriptionChange={setDescription}
            location={location}
            onLocationChange={setLocation}
            publicConsent={publicConsent}
            onPublicConsentChange={setPublicConsent}
            submitLabel={t('customer_review_submit')}
            sendingLabel={t('customer_review_sending')}
            isSending={state === 'sending'}
            validationMessage={validationMessage}
            className="rounded-xl border border-[#dfd9cf] bg-white p-6 md:p-8 shadow-sm"
            errorContent={state === 'error' ? (
              <p className="mt-4 rounded-md border border-[#c85d4f]/25 bg-[#c85d4f]/10 px-3 py-2 text-sm text-[#8b332a]">
                {t('customer_review_error')}
                {submitDiagnostic?.error_code && (
                  <span className="mt-1 block text-xs text-[#8b332a]/80">
                    {t('customer_review_error_code')}: {submitDiagnostic.error_code}
                  </span>
                )}
              </p>
            ) : null}
          />
        </div>
      </div>
    </section>
  );
}
