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

Die Kundenreferenzen können in Supabase gespeichert werden. Dafür ist vorbereitet:

- `src/app/lib/supabase.ts`: Verbindung zu Supabase
- `src/app/lib/referencesRepository.ts`: Laden, Anlegen, Bearbeiten und Löschen von Referenzen
- `supabase/references.sql`: Datenbanktabelle `customer_references`, Startdaten, Eingänge/Freigabe und Sicherheitsregeln
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
3. Merke dir exakt diese E-Mail-Adresse.

### 3. Tabelle und Berechtigungen anlegen

1. Öffne `supabase/references.sql`.
2. Ersetze `admin@example.com` durch deine echte Admin-E-Mail.
3. Kopiere die komplette SQL-Datei.
4. Öffne in Supabase den `SQL Editor`.
5. Führe die SQL aus.

Danach gilt:

- Besucher dürfen nur sichtbare Referenzen lesen.
- Besucher dürfen neue Referenzen einreichen, diese bleiben zuerst im Status `pending`.
- Der Admin sieht neue Einreichungen im Tab `Eingänge` und kann sie freigeben oder löschen.
- Erst freigegebene Referenzen mit Status `approved` und `sichtbar = true` erscheinen öffentlich.

### 4. Lokale `.env` Datei anlegen

Lege im Projektordner eine Datei `.env` an:

```env
VITE_SUPABASE_URL=https://dein-projekt.supabase.co
VITE_SUPABASE_ANON_KEY=dein-anon-public-key
VITE_SUPABASE_ADMIN_EMAIL=deine-admin-mail@example.com
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
- `VITE_SUPABASE_ADMIN_EMAIL`

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
