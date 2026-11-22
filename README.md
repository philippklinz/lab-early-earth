# LAB 01 — Die frühe Erde

Ein eigenständiges, interaktives Lernlabor zur Entstehung der Erde und zur geologischen Zeitskala. **Status: drei interaktive Prototypen umgesetzt; weitere Unterlabore geplant.**

**Online:** https://philippklinz.github.io/lab-early-earth/

## Jetzt ausprobieren

| Unterlabor | Seite | Was funktioniert? |
|---|---|---|
| 01 — Proto-Erde | [01_protoerde.html](01_protoerde.html) | Sieben steuerbare **schematische** 3D-Szenen über Planetenentstehung, Akkretion, Magmaozeane, Differentiation und Mondentstehung. Fachliche Beschreibungen funktionieren auch ohne 3D. |
| 02 — Geological Time Explorer | [02_zeitmassstab.html](02_zeitmassstab.html) | Maßstabsgetreue Zeitachse mit Zoom, Auswahl und **36 illustrierten Zeitporträts**: geologische Merkmale, Grenzdefinitionen, Unsicherheiten, Merksätze, eigene Notizen. |
| 03 — Geological Time Trainer | [03_zeittrainer.html](03_zeittrainer.html) | Multiple Choice, Reihenfolge, Zuordnung, numerische Grenzwerte, Platzierung, aktive Erinnerung, tägliche Wiederholungen und Lückentabelle. |

Die Unterlabore 04 (junge Erde: Kruste, Atmosphäre, Wasser) und 05 (geologische Datierung und geologische Belege) sind weiterhin nur geplant.

## Zeitporträts und dein geologisches Notizbuch

Im [Geological Time Explorer](02_zeitmassstab.html) erscheint bei Auswahl eines Abschnitts ein ausführlicher **Steckbrief** für **alle 36 Äonen, Ären und Perioden**:

- **Was prägt diesen Abschnitt?** — Kontext, drei zentrale Lernmerkmale (Erdwelt, Leben, geologische Belege) und ein kurzer Merksatz.
- **Warum beginnt er hier?** — Unterschied zwischen festgelegten numerischen Altersgrenzen (GSSA) und Gesteinsprofilen/GSSPs. Ein wichtiger biologischer oder klimatischer Wandel definiert nicht automatisch einen Grenzhorizont.
- **Wie ist der Zeitraum eingebettet?** — maßstabsgetreue Miniaturleiste des ausgewählten Abschnitts innerhalb seiner übergeordneten Einheit.
- **Wie kann ich ihn mir bildlich merken?** — eigens erstellte thematische SVG-Illustrationen mit expliziter Kennzeichnung als **symbolisch, nicht wissenschaftlich rekonstruiert**.
- **Was möchte ich selbst ergänzen?** — je Zeitabschnitt ein editierbares Notizfeld (max. 5000 Zeichen), automatisch und ausschließlich im Browser gespeichert. JSON-Export/-Import aller Notizen als lokale Sicherung, kein Server.
- **Weiterlernen:** Auswahl des Steckbriefs direkt auf der Zeitleiste, blätterbare zeitliche Nachbarn (auch über Ären-Grenzen hinweg), teilbarer Link wie `02_zeitmassstab.html#unit=cret`, und ein Link von der Aufgabenrückmeldung im Zeittrainer.

Technische Trennung: `time-data.js` liefert die ICS-Zeiteinheiten und Zahlen; `period-portraits-data.js` enthält **redaktionelle Interpretation** mit Quellenverweisen (kein offizieller ICS-Kommentar); `period-portraits.js` rendert Inhalte und speichert private Notizen; `period-portraits.css` gestaltet den Lesebereich.

Der Notizspeicher (`localStorage`-Schlüssel `lab01-geological-portraits-notes-v1`) ist **separat** vom Lernstand des Trainers. Löschen der Browserdaten kann Notizen entfernen; dafür gibt es die Exportfunktion. Die Porträts sind didaktische Synthesen und beanspruchen keine individuelle Begutachtung durch die ICS.
## Zeitdaten und Quellen

- Die geologische Skala beruht auf der [International Chronostratigraphic Chart der ICS, Version 2026/06](https://stratigraphy.org/chart/) (CC BY 4.0).
- `time-data.js` ist die gemeinsame lokale Datenbasis für die Zeitleiste und den Trainer: 4 Äonen, 10 Ären und 22 Perioden. Im Phanerozoikum sind es 3 Ären und 12 Perioden.
- Einheiten und Grenzwerte werden in **Ma** (Millionen Jahre vor heute) angegeben. 4567 Ma bezeichnet den Beginn der ICS-Skala, **nicht** den punktgenauen Zeitpunkt einer vollständig entstandenen Erde.
- Numerische Grenzalter werden laufend verbessert. Grenzen des Phanerozoikums und des Ediacariums werden durch GSSPs definiert, nicht einfach durch gerundete Ma-Werte.
- Deutsche Namen und unsere Farben sind didaktische Adaptionen, keine offizielle ICS-Übersetzung.

## Fünf Minuten täglich lernen

1. Starte mit den **vier Äonen**, dann den **drei Ären des Phanerozoikums**, schließlich den **zwölf Perioden**.
2. Wähle zwischen einer **Tagesrunde** (fällige Wiederholungen) und **freiem Training**.
3. Übe Reihenfolge, übergeordnete Einheiten, numerische Altersgrenzen, grobes Platzieren und selbstständiges Erinnern.
4. Nutze den Lückenstreifen als digitales Gegenstück zu einer ausgedruckten geologischen Zeittabelle.

Die einfachen Wiederholungsintervalle sind **1, 3, 7, 14 und 30 Tage**. Fehler bleiben wieder fällig. Dies ist eine didaktische Heuristik, **kein** empirisch validierter optimaler Algorithmus. Der Tagesfortschritt wird nur in deinem Browser in `localStorage` abgelegt, kann in der UI gelöscht werden und wird bei freien Runden nicht verändert. **Keine Konten, keine Telemetrie und kein Netzwerk-Tracking.**

## Three.js-Modell und seine Grenzen

Der [Proto-Erde-Explorer](01_protoerde.html) lädt **Three.js 0.160.0** als fest versioniertes ES-Modul über ein CDN und benötigt für 3D eine Internetverbindung. Die Erklärungen und Schaltflächen bleiben unabhängig von WebGL und der Bibliothek bedienbar.

**Es handelt sich ausdrücklich nicht um eine physikalische Simulation.** Die 3D-Szenen berechnen weder N-Körper-Bahnen noch Fluiddynamik, thermodynamische Prozesse, echte Materialverteilungen oder die Mondbildung. Rotationen, Farben, Größen und Szenenfolgen sind schematische Interpretationen. Die einzelnen frühen Vorgänge können sich überschneiden.

## Architektur

- GitHub Pages, statisches HTML, CSS und JavaScript; kein Backend, Build oder Framework erforderlich.
- Lokal versionierte [Modern-Objectivity-Referenz-CSS](https://philippklinz.github.io/modern-objectivity-style/) (`modern-objectivity.css`) und eigenständige Labor-Bühne (`earth-lab.css`).
- `timeline.js` und `trainer.js` verwenden dieselbe geologische Quelle (`time-data.js`) ohne Fremddienste.
- `proto-earth.js` ist ein optionales 3D-Modul. Ohne WebGL ist die textliche Nutzung weiterhin möglich.
- Die neue Zeitskala ist gegen ICS 2026/06 abgeglichen; die Funktionslogik wurde statisch und mithilfe simulierter DOM-Interaktionen geprüft. Ein umfassender visueller und assistiver Browser-Test steht noch aus.

## Entwicklung und Lizenzen

- [AGENTS.md](AGENTS.md): Entwicklungsgrundsätze und technische Leitplanken.
- [Ausbauplan LAB 01](docs/LAB-01-ROADMAP.md): Details und nächste Schritte.
- [Quellen und Lizenzen](THIRD_PARTY_NOTICES.md): ICS (CC BY 4.0), Modern Objectivity (GPL-2.0-only), Three.js (MIT), NASA-Literaturhinweis.
- [LICENSE](LICENSE): Eigener Projektquellcode unter der **GNU GPL v2.0 only**. Externe Inhalte behalten ihre jeweils eigene Lizenz.
