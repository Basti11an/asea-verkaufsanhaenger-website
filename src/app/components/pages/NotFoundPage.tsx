import { Button } from '../ui/button';

interface NotFoundPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function NotFoundPage({ onNavigate }: NotFoundPageProps) {
  return (
    <div className="bg-[#f8f7f3]">
      <section className="min-h-[62vh] bg-white py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 xl:px-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-[#9a7445]">
              404
            </p>
            <h1 className="text-3xl font-bold leading-tight text-[#2f2f2d] md:text-5xl">
              Seite nicht gefunden
            </h1>
            <p className="mt-5 text-base leading-relaxed text-[#77756f] md:text-lg">
              Die angeforderte Seite existiert nicht oder wurde verschoben.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                type="button"
                onClick={() => onNavigate('home')}
                className="bg-[#b08a57] text-white hover:bg-[#9a7445]"
              >
                Zur Startseite
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onNavigate('models')}
                className="border-[#b08a57]/45 text-[#2f2f2d]"
              >
                Modelle ansehen
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
