# Die frühe Erde — Learning Lab 01

> Wie wurde aus einem jungen Planeten ein möglicher Lebensraum?

**Status: Konzept / Grundgerüst; Ausbauplan für interaktive Unterlabore festgelegt.** Interaktive Experimente sind hier noch nicht implementiert. Dieses Repository ist eine eigenständige, öffentlich teilbare Lernumgebung und wird unabhängig von den anderen Learning Labs entwickelt.

## Warum dieses Labor?

Entstehung der Erde, frühe Kruste, Ozeane, Atmosphäre und geologische Zeit.

### Leitfragen

- Wie entstand die Erde aus dem frühen Sonnensystem?
- Welche Belege kennen wir für die frühe Erdgeschichte?
- Wie entwickelten sich Kruste, Ozeane und Atmosphäre?
- Welche Umweltbedingungen könnten präbiotische Chemie ermöglicht haben?

### Geplante Lernstationen

- Zeitachse zur Entstehung und Entwicklung der jungen Erde
- Interaktive Schichten von Erdinnerem, Kruste, Ozean und Atmosphäre
- Vergleich verschiedener wissenschaftlicher Rekonstruktionen

## Wissenschaftliche Sorgfalt

Frühe Umweltbedingungen und Datierungen sind aus indirekten Belegen rekonstruiert. Keine lückenlose oder scheinbar exakt beobachtete Erdgeschichte behaupten.

Unser didaktisches Ziel: **beobachten → vermuten → experimentieren → erklären**. Wir trennen Modelle und Vereinfachungen von Messdaten, Belegen und offenen Hypothesen. Ein Einstieg ohne Vorwissen ist ausdrücklich vorgesehen.

## Nutzung und Technik

Die [Startseite](index.html) ist eine eigenständige HTML-Datei und kann direkt im Browser geöffnet oder über GitHub Pages veröffentlicht werden.

- Statisches HTML, CSS und JavaScript; bei Bedarf SVG, Canvas oder Three.js.
- Keine zentrale Plattform, Datenbank, Registrierung oder Build-Pflicht.
- Alle künftigen Lernstationen sind innerhalb **dieses Repositories** lauffähig.
- Verweise auf andere Labore sind optional, nicht für die Funktion notwendig.
- Gestalterische Richtung: **Modern Objectivity** (Arbeitsfassung), Graphit, warmes Off-White, Signal-Türkis `#009E98`.

## Entwicklung

Siehe [AGENTS.md](AGENTS.md) für Aufgaben, Designgrundsätze, Prüfpunkte und wissenschaftliche Leitplanken.

## Lizenz

[GNU General Public License v2.0](LICENSE) (GPL-2.0-only). Abweichende Lizenzen hinzugefügter Bibliotheken oder fremder Inhalte sind getrennt zu beachten.

## Modern Objectivity style kit

Die Gestaltung nutzt eine **lokale, unveränderte Kopie** des [Modern Objectivity Style Kits v0.1 (Draft)](https://philippklinz.github.io/modern-objectivity-style/) aus [`styles/modern-objectivity.css`](https://github.com/philippklinz/modern-objectivity-style/blob/main/styles/modern-objectivity.css), Quellstand `c6af71a8688b9001313d19a642e8f308fa463280` (GPL-2.0-only). Die eigenständige HTML-Seite definiert ihre spezifische Bühne über die semantischen `--mo-*`-Tokens. Keine externe Runtime oder CDN erforderlich.

## Ausbauplan LAB 01

Der [detaillierte Ausbauplan](docs/LAB-01-ROADMAP.md) beschreibt fünf eigenständige Unterlabore: Entstehung der Proto-Erde (Three.js), Geological Time Explorer, Geological Time Trainer, junge Erde und geologische Methoden. Referenz für die Zeitskala ist die ICS-Chart **2026/06**. Die Übungen sollen tägliches Lernen aus einer gedruckten Zeitskala unterstützen; bislang sind sie geplant, nicht implementiert.
