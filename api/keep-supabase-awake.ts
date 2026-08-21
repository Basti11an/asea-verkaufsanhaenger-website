import { createClient } from '@supabase/supabase-js';
import type { IncomingMessage, ServerResponse } from 'node:http';

type JsonPayload = Record<string, unknown>;

function sendJson(res: ServerResponse, statusCode: number, payload: JsonPayload, isHeadRequest = false) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');

  if (isHeadRequest) {
    res.end();
    return;
  }

  res.end(JSON.stringify(payload));
}

function readHeader(req: IncomingMessage, name: string) {
  const value = req.headers[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value;
}

function getEnv(name: string) {
  return process.env[name]?.trim() ?? '';
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const isHeadRequest = req.method === 'HEAD';

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    sendJson(res, 405, { ok: false, error: 'Method not allowed' }, isHeadRequest);
    return;
  }

  const cronSecret = getEnv('CRON_SECRET');

  if (!cronSecret) {
    console.error('Supabase keepalive failed: CRON_SECRET is not configured.');
    sendJson(res, 500, { ok: false, error: 'Cron secret is not configured' }, isHeadRequest);
    return;
  }

  const authorization = readHeader(req, 'authorization');

  if (authorization !== `Bearer ${cronSecret}`) {
    sendJson(res, 401, { ok: false, error: 'Unauthorized' }, isHeadRequest);
    return;
  }

  const supabaseUrl = getEnv('SUPABASE_URL') || getEnv('VITE_SUPABASE_URL');
  const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY') || getEnv('VITE_SUPABASE_ANON_KEY');

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase keepalive failed: Supabase environment variables are missing.');
    sendJson(res, 500, { ok: false, error: 'Supabase is not configured' }, isHeadRequest);
    return;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { error } = await supabase
      .from('customer_references')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Supabase keepalive query failed:', error.message);
      sendJson(res, 502, { ok: false, error: 'Supabase query failed' }, isHeadRequest);
      return;
    }

    sendJson(res, 200, { ok: true, checked: 'customer_references' }, isHeadRequest);
  } catch (error) {
    console.error('Supabase keepalive failed:', error);
    sendJson(res, 500, { ok: false, error: 'Unexpected keepalive error' }, isHeadRequest);
  }
}
