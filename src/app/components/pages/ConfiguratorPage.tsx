import { useState } from 'react';
import { ArrowLeft, ArrowRight, Calculator, LayoutGrid, Monitor, Palette, Smartphone, Tablet, Wrench } from 'lucide-react';
import { TrailerConfigurator } from '../configurator/TrailerConfigurator';
import { Button } from '../ui/button';

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
    icon: LayoutGrid,
    title: 'Setup wählen',
    text: 'Entscheiden Sie zuerst, wie viel Arbeitsfläche und Innenausstattung Ihr Anhänger braucht.',
  },
  {
    icon: Palette,
    title: 'Farben anpassen',
    text: 'Wählen Sie Außenfarbe, Boden, Theke und Türen passend zu Ihrem Auftritt.',
  },
  {
    icon: Wrench,
    title: 'Ausstattung auswählen',
    text: 'Fügen Sie Geräte und Extras hinzu. Nicht passende Kombinationen werden automatisch angepasst.',
  },
  {
    icon: Calculator,
    title: 'Preis prüfen',
    text: 'Am Ende sehen Sie den Nettopreis und können Ihre Konfiguration direkt anfragen.',
  },
];

function getInitialStage(): ConfiguratorStage {
  if (typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches) {
    return 'mobile-warning';
  }

  return 'intro';
}

export function ConfiguratorPage({ onNavigate, navData }: ConfiguratorPageProps) {
  const [stage, setStage] = useState<ConfiguratorStage>(getInitialStage);

  const navigateBackToTrailer = () => {
    if (navData?.returnPage === 'model-detail' && navData.model) {
      onNavigate?.('model-detail', { model: navData.model });
      return;
    }

    onNavigate?.('models');
  };

  if (stage === 'mobile-warning') {
    return (
      <div className="w-full min-h-full bg-[#f8f7f3] px-4 py-10 md:px-8 flex items-center justify-center">
        <div className="w-full max-w-xl bg-white border border-[#dfd9cf] rounded-2xl shadow-xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-xl bg-[#b08a57]/15 text-[#9a7445] flex items-center justify-center">
              <Smartphone size={26} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#2f2f2d]">Hinweis zum Konfigurator</h1>
              <p className="text-sm text-[#77756f]">Am Handy ist die Bedienung enger.</p>
            </div>
          </div>

          <p className="text-[#55524c] leading-relaxed mb-6">
            Der Konfigurator funktioniert auch am Handy, ist dort aber deutlich umständlicher.
            Am angenehmsten nutzen Sie ihn am PC oder Tablet, weil die 3D-Ansicht und die Auswahlfelder mehr Platz haben.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              type="button"
              variant="outline"
              onClick={navigateBackToTrailer}
              className="w-full border-[#b08a57]/40 text-[#2f2f2d]"
            >
              <ArrowLeft size={16} className="mr-2" />
              Zurück zum Anhänger
            </Button>
            <Button
              type="button"
              onClick={() => setStage('intro')}
              className="w-full bg-[#b08a57] hover:bg-[#9a7445] text-white"
            >
              Trotzdem fortfahren
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'intro') {
    return (
      <div className="w-full min-h-full bg-[#f8f7f3] px-4 py-10 md:px-8 lg:px-12 flex items-center justify-center">
        <div className="w-full max-w-5xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-4 flex items-center gap-2 text-sm text-[#9a7445]">
                <Monitor size={18} />
                <Tablet size={18} />
                <span>PC und Tablet empfohlen</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-[#2f2f2d] mb-3">So funktioniert der Konfigurator</h1>
              <p className="text-base md:text-lg text-[#77756f] max-w-2xl">
                In wenigen Schritten stellen Sie Ihren eigenen Verkaufsanhänger zusammen und können danach direkt ein Angebot anfragen.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-8">
            {INTRO_STEPS.map((step, index) => {
              const Icon = step.icon;

              return (
                <div key={step.title} className="bg-white border border-[#dfd9cf] rounded-xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-[#b08a57]/15 text-[#9a7445] flex items-center justify-center">
                      <Icon size={22} />
                    </div>
                    <span className="text-xs font-semibold text-[#b08a57]">Schritt {index + 1}</span>
                  </div>
                  <h2 className="text-lg font-bold text-[#2f2f2d] mb-2">{step.title}</h2>
                  <p className="text-sm text-[#77756f] leading-relaxed">{step.text}</p>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={navigateBackToTrailer}
              className="border-[#b08a57]/40 text-[#2f2f2d]"
            >
              <ArrowLeft size={16} className="mr-2" />
              Zurück
            </Button>
            <Button
              type="button"
              size="lg"
              onClick={() => setStage('configurator')}
              className="bg-[#b08a57] hover:bg-[#9a7445] text-white"
            >
              Konfigurator starten
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f8f7f3] flex flex-col lg:h-full lg:overflow-hidden">
      <div className="flex-1 w-full p-4 md:p-6 lg:p-8 xl:p-12 lg:overflow-hidden">
        <TrailerConfigurator onNavigate={onNavigate} />
      </div>
    </div>
  );
}
