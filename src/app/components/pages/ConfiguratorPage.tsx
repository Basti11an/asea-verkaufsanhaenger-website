import { useLanguage } from '../../context/LanguageContext';

export function ConfiguratorPage() {
  const { t } = useLanguage();

  return (
    <section className="flex min-h-[60vh] items-center justify-center bg-[#f8f7f3] px-6 py-20 md:px-8 lg:px-12">
      <div className="w-full max-w-2xl text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#9a7445]">ASEA</p>
        <h1 className="text-3xl font-bold text-[#2f2f2d] md:text-5xl">{t('configurator_page_title')}</h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#77756f] md:text-lg">
          {t('configurator_page_status')}
        </p>
        <p className="mt-3 text-sm text-[#9a7445]">{t('configurator_page_note')}</p>
      </div>
    </section>
  );
}
