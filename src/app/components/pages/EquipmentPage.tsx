import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { useLanguage } from '../../context/LanguageContext';

interface EquipmentPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function EquipmentPage({ onNavigate }: EquipmentPageProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-[#f8f7f3]">
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#9a7445]">
              ASEA
            </p>
            <h1 className="text-3xl font-bold leading-tight text-[#2f2f2d] md:text-5xl">
              {t('equip_hero_title')}
            </h1>
            <p className="mt-6 text-base leading-relaxed text-[#77756f] md:text-lg">
              {t('equip_hero_desc')}
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24">
          <div className="mx-auto max-w-4xl rounded-xl border border-[#dfd9cf] bg-white p-6 shadow-sm md:p-10">
            <p className="text-lg leading-relaxed text-[#2f2f2d] md:text-xl">
              {t('equip_intro')}
            </p>
            <div className="mt-6 border-l-2 border-[#b08a57]/55 pl-5">
              <p className="text-base leading-relaxed text-[#77756f]">
                {t('equip_note')}
              </p>
            </div>
            <Button
              type="button"
              onClick={() => onNavigate('contact')}
              className="mt-8 bg-[#2f2f2d] text-white hover:bg-[#1c1c1a]"
            >
              {t('equip_cta_btn1')}
              <ArrowRight className="ml-2" size={16} />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
