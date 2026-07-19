# ASEA Verkaufsanhänger Website

Dieses Projekt ist die React/Vite-Version des Figma-Make-Exports für die ASEA Verkaufsanhänger Website. Die Seiten, Animationen, UI-Komponenten, Admin-Ansichten, Übersetzungen und der interaktive 3D-Konfigurator wurden im Projekt übernommen.

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
  scripts/                  Build-Hilfen für die lokale Startdatei
  vercel.json               Vercel-Konfiguration
  src/
    main.tsx                React-Einstieg
    assets/                 Figma-Assets, die über den Asset-Resolver kommen
    imports/                Bilder und importierte Figma-Dateien
    styles/                 Globale Styles, Tailwind und Theme-Dateien
    app/
      App.tsx               Hauptnavigation und Seitenwechsel
      components/
        pages/              Website-Seiten
        configurator/       3D-Konfigurator mit Three.js
        admin/              Admin-Bereiche für Modelle, Ausstattung, Referenzen
        ui/                 Wiederverwendbare UI-Komponenten
        figma/              Figma-Hilfskomponenten
      context/              Admin-Daten und Sprache
      translations/         Deutsche und englische Texte
      imports/              Zusätzliche Figma-Make-Importe
  dist/                     Vercel-Build und zusätzliche lokale Startkopie
```

## Hinweis

Die Website nutzt lokale React-Komponenten und lokale Build-Assets. Einige Bilder auf den Inhaltsseiten sind weiterhin externe ASEA-Webbilder, so wie sie im Figma-Make-Export hinterlegt waren.
