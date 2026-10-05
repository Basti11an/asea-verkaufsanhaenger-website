import { useLanguage } from '../../context/LanguageContext';
import { TrailerModelViewer } from '../configurator/TrailerModelViewer';

export function ConfiguratorPage() {
  const { t } = useLanguage();

  return (
    <section className="bg-[#f8f7f3] px-4 py-10 md:px-8 md:py-14 lg:px-12">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#9a7445]">ASEA</p>
          <h1 className="text-3xl font-bold text-[#2f2f2d] md:text-4xl">{t('configurator_page_title')}</h1>
        </div>
        <TrailerModelViewer />
      </div>
    </section>
  );
}
