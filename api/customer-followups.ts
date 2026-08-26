import { createClient } from '@supabase/supabase-js';
import { createHash, randomBytes } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';

type JsonPayload = Record<string, unknown>;
export type ReminderStage = 'two_month' | 'six_month' | 'twelve_month';
export type PreferredLanguage = 'de' | 'en' | 'sk';

export interface ClaimedReminder {
  customer_id: number;
  reminder_stage: ReminderStage;
  customer_name: string;
  customer_email: string;
  preferred_language: PreferredLanguage;
  purchased_item: string;
  purchase_date: string;
}

interface ReminderCopy {
  subject: string;
  preheader: string;
  paragraphs: string[];
  question: string;
  cta: string;
  note: string;
}

interface LanguageCopy {
  htmlLang: string;
  greetingWithName: (name: string) => string;
  greetingFallback: string;
  productFallback: string;
  closing: string[];
  footerQuestion: string;
  unsubscribeCta: string;
  reviewTextLabel: string;
  unsubscribeTextLabel: string;
}

const REMINDER_COPY: Record<PreferredLanguage, Record<ReminderStage, ReminderCopy>> = {
  de: {
    two_month: {
      subject: 'Wie zufrieden sind Sie mit Ihrem ASEA Anhänger?',
      preheader: 'Wir würden gerne erfahren, wie zufrieden Sie bisher mit Ihrem ASEA Anhänger sind.',
      paragraphs: [
        'Ihr {{product}} ist seit dem Kauf mittlerweile rund zwei Monate bei Ihnen.',
        'Uns interessiert, wie zufrieden Sie bisher mit Ihrem Anhänger und Ihrer Erfahrung mit ASEA sind. Ihre Rückmeldung hilft uns dabei, unsere Produkte und unseren Service laufend weiterzuentwickeln.',
      ],
      question: 'Wie zufrieden sind Sie bisher mit Ihrem ASEA Anhänger?',
      cta: 'Erfahrung teilen',
      note: 'Die Rückmeldung ist selbstverständlich freiwillig und dauert nur wenige Minuten.',
    },
    six_month: {
      subject: 'Ihre Erfahrung mit Ihrem ASEA Anhänger',
      preheader: 'Teilen Sie Ihre bisherige Erfahrung mit Ihrem ASEA Anhänger.',
      paragraphs: [
        'Ihr {{product}} ist mittlerweile seit rund sechs Monaten bei Ihnen im Einsatz.',
        'Wir hoffen, dass sich Ihr Anhänger im Alltag gut bewährt. Wenn Sie bereits einige Erfahrungen sammeln konnten, würden wir uns sehr über eine kurze und ehrliche Bewertung freuen.',
        'Ihre Rückmeldung hilft nicht nur uns, sondern auch anderen Interessenten dabei, sich ein realistisches Bild von ASEA und unseren Anhängern zu machen.',
      ],
      question: 'Wie hat sich Ihr ASEA Anhänger bisher im Alltag bewährt?',
      cta: 'Bewertung abgeben',
      note: 'Ihre Bewertung ist freiwillig. Uns ist eine ehrliche Rückmeldung wichtiger als eine bestimmte Bewertung.',
    },
    twelve_month: {
      subject: 'Ein Jahr mit Ihrem ASEA Anhänger',
      preheader: 'Wie hat sich Ihr ASEA Anhänger im ersten Jahr bewährt?',
      paragraphs: [
        'Ihr {{product}} begleitet Sie nun seit ungefähr einem Jahr.',
        'Nach dieser Zeit interessiert uns besonders, wie sich Ihr Anhänger im täglichen Einsatz bewährt hat und welche Erfahrungen Sie damit gemacht haben.',
        'Wenn Sie ein paar Minuten Zeit haben, freuen wir uns sehr über Ihre persönliche Langzeiterfahrung.',
      ],
      question: 'Wie hat sich Ihr ASEA Anhänger im ersten Jahr bewährt?',
      cta: 'Erfahrung nach einem Jahr teilen',
      note: 'Dies ist unsere letzte automatische Anfrage zu Ihrer Erfahrung mit dem Anhänger.',
    },
  },
  en: {
    two_month: {
      subject: 'How satisfied are you with your ASEA trailer so far?',
      preheader: 'We would like to hear how satisfied you are with your ASEA trailer so far.',
      paragraphs: [
        'Your {{product}} has now been with you for around two months since purchase.',
        'We would like to know how satisfied you are so far with your trailer and your experience with ASEA. Your feedback helps us continue improving our products and service.',
      ],
      question: 'How satisfied are you with your ASEA trailer so far?',
      cta: 'Share your experience',
      note: 'Your feedback is of course voluntary and only takes a few minutes.',
    },
    six_month: {
      subject: 'Your experience with your ASEA trailer',
      preheader: 'Share your experience so far with your ASEA trailer.',
      paragraphs: [
        'Your {{product}} has now been in use for around six months.',
        'We hope your trailer has proven itself well in everyday use. If you have already gathered some experience, we would very much appreciate a short and honest review.',
        'Your feedback helps not only us, but also other interested customers who want a realistic impression of ASEA and our trailers.',
      ],
      question: 'How has your ASEA trailer performed in everyday use so far?',
      cta: 'Leave a review',
      note: 'Your review is voluntary. Honest feedback matters more to us than any particular rating.',
    },
    twelve_month: {
      subject: 'One year with your ASEA trailer',
      preheader: 'How has your ASEA trailer performed during its first year?',
      paragraphs: [
        'Your {{product}} has now been with you for about one year.',
        'After this time, we are especially interested in how your trailer has performed in day-to-day use and what your experience has been.',
        'If you have a few minutes, we would be very grateful for your personal long-term feedback.',
      ],
      question: 'How has your ASEA trailer performed during its first year?',
      cta: 'Share your one-year experience',
      note: 'This is our final automatic request about your experience with the trailer.',
    },
  },
  sk: {
    two_month: {
      subject: 'Ako ste zatiaľ spokojní s prívesom ASEA?',
      preheader: 'Radi by sme vedeli, ako ste zatiaľ spokojní so svojím prívesom ASEA.',
      paragraphs: [
        'Váš {{product}} máte od kúpy približne dva mesiace.',
        'Zaujíma nás, ako ste zatiaľ spokojní s prívesom a so skúsenosťou so spoločnosťou ASEA. Vaša spätná väzba nám pomáha priebežne zlepšovať naše produkty aj služby.',
      ],
      question: 'Ako ste zatiaľ spokojní so svojím prívesom ASEA?',
      cta: 'Zdieľať skúsenosť',
      note: 'Spätná väzba je samozrejme dobrovoľná a zaberie len niekoľko minút.',
    },
    six_month: {
      subject: 'Vaša skúsenosť s prívesom ASEA',
      preheader: 'Podeľte sa o svoju doterajšiu skúsenosť s prívesom ASEA.',
      paragraphs: [
        'Váš {{product}} je u vás v prevádzke už približne šesť mesiacov.',
        'Dúfame, že sa váš príves v každodennom používaní dobre osvedčil. Ak ste už nazbierali prvé skúsenosti, veľmi nás poteší krátke a úprimné hodnotenie.',
        'Vaša spätná väzba pomáha nielen nám, ale aj ďalším záujemcom vytvoriť si realistický obraz o spoločnosti ASEA a našich prívesoch.',
      ],
      question: 'Ako sa váš príves ASEA zatiaľ osvedčil v každodennom používaní?',
      cta: 'Napísať hodnotenie',
      note: 'Vaše hodnotenie je dobrovoľné. Úprimná spätná väzba je pre nás dôležitejšia než konkrétne hodnotenie.',
    },
    twelve_month: {
      subject: 'Jeden rok s vaším prívesom ASEA',
      preheader: 'Ako sa váš príves ASEA osvedčil počas prvého roka?',
      paragraphs: [
        'Váš {{product}} vás sprevádza už približne jeden rok.',
        'Po tomto období nás obzvlášť zaujíma, ako sa príves osvedčil v každodennom používaní a aké skúsenosti ste s ním získali.',
        'Ak máte niekoľko minút času, veľmi nás poteší vaša osobná dlhodobá skúsenosť.',
      ],
      question: 'Ako sa váš príves ASEA osvedčil počas prvého roka?',
      cta: 'Zdieľať skúsenosť po jednom roku',
      note: 'Toto je naša posledná automatická žiadosť o vašu skúsenosť s prívesom.',
    },
  },
};

const LANGUAGE_COPY: Record<PreferredLanguage, LanguageCopy> = {
  de: {
    htmlLang: 'de',
    greetingWithName: (name) => `Guten Tag ${name},`,
    greetingFallback: 'Guten Tag,',
    productFallback: 'ASEA Anhänger',
    closing: ['Vielen Dank für Ihre Zeit.', 'Freundliche Grüße', 'Ihr Team von Verkaufsanhänger ASEA'],
    footerQuestion: 'Sie möchten keine weiteren Anfragen zu Ihrer Erfahrung erhalten?',
    unsubscribeCta: 'Weitere Bewertungsanfragen deaktivieren',
    reviewTextLabel: 'Bewertungslink',
    unsubscribeTextLabel: 'Abmeldelink',
  },
  en: {
    htmlLang: 'en',
    greetingWithName: (name) => `Hello ${name},`,
    greetingFallback: 'Hello,',
    productFallback: 'ASEA trailer',
    closing: ['Thank you for your time.', 'Kind regards', 'Your Verkaufsanhänger ASEA team'],
    footerQuestion: 'Would you prefer not to receive any further requests about your experience?',
    unsubscribeCta: 'Disable further review requests',
    reviewTextLabel: 'Review link',
    unsubscribeTextLabel: 'Unsubscribe link',
  },
  sk: {
    htmlLang: 'sk',
    greetingWithName: (name) => `Dobrý deň ${name},`,
    greetingFallback: 'Dobrý deň,',
    productFallback: 'príves ASEA',
    closing: ['Ďakujeme za váš čas.', 'S priateľským pozdravom', 'Tím Verkaufsanhänger ASEA'],
    footerQuestion: 'Neželáte si dostávať ďalšie žiadosti o vašu skúsenosť?',
    unsubscribeCta: 'Deaktivovať ďalšie žiadosti o hodnotenie',
    reviewTextLabel: 'Odkaz na hodnotenie',
    unsubscribeTextLabel: 'Odkaz na odhlásenie',
  },
};

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

function getSiteUrl() {
  const configuredUrl = getEnv('SITE_URL') || getEnv('PUBLIC_SITE_URL');
  if (configuredUrl) return configuredUrl.replace(/\/+$/, '');

  const vercelUrl = getEnv('VERCEL_PROJECT_PRODUCTION_URL') || getEnv('VERCEL_URL');
  return vercelUrl ? `https://${vercelUrl.replace(/\/+$/, '')}` : '';
}

function sanitizeErrorCode(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return message
    .toLowerCase()
    .replace(/[^a-z0-9_:-]+/g, '_')
    .slice(0, 80) || 'unknown_error';
}

function generateToken() {
  return randomBytes(32).toString('base64url');
}

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function cleanDynamicText(value: unknown) {
  if (typeof value !== 'string') return '';

  const trimmed = value.trim();
  const lower = trimmed.toLowerCase();
  return lower === 'undefined' || lower === 'null' ? '' : trimmed;
}

function renderTemplate(value: string, variables: Record<string, string>) {
  return Object.entries(variables).reduce(
    (result, [key, replacement]) => result.replaceAll(`{{${key}}}`, replacement),
    value,
  );
}

export function buildFollowupEmail(
  reminder: ClaimedReminder,
  siteUrl: string,
  reviewToken: string,
  unsubscribeToken: string,
) {
  const lang = REMINDER_COPY[reminder.preferred_language] ? reminder.preferred_language : 'de';
  const languageCopy = LANGUAGE_COPY[lang];
  const copy = REMINDER_COPY[lang][reminder.reminder_stage];
  const reviewUrl = `${siteUrl}/bewertung?token=${encodeURIComponent(reviewToken)}`;
  const unsubscribeUrl = `${siteUrl}/bewertung-abmelden?token=${encodeURIComponent(unsubscribeToken)}`;
  const customerName = cleanDynamicText(reminder.customer_name);
  const product = cleanDynamicText(reminder.purchased_item) || languageCopy.productFallback;
  const greeting = customerName ? languageCopy.greetingWithName(customerName) : languageCopy.greetingFallback;
  const paragraphs = copy.paragraphs.map((paragraph) => renderTemplate(paragraph, { product }));
  const escapedReviewUrl = escapeHtml(reviewUrl);
  const escapedUnsubscribeUrl = escapeHtml(unsubscribeUrl);

  const text = [
    greeting,
    '',
    ...paragraphs.flatMap((paragraph) => [paragraph, '']),
    copy.question,
    '',
    `${languageCopy.reviewTextLabel}: ${reviewUrl}`,
    '',
    copy.note,
    '',
    ...languageCopy.closing,
    '',
    'Verkaufsanhänger ASEA',
    'Lahrndorf 34',
    '4240 Waldburg',
    'Österreich',
    '',
    languageCopy.footerQuestion,
    languageCopy.unsubscribeCta,
    `${languageCopy.unsubscribeTextLabel}: ${unsubscribeUrl}`,
  ].join('\n');

  const html = `<!doctype html>
<html lang="${languageCopy.htmlLang}">
  <body style="margin:0;padding:0;background:#f3f1ec;font-family:Arial,Helvetica,sans-serif;color:#3a3a38;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all;">
      ${escapeHtml(copy.preheader)}
    </div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f1ec;margin:0;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%;max-width:620px;background:#ffffff;border:1px solid #e0ddd6;border-collapse:separate;">
            <tr>
              <td align="center" bgcolor="#1c1c1a" style="background:#1c1c1a;padding:28px 24px 24px;">
                <p style="margin:0;color:#ffffff;font-size:20px;line-height:1.3;font-weight:700;letter-spacing:0.02em;">Verkaufsanhänger ASEA</p>
                <table role="presentation" align="center" width="58" cellspacing="0" cellpadding="0" style="margin:13px auto 0;">
                  <tr>
                    <td height="2" bgcolor="#c8a96e" style="height:2px;line-height:2px;font-size:0;background:#c8a96e;">&nbsp;</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:34px 30px 30px;background:#ffffff;">
                <p style="margin:0 0 18px;color:#3a3a38;font-size:16px;line-height:1.65;">${escapeHtml(greeting)}</p>
                ${paragraphs.map((paragraph) => `<p style="margin:0 0 16px;color:#3a3a38;font-size:16px;line-height:1.65;">${escapeHtml(paragraph)}</p>`).join('')}
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:26px 0 28px;border-collapse:collapse;">
                  <tr>
                    <td bgcolor="#f8f7f3" style="background:#f8f7f3;border-left:4px solid #c8a96e;padding:17px 18px;">
                      <p style="margin:0;color:#1c1c1a;font-size:18px;line-height:1.45;font-weight:700;">${escapeHtml(copy.question)}</p>
                    </td>
                  </tr>
                </table>
                <table role="presentation" align="center" cellspacing="0" cellpadding="0" style="margin:0 auto 24px;">
                  <tr>
                    <td align="center" bgcolor="#c8a96e" style="background:#c8a96e;">
                      <a href="${escapedReviewUrl}" style="display:inline-block;padding:14px 24px;color:#1c1c1a;font-size:16px;line-height:1.2;font-weight:700;text-decoration:none;">${escapeHtml(copy.cta)}</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 26px;color:#555550;font-size:14px;line-height:1.6;text-align:center;">${escapeHtml(copy.note)}</p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 24px;border-collapse:collapse;">
                  <tr>
                    <td height="1" bgcolor="#e0ddd6" style="height:1px;line-height:1px;font-size:0;background:#e0ddd6;">&nbsp;</td>
                  </tr>
                </table>
                ${languageCopy.closing.map((line, index) => `<p style="margin:0${index === 0 ? ' 0 14px' : ' 0 4px'};color:#3a3a38;font-size:15px;line-height:1.6;">${escapeHtml(line)}</p>`).join('')}
              </td>
            </tr>
            <tr>
              <td bgcolor="#1c1c1a" style="background:#1c1c1a;padding:24px 30px;color:#ffffff;">
                <p style="margin:0 0 10px;color:#ffffff;font-size:14px;line-height:1.55;font-weight:700;">Verkaufsanhänger ASEA</p>
                <p style="margin:0 0 18px;color:#d7d5cf;font-size:13px;line-height:1.55;">
                  Lahrndorf 34<br>
                  4240 Waldburg<br>
                  Österreich
                </p>
                <p style="margin:0 0 6px;color:#8a8a82;font-size:12px;line-height:1.55;">${escapeHtml(languageCopy.footerQuestion)}</p>
                <p style="margin:0;color:#8a8a82;font-size:12px;line-height:1.55;">
                  <a href="${escapedUnsubscribeUrl}" style="color:#c8a96e;text-decoration:underline;">${escapeHtml(languageCopy.unsubscribeCta)}</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return {
    subject: copy.subject,
    text,
    html,
  };
}

async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  const apiKey = getEnv('RESEND_API_KEY');
  const from = getEnv('FOLLOWUP_FROM_EMAIL');
  const replyTo = getEnv('FOLLOWUP_REPLY_TO_EMAIL') || 'office@verkaufsanhaenger-asea.at';

  if (!apiKey || !from) {
    throw new Error('missing_email_provider_configuration');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: replyTo,
      subject,
      html,
      text,
    }),
  });

  if (!response.ok) {
    throw new Error(`resend_${response.status}`);
  }
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
    console.error('Customer follow-up cron failed: CRON_SECRET is not configured.');
    sendJson(res, 500, { ok: false, error: 'Cron secret is not configured' }, isHeadRequest);
    return;
  }

  if (readHeader(req, 'authorization') !== `Bearer ${cronSecret}`) {
    sendJson(res, 401, { ok: false, error: 'Unauthorized' }, isHeadRequest);
    return;
  }

  const supabaseUrl = getEnv('SUPABASE_URL') || getEnv('VITE_SUPABASE_URL');
  const serviceRoleKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');
  const siteUrl = getSiteUrl();

  if (!supabaseUrl || !serviceRoleKey || !siteUrl) {
    console.error('Customer follow-up cron failed: required server environment variables are missing.');
    sendJson(res, 500, { ok: false, error: 'Server environment is not configured' }, isHeadRequest);
    return;
  }

  if (!getEnv('RESEND_API_KEY') || !getEnv('FOLLOWUP_FROM_EMAIL')) {
    console.error('Customer follow-up cron failed: email provider is not configured.');
    sendJson(res, 500, { ok: false, error: 'Email provider is not configured' }, isHeadRequest);
    return;
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  try {
    const { data, error } = await supabase.rpc('claim_due_customer_reminders', {
      p_limit: 20,
    });

    if (error) {
      console.error('Customer follow-up claim failed:', error.message);
      sendJson(res, 502, { ok: false, error: 'Reminder claim failed' }, isHeadRequest);
      return;
    }

    const reminders = (data ?? []) as ClaimedReminder[];
    let sent = 0;
    let failed = 0;
    let skipped = 0;

    for (const reminder of reminders) {
      const reviewToken = generateToken();
      const unsubscribeToken = generateToken();
      const reviewTokenHash = hashToken(reviewToken);
      const unsubscribeTokenHash = hashToken(unsubscribeToken);

      try {
        const { data: stillAllowed, error: verifyError } = await supabase.rpc('verify_customer_reminder_claim', {
          p_customer_id: reminder.customer_id,
          p_stage: reminder.reminder_stage,
        });

        if (verifyError || !stillAllowed) {
          skipped += 1;
          await supabase.rpc('record_customer_reminder_result', {
            p_customer_id: reminder.customer_id,
            p_stage: reminder.reminder_stage,
            p_status: 'skipped',
            p_error_code: verifyError ? 'verify_failed' : 'stopped_before_send',
          });
          continue;
        }

        const { error: tokenError } = await supabase.rpc('register_customer_unsubscribe_token', {
          p_customer_id: reminder.customer_id,
          p_token_hash: unsubscribeTokenHash,
        });

        if (tokenError) throw new Error('token_registration_failed');

        const { data: reviewTokenRegistered, error: reviewTokenError } = await supabase.rpc('register_customer_review_token', {
          p_customer_id: reminder.customer_id,
          p_token_hash: reviewTokenHash,
          p_reminder_stage: reminder.reminder_stage,
        });

        if (reviewTokenError || !reviewTokenRegistered) throw new Error('review_token_registration_failed');

        const email = buildFollowupEmail(reminder, siteUrl, reviewToken, unsubscribeToken);
        await sendEmail({
          to: reminder.customer_email,
          subject: email.subject,
          html: email.html,
          text: email.text,
        });

        await supabase.rpc('record_customer_reminder_result', {
          p_customer_id: reminder.customer_id,
          p_stage: reminder.reminder_stage,
          p_status: 'sent',
          p_error_code: null,
        });
        sent += 1;
      } catch (error) {
        failed += 1;
        const errorCode = sanitizeErrorCode(error);
        console.error('Customer follow-up send failed:', {
          customer_id: reminder.customer_id,
          reminder_stage: reminder.reminder_stage,
          error_code: errorCode,
        });

        await supabase.rpc('record_customer_reminder_result', {
          p_customer_id: reminder.customer_id,
          p_stage: reminder.reminder_stage,
          p_status: 'failed',
          p_error_code: errorCode,
        });
      }
    }

    sendJson(res, failed > 0 ? 207 : 200, {
      ok: failed === 0,
      claimed: reminders.length,
      sent,
      failed,
      skipped,
    }, isHeadRequest);
  } catch (error) {
    console.error('Customer follow-up cron failed:', sanitizeErrorCode(error));
    sendJson(res, 500, { ok: false, error: 'Unexpected follow-up error' }, isHeadRequest);
  }
}
