# ASEA 3D-Modelle

Dieser Ordner enthaelt ausschliesslich bearbeitbare Quelldateien. Fertige
Web-Exporte gehoeren unter `public/configurator-models/` in die gleichnamige
Kategorie.

## Regeln

- Blender-Quellen: `.blend`
- Web-Exporte: `.glb`
- Keine Blender-Backups (`.blend1`, `.blend2`, `.blend@`)
- Dateinamen nur mit einfachen ASCII-Zeichen
- Die aktuellen Dateien wurden mit Blender 5.1.30 gespeichert. Zum Bearbeiten
  Blender 5.1.30 oder neuer verwenden.
- Die Modelle verwenden Z als Hochachse und stehen mit ihrer Unterkante auf Z=0.
- Die vorhandene Skalierung entspricht 10 Blender-Einheiten pro Meter.

## Bekannte Punkte

- `Arbeitsplatten.blend` enthaelt derzeit Objekte, aber keine Mesh-Vertices und
  muss vor einem GLB-Export mit echter Geometrie versehen werden.
- Ein neuer Anhaenger wurde noch nicht geliefert. `trailer/` bleibt deshalb leer.

## GLB-Export

Der wiederverwendbare Exporter liegt unter `scripts/export_blend_to_glb.py`.
Optional koennen nach dem Ausgabepfad Objektpraefixe angegeben werden, damit
aus Blender-Dateien mit mehreren Varianten nur das benoetigte Modell exportiert
wird.

```text
blender -b <quelle.blend> --python scripts/export_blend_to_glb.py -- <ziel.glb> [Objektpraefix]
```
