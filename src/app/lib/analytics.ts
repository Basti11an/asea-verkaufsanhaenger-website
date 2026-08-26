import { isSupabaseConfigured, supabase } from './supabase';
import type { Lang } from '../context/LanguageContext';
import { hasStatisticsConsent } from './privacyConsent';

// Pauses the custom Supabase analytics while keeping the call sites easy to reactivate later.
export const INTERNAL_ANALYTICS_PAUSED = true;

export type AnalyticsEventType =
  | 'page_view'
  | 'model_view'
  | 'contact_request'
  | 'configuration_started'
  | 'configuration_submitted';

export type AnalyticsDeviceType = 'desktop' | 'tablet' | 'mobile';
export type AnalyticsSource = 'google' | 'direct' | 'external' | 'unknown';

interface AnalyticsPayload {
  pagePath?: string;
  modelId?: string;
  modelName?: string;
  language?: Lang;
}

const RECENT_EVENT_WINDOW_MS = 1200;
const recentEvents = new Map<string, number>();

export function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function normalizeLanguage(language?: string): Lang {
  return language === 'en' || language === 'sk' ? language : 'de';
}

function getStorageValue(key: string) {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function setStorageValue(key: string, value: string) {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {}
}

function getSessionId() {
  const existing = getStorageValue('asea-analytics-session-id');
  if (existing) return existing;

  const generated =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  setStorageValue('asea-analytics-session-id', generated);
  return generated;
}

function shouldCountVisitor(dateKey: string) {
  if (typeof window === 'undefined') return false;

  const sessionId = getSessionId();
  const key = `asea-analytics-visitor-counted:${sessionId}:${dateKey}`;

  if (getStorageValue(key)) return false;

  setStorageValue(key, '1');
  return true;
}

function getDeviceType(): AnalyticsDeviceType {
  if (typeof window === 'undefined') return 'desktop';

  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

function getVisitorSource(): AnalyticsSource {
  const stored = getStorageValue('asea-analytics-source');
  if (stored === 'google' || stored === 'direct' || stored === 'external' || stored === 'unknown') {
    return stored;
  }

  let source: AnalyticsSource = 'unknown';

  try {
    const referrer = document.referrer;

    if (!referrer) {
      source = 'direct';
    } else {
      const referrerUrl = new URL(referrer);
      const host = referrerUrl.hostname.toLowerCase();

      if (referrerUrl.origin === window.location.origin) {
        source = 'direct';
      } else if (host.includes('google.')) {
        source = 'google';
      } else {
        source = 'external';
      }
    }
  } catch {
    source = 'unknown';
  }

  setStorageValue('asea-analytics-source', source);
  return source;
}

function isRecentDuplicate(key: string) {
  const now = Date.now();
  const lastSeen = recentEvents.get(key);

  for (const [eventKey, timestamp] of recentEvents.entries()) {
    if (now - timestamp > RECENT_EVENT_WINDOW_MS) {
      recentEvents.delete(eventKey);
    }
  }

  if (lastSeen && now - lastSeen < RECENT_EVENT_WINDOW_MS) return true;

  recentEvents.set(key, now);
  return false;
}

export async function trackAnalyticsEvent(eventType: AnalyticsEventType, payload: AnalyticsPayload = {}) {
  if (INTERNAL_ANALYTICS_PAUSED) return;
  if (!isSupabaseConfigured || !supabase) return;
  if (typeof window === 'undefined') return;
  if (!hasStatisticsConsent()) return;

  const eventDate = getLocalDateKey();
  const pagePath = payload.pagePath?.trim() || null;
  const modelId = payload.modelId?.trim() || null;
  const modelName = payload.modelName?.trim() || null;
  const language = normalizeLanguage(payload.language);
  const duplicateKey = `${eventType}|${eventDate}|${pagePath ?? ''}|${modelId ?? ''}|${modelName ?? ''}`;

  if (isRecentDuplicate(duplicateKey)) return;

  const countVisitor = eventType === 'page_view' ? shouldCountVisitor(eventDate) : false;

  try {
    const { error } = await supabase.rpc('track_analytics_event', {
      p_event_type: eventType,
      p_event_date: eventDate,
      p_page_path: pagePath,
      p_model_id: modelId,
      p_model_name: modelName,
      p_language: language,
      p_device_type: getDeviceType(),
      p_source: getVisitorSource(),
      p_count_visitor: countVisitor,
    });

    if (error) {
      console.warn('Analytics tracking failed:', error.message);
    }
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }
}
