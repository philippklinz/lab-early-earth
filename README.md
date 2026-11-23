# LAB 01 — Die frühe Erde

Ein eigenständiges, interaktives Lernlabor zur Entstehung der Erde und zur geologischen Zeitskala. **Status: fünf interaktive Unterlabore als funktionale Prototypen umgesetzt.**

**Online:** https://philippklinz.github.io/lab-early-earth/

## Jetzt ausprobieren

| Unterlabor | Seite | Was funktioniert? |
|---|---|---|
| 01 — Proto-Erde | [01_protoerde.html](01_protoerde.html) | Sieben steuerbare **schematische** 3D-Szenen über Planetenentstehung, Akkretion, Magmaozeane, Differentiation und Mondentstehung. Fachliche Beschreibungen funktionieren auch ohne 3D. |
| 02 — Geological Time Explorer | [02_zeitmassstab.html](02_zeitmassstab.html) | Maßstabsgetreue Zeitachse mit Zoom, Auswahl, **36 illustrierten Zeitporträts** und aufklappbarer Erklärung der Zeiteinteilung: Äon, Ära, Periode, Epoche und Alter (Age). |
| 03 — Geological Time Trainer | [03_zeittrainer.html](03_zeittrainer.html) | Multiple Choice, Reihenfolge, Zuordnung, numerische Grenzwerte, Platzierung, aktive Erinnerung, tägliche Wiederholungen und Lückentabelle. |

| 04 — Die junge Erde | [04_junge_erde.html](04_junge_erde.html) | Vier auswählbare Prozesse mit Oberfläche/Querschnitt/Atmosphärenansicht; Beobachtungen, Interpretationen und wissenschaftliche Unsicherheiten getrennt. |
| 05 — Wie wissen wir das? | [05_geologische_methoden.html](05_geologische_methoden.html) | Vier Fragen zur relativen Stratigraphie, ein interaktiver idealisierter Uran-Zerfallsrechner und Beweisketten zu Zirkonen, Meteoriten, alten Gesteinen und Mondproben. |

Die ersten drei Unterlabore bleiben eigenständig; 04 und 05 sind über die Startseite und das globale Labormenü erreichbar.

## Die junge Erde und geologische Methoden

Das [Unterlabor 04](04_junge_erde.html) erschließt geologische Prozesse, die im Hadaikum abliefen oder sich überlagerten: Schmelzen durch Einschläge und Wärme, Metall-Silikat-Differentiation, Krustenbildung und frühe Wasserkreisläufe. Die Oberfläche, ein nicht maßstabsgetreuer Querschnitt sowie Atmosphäre/Wasser sind als **schematische SVG-Modelle** umschaltbar. Jeder Prozess trennt **Beobachtung, Deutung und offene Frage**. Es handelt sich nicht um eine berechnete physikalische Simulation oder eine exakte Chronologie.

Das [Unterlabor 05](05_geologische_methoden.html) unterscheidet **relative Datierung** von **radiometrischer Datierung**:

- **Schichtenexperiment:** vier Fragen zur Abfolge der Sedimentschichten A–D sowie einer Intrusion E. Die zugrundeliegenden Prinzipien sind Superposition und Durchschneidungsverhältnisse; keine absoluten Alter werden aus der Abfolge allein abgeleitet.
- **Isotopenuhr:** U-238 → Pb-206 mit angenommener Halbwertszeit 4468 Ma und U-235 → Pb-207 mit 704 Ma. Der Prozentregler nutzt die **ideal vereinfachte** Formel `t = T½ × log₂(1/f)`, wobei f der bekannte Restanteil der Mutterisotope ist. Reale Uran-Blei-Datierungen messen Isotopenverhältnisse, berücksichtigen Tochterprodukte und mögliche Systemstörungen. Rechnerische Werte über 4567 Ma werden als für eine irdische Mineralprobe unplausibel gekennzeichnet.
- **Beweisketten:** Meteorite, Jack-Hills-Zirkone, alte Krustengesteine und Mondgesteine werden jeweils nach Befund, Schlussfolgerung und Unsicherheit erklärt.

Die beiden neuen Module benötigen keine zusätzlichen JavaScript-Bibliotheken oder externe Laufzeitressourcen. Wissenschaftliche Links befinden sich direkt auf jeder Seite; Eigenzeichnungen sind **nicht maßstabsgerecht oder reale Forschungsdaten**.

## Die geologische Zeiteinteilung verstehen

Direkt über der Zeitleiste erklärt eine aufklappbare [Lernhilfe](02_zeitmassstab.html#zeiteinteilung) die fünf Hauptränge **Äon → Ära → Periode → Epoche → Alter (Age)**. Vier umschaltbare Beispiele (heute, vor 145 Ma, vor 600 Ma und vor 4,3 Ga) zeigen, wie Zeitabschnitte ineinander liegen und wo die ICS-Skala noch keine feineren formalen Unterteilungen enthält. Die Verschachtelung ist ausdrücklich kein Zeitmaßstab.

Die Begriffstabelle, der Vergleich unterschiedlich langer Perioden und Vertiefungen zu Zeit/Gestein, GSSP/GSSA, Präkambrium, Unterrängen, Chron und Anthropozän sind auch ohne JavaScript lesbar. Quellen stehen direkt in der Lernhilfe. Der Link `#zeiteinteilung` öffnet sie automatisch mit JavaScript; sonst lässt sich die Erklärung über ihre Zusammenfassung öffnen.

`time-guide.js` und `time-guide.css` ergänzen nur dieses Kapitel. Vier ausgewählte Epochen/Alter stehen als `GeoTime.guideUnits` in `time-data.js`, getrennt von den unveränderten 36 Einheiten des Explorers und Trainers. Die Lernhilfe verwendet weder Fortschrittsspeicherung noch persönliche Notizen. Die Zeitleiste selbst zeigt weiterhin die drei Ränge Äon, Ära und Periode.

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
