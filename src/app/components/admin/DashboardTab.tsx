export function DashboardTab() {
  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-amber-700">Außer Betrieb</p>
            <h2 className="mt-2 text-xl font-semibold text-[#2f2f2d] md:text-2xl">
              Internes Analytics-Dashboard pausiert
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#6f665a] md:text-base">
              Die eigene Supabase-Erfassung der ASEA-Website ist aktuell ausgeschaltet. Es werden keine internen
              Seitenaufrufe, Modellaufrufe, Kontaktzähler oder Konfigurator-Zähler mehr an Supabase gesendet.
            </p>
          </div>
          <span className="w-fit rounded-full border border-amber-300 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-amber-800">
            Pausiert
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-[#2f2f2d]">Keine eigene Erfassung</h3>
          <p className="mt-2 text-sm leading-relaxed text-[#77756f]">
            Die zentrale Tracking-Funktion ist deaktiviert und schreibt keine neuen Supabase-Daten.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-[#2f2f2d]">Bestehende Daten bleiben erhalten</h3>
          <p className="mt-2 text-sm leading-relaxed text-[#77756f]">
            Vorhandene Tabellen oder alte Werte werden nicht gelöscht oder verändert.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-[#2f2f2d]">Vercel Analytics bleibt separat</h3>
          <p className="mt-2 text-sm leading-relaxed text-[#77756f]">
            Die neue Vercel-Auswertung bleibt davon getrennt und läuft nur nach Statistik-Zustimmung.
          </p>
        </div>
      </div>
    </div>
  );
}
