# ASEA Verkaufsanhänger Website

Dieses Projekt ist die React/Vite-Version des Figma-Make-Exports für die ASEA Verkaufsanhänger Website. Die Seiten, Animationen, UI-Komponenten, Admin-Ansichten, Übersetzungen und der interaktive 3D-Konfigurator wurden übernommen und für GitHub/Vercel vorbereitet.

## Schnellstart ohne Server

Die lokal gebaute Website kann direkt im Browser geöffnet werden:

1. `START_WEBSITE.html` doppelklicken.
2. Die Website startet direkt im Browser.
3. Es wird kein laufender Entwicklungsserver benötigt.

Nach Codeänderungen muss die statische Version neu gebaut werden:

```bash
npm install
npm run build
```

Danach funktioniert `START_WEBSITE.html` wieder mit dem neuesten Stand.

## Entwicklung

```bash
npm install
npm run dev
```

Der Dev-Server ist nur für die Entwicklung gedacht. Für die lokale Datei-Version wird `npm run build` verwendet.

## Supabase Einrichten

Die Kundenreferenzen und Kontaktanfragen können in Supabase gespeichert werden. Dafür ist vorbereitet:

- `src/app/lib/supabase.ts`: Verbindung zu Supabase
- `src/app/lib/referencesRepository.ts`: Laden, Anlegen, Bearbeiten und Löschen von Referenzen
- `src/app/lib/contactRequestsRepository.ts`: Speichern, Laden und Statuspflege von Kontaktanfragen
- `supabase/references.sql`: Datenbanktabelle `customer_references`, Eingänge/Freigabe und Sicherheitsregeln
- `supabase/contact_requests.sql`: Datenbanktabelle `contact_requests`, Kontakt-Eingänge und Sicherheitsregeln
- `supabase/analytics.sql`: Tabellen und Sicherheitsregeln für das Admin-Dashboard
- `.env.example`: Vorlage für deine lokalen Supabase-Zugangsdaten

### 1. Supabase Projekt erstellen

1. Gehe zu Supabase und erstelle ein neues Projekt.
2. Öffne im Projekt `Project Settings` > `API`.
3. Kopiere:
   - Project URL
   - anon public key

### 2. Admin User erstellen

1. Öffne in Supabase `Authentication` > `Users`.
2. Lege einen User mit deiner Admin-E-Mail und einem sicheren Passwort an.
3. Aktiviere die E-Mail-Bestätigung oder bestätige den User manuell im Supabase-Dashboard.
4. Der User ist dadurch noch nicht automatisch Admin. Die Freigabe erfolgt erst in Schritt 3 über die Tabelle `admin_users`.

### 3. Tabelle und Berechtigungen anlegen

1. Öffne `supabase/references.sql`.
2. Kopiere die komplette SQL-Datei.
3. Öffne in Supabase den `SQL Editor`.
4. Führe die SQL aus.
5. Öffne danach `supabase/contact_requests.sql`, kopiere die komplette Datei und führe sie ebenfalls im SQL Editor aus.
6. Öffne danach `supabase/analytics.sql`, kopiere die komplette Datei und führe sie ebenfalls im SQL Editor aus.
7. Gib den Admin-User einmalig frei. Dafür im SQL Editor ausführen und die E-Mail ersetzen:

```sql
insert into public.admin_users (user_id, email, role, active)
select id, email, 'owner', true
from auth.users
where email = 'deine-admin-mail@example.com'
on conflict (user_id) do update set
  email = excluded.email,
  role = excluded.role,
  active = true,
  updated_at = now();
```

Danach gilt:

- Besucher dürfen nur sichtbare Referenzen lesen.
- Öffentliche Referenzen werden nur mit öffentlichen Spalten ohne Rückfrage-E-Mail und Telefonnummer gelesen.
- Besucher dürfen neue Referenzen einreichen, diese bleiben zuerst im Status `pending`.
- Besucher dürfen Kontaktanfragen erstellen, aber keine fremden Kontaktanfragen lesen.
- Der Admin sieht neue Kontaktanfragen und neue Referenzen im Tab `Eingänge`.
- Kontaktanfragen können dort als gelesen, für später aufgehoben oder als per E-Mail beantwortet markiert werden.
- Erst freigegebene Referenzen mit Status `approved` und `sichtbar = true` erscheinen öffentlich.
- Nur User, die in `admin_users` aktiv freigegeben sind, können den Adminbereich und das Dashboard nutzen.

## EmailJS Kontaktformular

Das Kontaktformular speichert die Anfrage zuerst in Supabase und sendet danach zwei E-Mails über EmailJS:

- interne Anfrage an ASEA
- Bestätigung an die Kunden-E-Mail

Benötigte Vite-Variablen:

```env
VITE_EMAILJS_SERVICE_ID=service_7jstv7i
VITE_EMAILJS_PUBLIC_KEY=JmLu7aHyctT7FdfSI
VITE_EMAILJS_INTERNAL_TEMPLATE_ID=template_7awv1vu
VITE_EMAILJS_CUSTOMER_TEMPLATE_ID=template_komdk1b
VITE_EMAILJS_INTERNAL_RECIPIENT=hochreither_b1@bbs-rohrbach.at
```

Die verwendeten EmailJS-Template-Variablen sind:

- `customer_name`
- `customer_email`
- `customer_phone`
- `subject`
- `message`

### 4. Lokale `.env` Datei anlegen

Lege im Projektordner eine Datei `.env` an:

```env
VITE_SUPABASE_URL=https://dein-projekt.supabase.co
VITE_SUPABASE_ANON_KEY=dein-anon-public-key
VITE_EMAILJS_SERVICE_ID=service_7jstv7i
VITE_EMAILJS_PUBLIC_KEY=JmLu7aHyctT7FdfSI
VITE_EMAILJS_INTERNAL_TEMPLATE_ID=template_7awv1vu
VITE_EMAILJS_CUSTOMER_TEMPLATE_ID=template_komdk1b
VITE_EMAILJS_INTERNAL_RECIPIENT=hochreither_b1@bbs-rohrbach.at
```

Dann lokal starten:

```bash
npm install
npm run dev
```

### 5. Vercel Environment Variables

In Vercel unter `Project Settings` > `Environment Variables` dieselben Werte eintragen:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`
- `VITE_EMAILJS_INTERNAL_TEMPLATE_ID`
- `VITE_EMAILJS_CUSTOMER_TEMPLATE_ID`
- `VITE_EMAILJS_INTERNAL_RECIPIENT`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `CRON_SECRET`

Danach neu deployen.

## Veröffentlichung

Für GitHub und Vercel ist das Projekt vorbereitet:

```bash
npm install
npm run build
```

In Vercel:

- Framework: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Node.js: Version `20` oder neuer

Die Datei `vercel.json` enthält diese Werte bereits.

## Ordnerstruktur

```text
asea-verkaufsanhaenger-website/
  START_WEBSITE.html        Direkt startbare lokale Website ohne Server
  index.html                Vite/React-Einstieg
  package.json              Abhängigkeiten und Build-Skripte
  package-lock.json         Exakte npm-Versionen für Vercel
  scripts/                  Build-Hilfen für die lokale Startdatei
  supabase/                 SQL-Dateien für Datenbank und Policies
  vercel.json               Vercel-Konfiguration
  src/
    main.tsx                React-Einstieg
    imports/                Lokale Bilder, aktuell das ASEA-Logo
    styles/                 Globale Styles, Tailwind und Theme-Dateien
    app/
      App.tsx               Hauptnavigation, Seitenwechsel und Admin-Session
      lib/                  Supabase-Verbindung und Datenbankzugriffe
      components/
        pages/              Website-Seiten
        configurator/       3D-Konfigurator mit Three.js
        admin/              Admin-Bereiche für Modelle und Referenzen
        ui/                 Wiederverwendbare UI-Basiskomponenten
        figma/              Bild-Hilfskomponente aus dem Export
      context/              Admin-Daten und Sprache
      translations/         Deutsche und englische Texte
  dist/                     Wird beim Build automatisch neu erzeugt
```

## Nicht für GitHub hochladen

Diese Ordner werden durch `.gitignore` ausgeschlossen und sollen nicht manuell mit ins Repository:

- `node_modules/`
- `dist/`
- `.vite/`
- `.vercel/`
- `.env`

## Hinweis

Die Website nutzt lokale React-Komponenten und lokale Build-Assets. Einige Bilder auf den Inhaltsseiten sind weiterhin externe ASEA-Webbilder, so wie sie im Figma-Make-Export hinterlegt waren.
