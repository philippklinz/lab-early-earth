# LAB 01 — Die frühe Erde: Ausbauplan v0.1

**Status (22. November 2026):** M1 (Zeit-Explorer), M2 (Lerntrainer) und ein schematischer M3-Prototyp (Three.js) sind implementiert. M4–M5 bleiben geplant. Prototypen sind nicht automatisch wissenschaftlich, visuell oder barrierefrei vollständig validiert.

## Ziel

Ein eigenständiges, statisches Geowissenschafts-Lernlabor mit mehreren Unterlaboren. Der Nutzer soll die Erdgeschichte von der Entstehung des Sonnensystems bis zur Gegenwart erkunden, die geologische Zeitskala aktiv lernen und geologische Evidenz von Modellrekonstruktionen unterscheiden können. Kein Login, keine Telemetrie, kein Backend. Veröffentlichung über GitHub Pages. Lokales Modern-Objectivity-Style-Kit beibehalten.

## Unterlabore

| Modul | Pfad (Vorschlag) | Zweck | Kerninteraktion |
| --- | --- | --- | --- |
| 01 Proto-Erde | `01_protoerde.html` | Entstehung des Planeten: Akkretion, Differentiation, Einschläge, Mondentstehung | 3D-Szenen und Ereignis-Schritte |
| 02 Geological Time Explorer | `02_zeitmassstab.html` | Äonen, Ären, Perioden, Epochen und Belege | Zoom-/Pan-Zeitleiste, Hierarchiebaum, Zeitraumvergleich |
| 03 Geological Time Trainer | `03_zeittrainer.html` | Geologische Zeitgliederung festigen | Karteikarten, Reihenfolge, Einordnen, Grenzen schätzen |
| 04 Die junge Erde | `04_junge_erde.html` | Hadaikum/Archaikum: Oberfläche, Atmosphäre, Wasser, Kruste | Schichten/Parameter und zeitlicher Vergleich |
| 05 Wie wissen wir das? | `05_geologische_methoden.html` | Stratigraphie, Radiometrie, Zirkone, geologische und astronomische Belege | Modellierte Messaufgaben und Beweisketten |

Die Modulnummern sind Navigation, keine Reihenfolgepflicht. Lab 01 bleibt technisch unabhängig von anderen Learning Labs.

## Kernarchitektur

1. Ein **versionierter lokaler Datensatz** zur stratigraphischen Hierarchie: stabile IDs, übergeordnete Einheit, Rang, Start/Ende in Ma, Name (de/en), Unsicherheits-/Grenztyp und Quellenversion.
2. Eine **gemeinsame Zeitnavigation** innerhalb LAB 01. Für die gesamte Erdgeschichte 4567–0 Ma; separat frei zoombare Abschnitte wie 538,8–0 Ma. Der Zoom verändert *nur* die Ansicht, nicht die Altersdaten.
3. Geologische **Einheiten** und **Ereignisse** getrennt halten. Beispiel: „Jura“ ist eine Periode, ein Einschlag ein Ereignis mit rekonstruierter Datierung.
4. Jedes Unterlabor läuft als statische HTML-Seite und lädt ausschließlich lokale Projektressourcen, außer ausdrücklich dokumentierten optionalen CDN-Modulen.
5. Wissenschaftlich begründete Modelle klar von Animationen unterscheiden; Three.js ist eine bildliche Rekonstruktion, keine automatisch physikalisch korrekte Simulation.

## Offizielle Referenz

Die **International Commission on Stratigraphy (ICS), International Chronostratigraphic Chart v2026/06** ist die Referenz für die Grenzen.

- https://stratigraphy.org/chart/
- https://stratigraphy.org/supplementary
- Die ICS stellt strukturierte Daten bereit: https://github.com/i-c-stratigraphy/chart/blob/main/chart.ttl
- Die ICS-Chart steht unter **CC BY 4.0**; Attribution der genutzten Chart/Daten ist separat zur GPL-Lizenz dieses Repositories zu dokumentieren.
- **Numerische Zeitgrenzen sind keine naturgesetzlich exakten Zeitpunkte.** Gerade im Phanerozoikum bestimmen GSSPs die Einheiten, nicht bloß die gerundete Ma-Zahl.
- Anzeige in Ma (Millionen Jahre vor heute) bzw. Ga (Milliarden Jahre); Kürzel immer ausschreiben.
- Datenversionshinweis sichtbar und aktualisierbar halten: gedruckte ältere Tabellen können von 2026/06 leicht abweichen.

### Erste didaktische Anker (Ma; 2026/06)

- Äonen: Hadaikum ca. 4567–4031 (Grenze 4031 ±3), Archaikum ca. 4031–2500, Proterozoikum 2500–538,8, Phanerozoikum 538,8–0.
- Phanerozoikum: Paläozoikum, Mesozoikum, Känozoikum.
- Perioden *alt nach jung*:
  - Paläozoikum: Kambrium, Ordovizium, Silur, Devon, Karbon, Perm.
  - Mesozoikum: Trias, Jura, Kreide.
  - Känozoikum: Paläogen, Neogen, Quartär.
- Später: Präkambrische Untergliederungen, Epochen, Stufen, GSSP-Lernmodus, Lücken in der Überlieferung.

## Geologie-Trainer: tägliche Nutzung

Ziel: **fünf Minuten aktive Erinnerung**, passend zum ausgedruckten Chart.

**Übungsformen:**
- Reihenfolge: „Was folgt auf das Ordovizium?“
- Hierarchie: „Zu welcher Ära gehört die Trias?“
- Einordnung: Begriffe auf einer leeren Zeitachse platzieren; verschiedene Zoomstufen.
- Grenzen: „Wann begann das Phanerozoikum?“ – anfangs großzügige Toleranzen, spätere Präzision.
- Lückentabelle: Einheit oder Name wird verborgen; Nutzer ergänzt.
- Karteikarten: erst aktiv beantworten, dann aufdecken und selbst als „gewusst/unsicher“ bewerten.

**Wiederholung:** Im Browser lokal speichern (localStorage), keine Synchronisierung und kein Account. Fehler und unsichere Antworten zuerst wiederholen; ein einfaches und sichtbares Intervallmodell, keine wissenschaftlich nicht belegte Behauptung über einen „optimalen“ Algorithmus. Immer auch einen freien Übungsmodus ohne Fortschrittsbewertung anbieten.

**Lernstufen:**
1. Vier Äonen und ihre Reihenfolge (ungefährer Altersrahmen).
2. Drei Ären innerhalb des Phanerozoikums.
3. Zwölf Perioden in drei Gruppen.
4. Bedeutende Grenzwerte und ihre Unsicherheiten.
5. Detailgrade Epochen/Stufen und präkambrische Unterteilungen.

Keine künstliche Gamification, keine Streak-Strafen, keine Pflicht zur täglichen Teilnahme.

## Three.js: fachliche Anforderungen

Eine interaktive Szene kann besonders gut folgende Phasen darstellen:

1. Solare Urwolke/Scheibe (Szenenmodell zur Einordnung, nicht direkte Erdbeobachtung).
2. Akkretion von Staub über Planetesimale zu Planetenkörpern.
3. Wachstum und starke Aufheizung der Proto-Erde; große Einschläge.
4. Magmaozean und Differentiation (Kern/Mantel); Entgasung.
5. Hypothesen der Mondentstehung (Giant-Impact als führende Modellfamilie, nicht eindeutig beobachtete Einzelrekonstruktion).
6. Abkühlung, frühe Kruste, mögliches Wasser; Alternativszenarien und Unsicherheit.

Steuerung: Pause/Play, Einzelschritt, Zeitsprung, Kameraperspektive, Schichten, Legende, kurze Kontexterklärung. Keine falsche Behauptung realistischer Orbitaldynamik bei rein choreografierten Animationen. Visualisierte Partikelmengen und Zeitskalierung offen als schematisch markieren.

Die Simulation soll dieselben Zeitmarker wie der Timeline Explorer verwenden, ohne die stratigraphischen Daten oder Ranghierarchie zu manipulieren.

## Reihenfolge der Umsetzung

**M1 — Verständnis der Zeit (Prototyp implementiert):** lokale Datenstruktur, interaktive Zeitleiste mit nachvollziehbarem Zoom, Auswahl und einer Übersicht über Äonen, Ären, Perioden. Funktioniert ohne Three.js.

**M2 — Erinnern und Wiederholen (Prototyp implementiert):** täglicher Lerntrainer, Einordnungs-/Reihenfolgeaufgaben, freie Übung und lokaler Fortschritt. Wichtigste Anforderung: nach kurzer Nutzung kann der Lernende die 4 Äonen und 3 Ären selbst reproduzieren.

**M3 — Proto-Erde in 3D (schematischer Viewer implementiert):** Drei.js-Storyboard mit 4–6 klar getrennten Zeit-/Prozessphasen. Physik- und Evidenzhinweise gut sichtbar. Prüfen, ob lokale Three.js-Bündelung sinnvoll ist.

**M4 — Junge Erde und Methoden:** Hadaikum, Archaikum, Gesteins- und Isotopenbelege, alternative Rekonstruktionsmodelle.

**M5 — Detailwissen und Vernetzung:** feinere stratigraphische Ebenen, geologische Ereignisse, Brücke zu LAB 02 Abiogenese. Diese Brücke ist ein optionaler Link, keine Laufzeitabhängigkeit.

## Minimaler Abnahmetest M1/M2

- Primärnavigation führt zu allen tatsächlichen (nicht nur geplanten) Unterlaboren.
- Es gibt eine sichtbare Quelle samt Versionsstand auf der Zeitleiste.
- Jahreszahlen korrekt in Ma/Ga und klar als gerundet/exakt angegeben.
- Die lineare Gesamtansicht verzerrt nicht die Dauer großer Äonen.
- Ein separater Zoom ins Phanerozoikum zeigt die Perioden lesbar.
- Fragen haben genau eine nach dem referenzierten Datensatz korrekte Antwort.
- Tastaturbedienung für Quiz und Zeitleiste mindestens als Button-/Listen-Alternative.
- Ohne JavaScript ist der didaktische Überblick und die Quellenangabe weiterhin lesbar.
- Keine fälschlich als implementiert gekennzeichneten Konzeptkapitel.
- Neue Seiten unabhängig über GitHub Pages aufrufbar; keine Verletzung existierender Links.

## Implementierungsstand V0.1

- `time-data.js`: gemeinsame ICS-2026/06-Basis für Äonen, Ären und Perioden.
- `02_zeitmassstab.html` / `timeline.js`: 4.567–0 Ma proportional, Zoom/Schwenken, Maskieren, Hierarchie und Detailinformationen.
- `03_zeittrainer.html` / `trainer.js`: tägliche Wiederholungen, freie Runden, verschiedene Aufgaben, Lückenstreifen, lokales Zurücksetzen.
- `01_protoerde.html` / `proto-earth.js`: sieben schematische Three.js-Szenen, nicht physikalisch berechnet; verständlicher Fallback ohne WebGL.
- `THIRD_PARTY_NOTICES.md`: wissenschaftliche Quellen, Namensnennung und separate Lizenzen.
- M4 und M5: ohne Implementierung, weiterhin Zukunftsmodule.

## Ergänzung: geologische Zeitporträts und private Notizen

Der Zeit-Explorer enthält jetzt **36 einheitenspezifische Porträts** für alle Äonen, Ären und Perioden des aktuellen `time-data.js`. Jeder Eintrag bietet eine kontextualisierende Erklärung, drei Lernfakten, die tatsächliche Art der Grenzdefinition (so weit quellenbasiert erklärbar), eine wissenschaftliche Einschränkung, einen Merksatz und eine symbolische SVG-Szene. Ein grafischer Mini-Zeitrahmen zeigt die Dauer innerhalb der übergeordneten Einheit. In der originalen Explorer-Ansicht bleibt die globale Zeitleiste maßstabsgetreu. Inhalte und Quellen liegen getrennt in `period-portraits-data.js`; die Darstellung wird durch `period-portraits.js` und `period-portraits.css` übernommen.

Die **persönlichen Notizen** pro Abschnitt liegen ausschließlich im Browser (`localStorage`), lassen sich als JSON sichern und importieren und sind vom Trainerfortschritt getrennt. Direkte Links auf Abschnitte funktionieren mit `#unit=<id>`; Trainer-Feedback verlinkt die jeweiligen Porträts. Illustrationen sind symbolische Merkbilder, keine exakten zeitgenössischen geologischen Weltkarten.
