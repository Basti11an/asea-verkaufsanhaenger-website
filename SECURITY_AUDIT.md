# ASEA Security Audit und Hardening

Stand: 24.08.2026

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

## E. Session-Sicherheit

- Session Handling bleibt beim Supabase SDK.
- Tokens werden nicht selbst verwaltet und nicht als eigene Admin-Autoritaet in `localStorage` gespeichert.
- Beim Laden und bei Auth-State-Aenderungen wird die Adminrolle neu geprueft.
- Logout ruft `supabase.auth.signOut()` auf, setzt lokale Admin-Zustaende zurueck und navigiert zur Startseite.
- Wenn eine Session vorhanden ist, aber keine Adminrolle bestaetigt wird, wird kein Admininhalt gerendert.

## F. Durchgefuehrte Tests

- `npm run build`: erfolgreich.
- `npm audit`: 0 bekannte Schwachstellen.
- Routencheck lokal: `/`, `/admin`, `/modelle`, `/kontakt`, `/datenschutz` liefern 200.
- Browsercheck `/admin` ohne Login: zeigt Login, kein Dashboard.
- Manipulationstest `localStorage.isAdmin = true`: zeigt weiterhin Login, kein Dashboard, keine Referenzverwaltung.
- Direkter Supabase-Anon-Check: `admin_users` und `customer_references_public` sind in der echten Datenbank noch nicht voll eingespielt oder nicht im Schema-Cache sichtbar. Deshalb muessen die SQL-Dateien noch im Supabase SQL Editor ausgefuehrt werden.
- `TrailerConfigurator.tsx` und `TrailerScene.tsx` wurden nicht veraendert.

## G. Offene Betreiberaufgaben

1. In Supabase `supabase/references.sql` ausfuehren.
2. Den echten Admin-User in `public.admin_users` freigeben.
3. In Supabase Auth die oeffentliche Registrierung fuer Admins nicht als Website-Flow nutzen; Admin-User manuell im Dashboard anlegen.
4. Supabase Auth Rate Limits und E-Mail-Bestaetigung aktiv halten.
5. Fuer Admins MFA/TOTP in Supabase pruefen und aktivieren, wenn der Account-Flow dafuer eingerichtet ist.
6. Falls frueher private Keys oder Passwoerter in Chat, Screenshots oder Git gelandet sind: diese Keys/Passwoerter rotieren.
7. Nach dem naechsten Vercel Deployment die Security Header und den Adminlogin produktiv pruefen.

## Verwendete Sicherheitsgrundlagen

- OWASP Authentication Cheat Sheet
- OWASP Session Management Cheat Sheet
- OWASP Authorization Cheat Sheet
- OWASP Cross Site Scripting Prevention Cheat Sheet
- OWASP Content Security Policy Cheat Sheet
- OWASP Top 10 Broken Access Control und Authentication Failures
