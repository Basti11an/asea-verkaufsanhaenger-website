import { useConfiguratorCopy } from "../configurator/copy";

export function ConfiguratorPage() {
  const { text } = useConfiguratorCopy();

  return (
    <main className="flex min-h-dvh flex-col bg-[#f5f1e9] text-[#262824]">
      <header className="flex h-16 items-center justify-between border-b border-[#d8d4cb] px-5 sm:px-8">
        <a href="/" aria-label="ASEA Startseite" className="text-xl font-semibold tracking-normal">
          ASEA
        </a>
        <span className="text-sm font-medium text-[#6f746c]">{text("resetTitle")}</span>
      </header>

      <section className="flex flex-1 items-center px-6 py-16 sm:px-10">
        <div className="mx-auto w-full max-w-2xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-normal text-[#9b7545]">ASEA</p>
          <h1 className="text-4xl font-semibold tracking-normal sm:text-5xl">{text("resetTitle")}</h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-[#5f645c] sm:text-lg">
            {text("resetDescription")}
          </p>
          <p className="mt-3 text-sm text-[#858980]">{text("resetHint")}</p>
        </div>
      </section>
    </main>
  );
}
