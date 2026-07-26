import { isSupabaseConfigured, supabase } from './supabase';

export type AnalyticsRange = 'today' | '7d' | '30d' | 'all';

export interface DailyAnalyticsRow {
  id: number;
  date: string;
  visitors: number;
  page_views: number;
  contact_requests: number;
  configurations_started: number;
  configurations_submitted: number;
}

export interface PageAnalyticsRow {
  id: number;
  date: string;
  page_path: string;
  view_count: number;
}

export interface ModelAnalyticsRow {
  id: number;
  date: string;
  model_id: string;
  model_name: string;
  view_count: number;
}

export interface VisitorAnalyticsRow {
  id: number;
  date: string;
  language: 'de' | 'en' | 'sk';
  device_type: 'desktop' | 'tablet' | 'mobile';
  source: 'google' | 'direct' | 'external' | 'unknown';
  count: number;
}

export interface AnalyticsData {
  daily: DailyAnalyticsRow[];
  pages: PageAnalyticsRow[];
  models: ModelAnalyticsRow[];
  visitors: VisitorAnalyticsRow[];
}

const EMPTY_ANALYTICS_DATA: AnalyticsData = {
  daily: [],
  pages: [],
  models: [],
  visitors: [],
};

async function fetchTable<T>(table: string): Promise<T[]> {
  if (!isSupabaseConfigured || !supabase) return [];

  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order('date', { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []) as T[];
}

export async function fetchAnalyticsData(): Promise<AnalyticsData> {
  if (!isSupabaseConfigured || !supabase) return EMPTY_ANALYTICS_DATA;

  const [daily, pages, models, visitors] = await Promise.all([
    fetchTable<DailyAnalyticsRow>('daily_analytics'),
    fetchTable<PageAnalyticsRow>('page_analytics'),
    fetchTable<ModelAnalyticsRow>('model_analytics'),
    fetchTable<VisitorAnalyticsRow>('visitor_analytics'),
  ]);

  return { daily, pages, models, visitors };
}
