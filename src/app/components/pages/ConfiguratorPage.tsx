import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { TrailerConfigurator } from '../configurator/TrailerConfigurator';
import { Button } from '../ui/button';
import { useLanguage, type TranslationKey } from '../../context/LanguageContext';

interface ConfiguratorNavData {
  returnPage?: string;
  model?: any;
}

interface ConfiguratorPageProps {
  onNavigate?: (page: string, data?: any) => void;
  navData?: ConfiguratorNavData | null;
}

type ConfiguratorStage = 'mobile-warning' | 'intro' | 'configurator';

const INTRO_STEPS = [
  {
    titleKey: 'configurator_step1_title',
    textKey: 'configurator_step1_text',
  },
  {
    titleKey: 'configurator_step2_title',
    textKey: 'configurator_step2_text',
  },
  {
    titleKey: 'configurator_step3_title',
    textKey: 'configurator_step3_text',
  },
  {
    titleKey: 'configurator_step4_title',
    textKey: 'configurator_step4_text',
  },
] as const satisfies { titleKey: TranslationKey; textKey: TranslationKey }[];

function getInitialStage(): ConfiguratorStage {
  if (typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches) {
    return 'mobile-warning';
  }

  return 'intro';
}

export function ConfiguratorPage({ onNavigate, navData }: ConfiguratorPageProps) {
  const { t } = useLanguage();
  const [stage, setStage] = useState<ConfiguratorStage>(getInitialStage);

  const navigateBackToTrailer = () => {
    if (navData?.returnPage === 'model-detail' && navData.model) {
      onNavigate?.('model-detail', { model: navData.model });
      return;
    }

    onNavigate?.('models');
  };

  const startConfigurator = () => {
    setStage('configurator');
  };

  if (stage === 'mobile-warning') {
    return (
      <div className="w-full h-full min-h-0 overflow-y-auto bg-[#f8f7f3] px-4 py-8 md:px-8 md:py-10 flex items-start justify-center">
        <div className="w-full max-w-xl bg-white border border-[#dfd9cf] rounded-xl shadow-sm p-6 md:p-8">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#9a7445] mb-2">{t('configurator_warning_eyebrow')}</p>
            <h1 className="text-2xl md:text-3xl font-bold text-[#2f2f2d]">{t('configurator_warning_title')}</h1>
            <p className="text-sm text-[#77756f] mt-2">{t('configurator_warning_subtitle')}</p>
          </div>

          <p className="text-[#55524c] leading-relaxed mb-6">
            {t('configurator_warning_body')}
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              onClick={navigateBackToTrailer}
              className="w-full border-[#b08a57]/40 text-[#2f2f2d]"
            >
              <ArrowLeft size={16} className="mr-2" />
              {t('configurator_warning_back')}
            </Button>
            <Button
              type="button"
              onClick={() => setStage('intro')}
              className="w-full bg-[#b08a57] hover:bg-[#9a7445] text-white"
            >
              {t('configurator_warning_continue')}
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'intro') {
    return (
      <div className="w-full h-full min-h-0 overflow-y-auto bg-[#f8f7f3] px-4 py-8 pb-28 md:px-8 md:py-10 lg:px-12 flex items-start justify-center">
        <div className="w-full max-w-4xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#9a7445]">{t('configurator_recommended')}</p>
              <h1 className="text-3xl md:text-5xl font-bold text-[#2f2f2d] mb-3">{t('configurator_intro_title')}</h1>
              <p className="text-base md:text-lg text-[#77756f] max-w-2xl">
                {t('configurator_intro_text')}
              </p>
              <p className="mt-3 text-sm text-[#77756f] max-w-2xl">
                {t('configurator_legal_note')}
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#dfd9cf] rounded-xl shadow-sm mb-8">
            {INTRO_STEPS.map((step, index) => (
              <div
                key={step.titleKey}
                className="grid gap-3 border-b border-[#dfd9cf] p-5 last:border-b-0 md:grid-cols-[120px_1fr] md:p-6"
              >
                <span className="text-sm font-semibold text-[#b08a57]">{t('configurator_step_label')} {index + 1}</span>
                <div>
                  <h2 className="text-lg font-bold text-[#2f2f2d] mb-1">{t(step.titleKey)}</h2>
                  <p className="text-sm md:text-base text-[#77756f] leading-relaxed">{t(step.textKey)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="fixed bottom-0 left-0 right-0 z-[60] border-t border-[#dfd9cf] bg-[#f8f7f3]/95 px-4 py-3 shadow-[0_-12px_30px_rgba(47,47,45,0.08)] backdrop-blur">
            <div className="mx-auto flex w-full max-w-4xl flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={navigateBackToTrailer}
                className="border-[#b08a57]/40 text-[#2f2f2d]"
              >
                <ArrowLeft size={16} className="mr-2" />
                {t('configurator_back')}
              </Button>
              <Button
                type="button"
                size="lg"
                onClick={startConfigurator}
                className="bg-[#b08a57] hover:bg-[#9a7445] text-white"
              >
                {t('configurator_start')}
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f8f7f3] flex flex-col lg:h-full lg:overflow-hidden">
      <div className="flex-1 w-full p-4 md:p-6 lg:p-8 xl:p-12 lg:overflow-hidden">
        <p className="mb-3 rounded-lg border border-[#dfd9cf] bg-white px-4 py-3 text-xs md:text-sm text-[#77756f]">
          {t('configurator_legal_note')}
        </p>
        <TrailerConfigurator onNavigate={onNavigate} />
      </div>
    </div>
  );
}
