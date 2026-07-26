import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '../ui/button';
import {
  AnalyticsData,
  AnalyticsRange,
  DailyAnalyticsRow,
  fetchAnalyticsData,
  ModelAnalyticsRow,
  PageAnalyticsRow,
  VisitorAnalyticsRow,
} from '../../lib/analyticsRepository';
import { getLocalDateKey } from '../../lib/analytics';
import { isSupabaseConfigured } from '../../lib/supabase';

const RANGE_OPTIONS: { id: AnalyticsRange; label: string }[] = [
  { id: 'today', label: 'Heute' },
  { id: '7d', label: 'Letzte 7 Tage' },
  { id: '30d', label: 'Letzte 30 Tage' },
  { id: 'all', label: 'Gesamt' },
];

const PAGE_LABELS: Record<string, string> = {
  home: 'Startseite',
  about: 'Über uns',
  configurator: 'Konfigurator',
  models: 'Modelle',
  'model-detail': 'Modelldetails',
  equipment: 'Ausstattung',
  contact: 'Kontakt',
  imprint: 'Impressum',
  privacy: 'Datenschutz',
};

const LANGUAGE_LABELS: Record<string, string> = {
  de: 'Deutsch',
  en: 'Englisch',
  sk: 'Slowakisch',
};

const DEVICE_LABELS: Record<string, string> = {
  desktop: 'Desktop',
  tablet: 'Tablet',
  mobile: 'Smartphone',
};

const SOURCE_LABELS: Record<string, string> = {
  google: 'Google',
  direct: 'Direkter Aufruf',
  external: 'Andere Website',
  unknown: 'Unbekannt',
};

const EMPTY_DATA: AnalyticsData = {
  daily: [],
  pages: [],
  models: [],
  visitors: [],
};

function formatNumber(value: number) {
  return new Intl.NumberFormat('de-AT').format(value);
}

function parseLocalDate(dateKey: string) {
  return new Date(`${dateKey}T00:00:00`);
}

function getDateKeyOffset(daysBack: number) {
  const date = new Date();
  date.setDate(date.getDate() - daysBack);
  return getLocalDateKey(date);
}

function getRangeStart(range: AnalyticsRange) {
  if (range === 'today') return getLocalDateKey();
  if (range === '7d') return getDateKeyOffset(6);
  if (range === '30d') return getDateKeyOffset(29);
  return null;
}

function filterByRange<T extends { date: string }>(rows: T[], range: AnalyticsRange) {
  const start = getRangeStart(range);
  if (!start) return rows;
  return rows.filter((row) => row.date >= start);
}

function sumDaily(rows: DailyAnalyticsRow[]) {
  return rows.reduce(
    (acc, row) => ({
      visitors: acc.visitors + row.visitors,
      pageViews: acc.pageViews + row.page_views,
      contactRequests: acc.contactRequests + row.contact_requests,
      configurationsStarted: acc.configurationsStarted + row.configurations_started,
      configurationsSubmitted: acc.configurationsSubmitted + row.configurations_submitted,
    }),
    {
      visitors: 0,
      pageViews: 0,
      contactRequests: 0,
      configurationsStarted: 0,
      configurationsSubmitted: 0,
    },
  );
}

function groupPages(rows: PageAnalyticsRow[]) {
  const grouped = new Map<string, number>();

  rows.forEach((row) => {
    grouped.set(row.page_path, (grouped.get(row.page_path) ?? 0) + row.view_count);
  });

  return Array.from(grouped.entries())
    .map(([key, value]) => ({
      label: PAGE_LABELS[key] ?? key,
      value,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);
}

function groupModels(rows: ModelAnalyticsRow[]) {
  const grouped = new Map<string, { label: string; value: number }>();

  rows.forEach((row) => {
    const key = row.model_id;
    const current = grouped.get(key);

    grouped.set(key, {
      label: row.model_name || row.model_id,
      value: (current?.value ?? 0) + row.view_count,
    });
  });

  return Array.from(grouped.values())
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);
}

function groupVisitorDimension(
  rows: VisitorAnalyticsRow[],
  field: 'language' | 'device_type' | 'source',
  labels: Record<string, string>,
) {
  const grouped = new Map<string, number>();

  rows.forEach((row) => {
    grouped.set(row[field], (grouped.get(row[field]) ?? 0) + row.count);
  });

  return Object.keys(labels).map((key) => ({
    label: labels[key],
    value: grouped.get(key) ?? 0,
  }));
}

function getTrendRows(dailyRows: DailyAnalyticsRow[]) {
  const byDate = new Map(dailyRows.map((row) => [row.date, row]));

  return Array.from({ length: 30 }, (_, index) => {
    const daysBack = 29 - index;
    const date = getDateKeyOffset(daysBack);
    return {
      date,
      visitors: byDate.get(date)?.visitors ?? 0,
    };
  });
}

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-gray-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[#2f2f2d]">{value}</p>
      {hint && <p className="mt-1 text-xs text-[#77756f]">{hint}</p>}
    </div>
  );
}

function BarList({ title, items, emptyText }: { title: string; items: { label: string; value: number }[]; emptyText: string }) {
  const maxValue = Math.max(...items.map((item) => item.value), 1);
  const hasData = items.some((item) => item.value > 0);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-base font-semibold text-[#2f2f2d]">{title}</h3>
      {!hasData ? (
        <p className="rounded-lg bg-[#f8f7f3] px-4 py-3 text-sm text-[#77756f]">{emptyText}</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.label}>
              <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                <span className="min-w-0 truncate text-[#55524c]">{item.label}</span>
                <span className="shrink-0 font-semibold text-[#2f2f2d]">{formatNumber(item.value)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#f3efe8]">
                <div
                  className="h-full rounded-full bg-[#b08a57]"
                  style={{ width: `${Math.max(4, (item.value / maxValue) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function DashboardTab() {
  const [range, setRange] = useState<AnalyticsRange>('30d');
  const [data, setData] = useState<AnalyticsData>(EMPTY_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setData(await fetchAnalyticsData());
    } catch (loadError) {
      setData(EMPTY_DATA);
      setError(loadError instanceof Error ? loadError.message : 'Analytics konnten nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAnalytics();
  }, [loadAnalytics]);

  const dashboard = useMemo(() => {
    const selectedDaily = filterByRange(data.daily, range);
    const selectedPages = filterByRange(data.pages, range);
    const selectedModels = filterByRange(data.models, range);
    const selectedVisitors = filterByRange(data.visitors, range);
    const today = getLocalDateKey();
    const todayVisitors = data.daily.find((row) => row.date === today)?.visitors ?? 0;
    const visitors7 = sumDaily(filterByRange(data.daily, '7d')).visitors;
    const visitors30 = sumDaily(filterByRange(data.daily, '30d')).visitors;
    const selectedStats = sumDaily(selectedDaily);
    const abandonmentRate =
      selectedStats.configurationsStarted > 0
        ? Math.max(
            0,
            Math.round((1 - selectedStats.configurationsSubmitted / selectedStats.configurationsStarted) * 100),
          )
        : 0;

    return {
      selectedStats,
      todayVisitors,
      visitors7,
      visitors30,
      abandonmentRate,
      trend: getTrendRows(data.daily),
      topPages: groupPages(selectedPages),
      topModels: groupModels(selectedModels),
      languages: groupVisitorDimension(selectedVisitors, 'language', LANGUAGE_LABELS),
      devices: groupVisitorDimension(selectedVisitors, 'device_type', DEVICE_LABELS),
      sources: groupVisitorDimension(selectedVisitors, 'source', SOURCE_LABELS),
    };
  }, [data, range]);

  const maxTrendVisitors = Math.max(...dashboard.trend.map((row) => row.visitors), 1);
  const maxConfigurator = Math.max(
    dashboard.selectedStats.configurationsStarted,
    dashboard.selectedStats.configurationsSubmitted,
    1,
  );

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#2f2f2d]">Dashboard</h2>
          <p className="text-sm text-[#77756f]">
            Kompakte Website-Kennzahlen ohne personenbezogene Besucherdaten.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex overflow-x-auto rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
            {RANGE_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setRange(option.id)}
                className={`h-8 shrink-0 rounded-lg px-3 text-xs font-semibold transition-colors ${
                  range === option.id
                    ? 'bg-[#1e2a3a] text-white'
                    : 'text-[#77756f] hover:bg-[#f3efe8] hover:text-[#2f2f2d]'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => void loadAnalytics()}
            disabled={loading}
            className="h-9 border-gray-200 bg-white text-xs"
          >
            {loading ? 'Lädt...' : 'Aktualisieren'}
          </Button>
        </div>
      </div>

      {!isSupabaseConfigured && (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Supabase ist lokal nicht konfiguriert. Das Dashboard bleibt leer, die Website funktioniert weiter.
        </div>
      )}

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Analytics-Hinweis: {error}. Falls die Tabellen noch fehlen, führe `supabase/analytics.sql` im Supabase SQL Editor aus.
        </div>
      )}

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Besucher heute" value={formatNumber(dashboard.todayVisitors)} />
        <StatCard label="Besucher 7 Tage" value={formatNumber(dashboard.visitors7)} />
        <StatCard label="Besucher 30 Tage" value={formatNumber(dashboard.visitors30)} />
        <StatCard label="Seitenaufrufe" value={formatNumber(dashboard.selectedStats.pageViews)} hint="Gewählter Zeitraum" />
        <StatCard label="Kontaktanfragen" value={formatNumber(dashboard.selectedStats.contactRequests)} hint="Gewählter Zeitraum" />
        <StatCard label="Konfigurationen gestartet" value={formatNumber(dashboard.selectedStats.configurationsStarted)} hint="Gewählter Zeitraum" />
        <StatCard label="Konfigurationen abgeschickt" value={formatNumber(dashboard.selectedStats.configurationsSubmitted)} hint="Gewählter Zeitraum" />
        <StatCard label="Abbruchrate" value={`${dashboard.abandonmentRate} %`} hint="Gewählter Zeitraum" />
      </div>

      <div className="mb-5 grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-[#2f2f2d]">Besucherentwicklung der letzten 30 Tage</h3>
          <div className="flex h-52 items-end gap-1.5 overflow-x-auto border-b border-gray-200 pb-2">
            {dashboard.trend.map((row) => {
              const date = parseLocalDate(row.date);
              const height = row.visitors > 0 ? Math.max(8, (row.visitors / maxTrendVisitors) * 100) : 0;

              return (
                <div key={row.date} className="flex min-w-[22px] flex-1 flex-col items-center justify-end gap-2">
                  <div
                    className="w-full rounded-t-md bg-[#b08a57]"
                    style={{ height: `${height}%` }}
                    title={`${date.toLocaleDateString('de-AT')}: ${row.visitors} Besucher`}
                  />
                  <span className="hidden text-[10px] text-gray-400 md:block">
                    {date.toLocaleDateString('de-AT', { day: '2-digit', month: '2-digit' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-[#2f2f2d]">Konfigurator</h3>
          <div className="space-y-5">
            {[
              { label: 'Gestartet', value: dashboard.selectedStats.configurationsStarted },
              { label: 'Abgeschickt', value: dashboard.selectedStats.configurationsSubmitted },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-[#55524c]">{item.label}</span>
                  <span className="font-semibold text-[#2f2f2d]">{formatNumber(item.value)}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-[#f3efe8]">
                  <div
                    className="h-full rounded-full bg-[#1e2a3a]"
                    style={{ width: `${Math.max(item.value > 0 ? 5 : 0, (item.value / maxConfigurator) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
            <div className="rounded-lg bg-[#f8f7f3] p-4 text-sm text-[#77756f]">
              Abbruchrate: <span className="font-semibold text-[#2f2f2d]">{dashboard.abandonmentRate} %</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <BarList title="Meistbesuchte Seiten" items={dashboard.topPages} emptyText="Noch keine Seitenaufrufe vorhanden." />
        <BarList title="Meistangesehene Anhängermodelle" items={dashboard.topModels} emptyText="Noch keine Modellaufrufe vorhanden." />
        <BarList title="Sprachenverteilung" items={dashboard.languages} emptyText="Noch keine Besucherdaten vorhanden." />
        <BarList title="Geräteverteilung" items={dashboard.devices} emptyText="Noch keine Gerätedaten vorhanden." />
        <div className="lg:col-span-2">
          <BarList title="Herkunft der Besucher" items={dashboard.sources} emptyText="Noch keine Herkunftsdaten vorhanden." />
        </div>
      </div>
    </div>
  );
}
