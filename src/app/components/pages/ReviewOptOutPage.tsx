import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useLanguage } from '../../context/LanguageContext';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';

interface ReviewOptOutPageProps {
  onNavigate?: (page: string) => void;
}

type OptOutState = 'loading' | 'done' | 'error';

export function ReviewOptOutPage({ onNavigate }: ReviewOptOutPageProps) {
  const { t } = useLanguage();
  const [state, setState] = useState<OptOutState>('loading');

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token')?.trim() ?? '';

    if (!token || !isSupabaseConfigured || !supabase) {
      setState(token ? 'error' : 'done');
      return;
    }

    let cancelled = false;

    void Promise.resolve(supabase.rpc('unsubscribe_customer_followup', { p_token: token }))
      .then(({ error }) => {
        if (cancelled) return;
        setState(error ? 'error' : 'done');
      })
      .catch(() => {
        if (!cancelled) setState('error');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="min-h-[70vh] bg-[#f8f7f3] py-16 md:py-24">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24">
        <div className="mx-auto max-w-xl rounded-xl border border-[#dfd9cf] bg-white p-8 text-center shadow-sm">
          <CheckCircle2 size={44} className="mx-auto mb-4 text-[#b08a57]" />
          <h1 className="text-2xl md:text-3xl font-bold text-[#2f2f2d]">
            {state === 'loading' ? t('review_opt_out_loading_title') : t('review_opt_out_title')}
          </h1>
          <p className="mt-3 text-[#77756f] leading-relaxed">
            {state === 'loading'
              ? t('review_opt_out_loading_desc')
              : state === 'error'
                ? t('review_opt_out_error_desc')
                : t('review_opt_out_desc')}
          </p>
          <Button
            type="button"
            onClick={() => onNavigate?.('home')}
            className="mt-6 bg-[#2f2f2d] hover:bg-[#1c1c1a] text-white"
          >
            {t('review_opt_out_back_home')}
          </Button>
        </div>
      </div>
    </section>
  );
}
