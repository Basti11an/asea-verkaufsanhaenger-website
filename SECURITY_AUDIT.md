# ASEA Security Audit und Hardening

Stand: 26.08.2026

## A. Vorherige Schwachstellen

- `src/app/App.tsx`: Der Adminbereich wurde ueber einen einfachen React-State `isAdminAuthenticated` freigegeben. Risiko: Ein beliebiger Supabase-Login konnte die Admin-UI sehen. Schweregrad: High.
- `src/app/components/AdminLogin.tsx`: Es gab eine oeffentliche Admin-Registrierung mit Frontend-Registrierungscode und eine lokale Demo-Passwort-Logik. Risiko: Frontend-Barriere statt belastbarer Zugriffskontrolle. Schweregrad: High.
- `src/app/context/AdminDataContext.tsx`: Private Referenzdaten wurden ueber einen clientseitigen E-Mail-Vergleich angefordert. Risiko: Adminrolle nicht serverseitig genug begruendet. Schweregrad: Medium.
- `supabase/references.sql`: `is_admin()` beruhte auf einem festen E-Mail-Vergleich im JWT. Risiko: unflexible Rollenlogik, keine saubere serverseitige Rollentabelle. Schweregrad: Medium.
- `vercel.json`: Es fehlten zentrale produktive Security Header. Risiko: erhoehte Angriffsoberflaeche fuer Clickjacking, MIME-Sniffing und fehlerhafte Einbettung. Schweregrad: Medium.

## B. Durchgefuehrte Aenderungen

- Neue Datei `src/app/lib/adminAuth.ts`: zentrale Admin-Pruefung ueber Supabase RPC `is_admin()`.
- `src/app/App.tsx`: `/admin` zeigt Admininhalte erst nach serverseitig bestaetigter Adminrolle. Beim Pruefen wird nur ein neutraler Ladezustand angezeigt.
- `src/app/components/AdminLogin.tsx`: oeffentliche Registrierung und Demo-Passwort entfernt. Login nutzt nur noch Supabase Auth mit neutraler Fehlermeldung.
- `src/app/context/AdminDataContext.tsx`: private Referenzdaten werden nur nach erfolgreicher Admin-RPC-Pruefung geladen.
- `src/app/lib/referencesRepository.ts`: oeffentliche Referenzen werden bevorzugt ueber `customer_references_public` gelesen; falls die View noch fehlt, gibt es einen temporaeren Rueckfall auf die alte gefilterte Tabellenabfrage.
- `src/app/lib/supabase.ts`: Supabase Auth Optionen explizit gesetzt.
- `supabase/references.sql`: neue `admin_users` Rollentabelle, RLS, `is_admin()` als serverseitige Rollenpruefung, Default Deny fuer Admin-Daten.
- `supabase/customer_followups.sql`: RLS-geschuetzte Kundenverwaltung, Audit-Events, Reminder-RPCs, gehashte Abmelde-/Bewertungs-Tokens und sichere Bewertungszuordnung ergaenzt.
- `api/customer-followups.ts`: serverseitige Reminder-Pruefung ueber Vercel Cron, Service-Role-Key nur serverseitig, keine Kundenlisten in Logs.
- `src/app/components/admin/KundenTab.tsx`: Admin-Kundenbereich mit Suche, Filtern, Statusanzeige, Bearbeitung und Loeschdialog.
- `src/app/components/pages/ReviewOptOutPage.tsx`: neutrale oeffentliche Abmeldeseite ohne Ausgabe von Kundendaten.
- `src/app/lib/customerFollowup.ts`: zentrale Stop- und Reminder-Logik fuer Adminanzeige und Tests.
- `vercel.json`: CSP, HSTS, Referrer-Policy, Permissions-Policy und `X-Content-Type-Options` ergaenzt.
- `.env.example`, `README.md`, `src/vite-env.d.ts` und Admin-Texte: veraltete Admin-E-Mail-/Demo-Hinweise entfernt.

## C. Auth-Architektur danach

`Login -> Supabase Auth -> Session -> Supabase RPC is_admin() -> Protected Admin Route -> RLS/Backend Authorization`

- Supabase Auth beweist, wer angemeldet ist.
- `admin_users` entscheidet serverseitig, ob diese Person Admin ist.
- React zeigt Admininhalte nur nach erfolgreicher Rollenpruefung.
- Supabase RLS erzwingt Lesen/Aendern/Loeschen administrativer Daten in der Datenbank.
- Bei fehlender oder fehlerhafter Pruefung gilt Fail Closed: kein Adminzugriff.

## D. RLS-Policies

- `admin_users`: keine Rechte fuer `anon`; authentifizierte User duerfen nur lesen, wenn `public.is_admin()` wahr ist.
- `customer_references`: oeffentlich nur freigegebene sichtbare Referenzen; neue Einreichungen nur als `pending` und `sichtbar = false`; Admins duerfen lesen, erstellen, bearbeiten und loeschen.
- `customers`: kein Zugriff fuer `anon`; authentifizierte User koennen nur mit `public.is_admin()` lesen, erstellen, bearbeiten und loeschen.
- `customer_followup_events`: kein Zugriff fuer `anon`; Admins koennen Audit-Events lesen. Events werden automatisch durch Trigger und serverseitige Funktionen geschrieben.
- `customer_followup_unsubscribe_tokens`: kein direkter Zugriff fuer `anon` oder normale `authenticated` User. Die oeffentliche Abmeldung laeuft nur ueber `unsubscribe_customer_followup(token)`.
- `customer_review_tokens`: kein direkter Zugriff fuer `anon` oder normale `authenticated` User. Bewertungen laufen nur ueber `submit_customer_review_with_token(...)`, dabei wird der Token gehasht und intern dem Kunden zugeordnet.
- Reminder-RPCs fuer Claim, Verify, Token-Registrierung und Ergebnisstatus sind nur fuer `service_role` freigegeben.

## E. Session-Sicherheit

- Session Handling bleibt beim Supabase SDK.
- Tokens werden nicht selbst verwaltet und nicht als eigene Admin-Autoritaet in `localStorage` gespeichert.
- Beim Laden und bei Auth-State-Aenderungen wird die Adminrolle neu geprueft.
- Logout ruft `supabase.auth.signOut()` auf, setzt lokale Admin-Zustaende zurueck und navigiert zur Startseite.
- Wenn eine Session vorhanden ist, aber keine Adminrolle bestaetigt wird, wird kein Admininhalt gerendert.

## F. Durchgefuehrte Tests

- `npm run build`: erfolgreich.
- `npm test`: 11 Tests erfolgreich, darunter Kalendermonate, Stop-Regeln, E-Mail-Normalisierung und statische SQL-Sicherheitschecks.
- Expliziter TypeScript-Check fuer App/API mit `npx tsc --noEmit ...`: erfolgreich.
- `npm audit`: 0 bekannte Schwachstellen.
- Suche im gebauten Frontend: keine `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `FOLLOWUP_FROM_EMAIL`, `FOLLOWUP_REPLY_TO_EMAIL` oder `service_role` Treffer.
- Suche nach alter eigener Supabase-Analytics-Implementierung: keine Treffer.
- Routencheck lokal: `/`, `/admin`, `/modelle`, `/kontakt`, `/datenschutz` liefern 200.
- Browsercheck `/admin` ohne Login: zeigt Login, kein Dashboard.
- Manipulationstest `localStorage.isAdmin = true`: zeigt weiterhin Login, kein Dashboard, keine Referenzverwaltung.
- Direkte Supabase-RLS-Live-Tests koennen erst nach Ausfuehren der SQL-Dateien im Supabase SQL Editor erfolgen.
- `TrailerConfigurator.tsx` und `TrailerScene.tsx` wurden nicht veraendert.

## G. Offene Betreiberaufgaben

1. In Supabase `supabase/references.sql` ausfuehren.
2. In Supabase `supabase/contact_requests.sql` ausfuehren.
3. In Supabase `supabase/customer_followups.sql` ausfuehren.
4. Den echten Admin-User in `public.admin_users` freigeben.
5. Server-only Vercel Secrets fuer Reminder setzen, insbesondere `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `FOLLOWUP_FROM_EMAIL`, `FOLLOWUP_REPLY_TO_EMAIL`, `SITE_URL`.
6. Resend oder den produktiv verwendeten E-Mail-Anbieter organisatorisch einrichten und Domain/Absender pruefen.
7. In Supabase Auth die oeffentliche Registrierung fuer Admins nicht als Website-Flow nutzen; Admin-User manuell im Dashboard anlegen.
8. Supabase Auth Rate Limits und E-Mail-Bestaetigung aktiv halten.
9. Fuer Admins MFA/TOTP in Supabase pruefen und aktivieren, wenn der Account-Flow dafuer eingerichtet ist.
10. Falls frueher private Keys oder Passwoerter in Chat, Screenshots oder Git gelandet sind: diese Keys/Passwoerter rotieren.
11. Nach dem naechsten Vercel Deployment die Security Header, den Adminlogin, RLS und eine Test-Abmeldung produktiv pruefen.

## Verwendete Sicherheitsgrundlagen

- OWASP Authentication Cheat Sheet
- OWASP Session Management Cheat Sheet
- OWASP Authorization Cheat Sheet
- OWASP Cross Site Scripting Prevention Cheat Sheet
- OWASP Content Security Policy Cheat Sheet
- OWASP Top 10 Broken Access Control und Authentication Failures
