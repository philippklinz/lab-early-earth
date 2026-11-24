# AGENTS.md — Die frühe Erde

## Role and purpose

You are working on **Learning Lab 01 — Die frühe Erde**, an independent static educational website. Primary purpose: curiosity-driven personal learning, experimentation, and occasional public sharing through GitHub Pages. It is **not** a commercial product, not a reusable platform, and not a production SaaS.

The lab number is an **optional learning route**, never a software dependency or required sequence. Do not assume access to any central Learning Labs runtime or Space.

## Subject scope

Entstehung der Erde, frühe Kruste, Ozeane, Atmosphäre und geologische Zeit.

### Guiding learner questions

- Wie entstand die Erde aus dem frühen Sonnensystem?
- Welche Belege kennen wir für die frühe Erdgeschichte?
- Wie entwickelten sich Kruste, Ozeane und Atmosphäre?
- Welche Umweltbedingungen könnten präbiotische Chemie ermöglicht haben?

### Implemented exhibits (working prototypes)

- `01_protoerde.html`: one persistent Three.js scene with nine reversible development stations, camera travel, a Theia impact sequence and Moon formation; **not a physics simulation**. Full-width viewport, explanations below.
- `02_zeitmassstab.html` + `timeline.js`: proportional time viewer, zoom, pan, hierarchy, masking.
- `03_zeittrainer.html` + `trainer.js`: daily and free active-recall practice, intervals, approximate placement, hide/reveal memory strip.
- `04_junge_erde.html` + `young-earth.js`: functional early-Earth process explorer with three conceptual SVG views and separate observations, interpretations and unknowns.
- `05_geologische_methoden.html` + `geological-methods.js`: working stratigraphy exercise, ideal closed-system uranium decay calculator and evidence case browser.

## Scientific responsibility

Frühe Umweltbedingungen und Datierungen sind aus indirekten Belegen rekonstruiert. Keine lückenlose oder scheinbar exakt beobachtete Erdgeschichte behaupten.

- Distinguish observation, evidence, hypotheses, models, estimates, and consensus.
- Cite factual scientific claims from traceable credible sources when adding content.
- Explicitly label simplifications, scale distortions, uncertain dates and model limitations.
- Never invent publications, citations, simulations, measurements, validations, or sources.
- Never present a conceptual placeholder as a functioning experiment.

## Pedagogy

- Do not assume prior school knowledge. Introduce each object before abbreviations or jargon.
- Prefer **observe → predict → interact → explain**, with useful feedback.
- Make controls meaningful, use a consistent legend, and provide explanations at increasing depth when helpful.
- Prefer clear interfaces to decorative animation. Pause and step through time-dependent processes.
- An experiment should expose a scientifically meaningful relationship, not just an effect.

## Design direction

Modern Objectivity, as documented in the provisional Apperception Machinery BrandBook:
- Quiet graphical UI stage; graphite, warm near-white, signal turquoise `#009E98`.
- Liberation Sans, Liberation Serif, Liberation Mono with fallbacks.
- Accessibility: responsive layout, keyboard operability, discernible focus, explanatory labels, reduced-motion support.
- Scientific illustration colors may differ from brand accents, but must communicate meaning and include legends.
- Avoid implying that an unfinished design guide is formally approved.

## Architecture

- Standalone static HTML/CSS/JavaScript website deployable with GitHub Pages.
- SVG, Canvas, Three.js allowed when materially helpful. Keep versioned third-party dependencies and their notices.
- No required backend, database, registration, analytics, build pipeline, or network access unless unavoidable and explained.
- No shared cross-repository runtime. Copy small design patterns when needed rather than coupling repositories.
- Keep `index.html` as entry point, `README.md` as public project description, and `LICENSE` intact.
- This repository is licensed under GNU GPL v2.0; track separately licensed content and dependencies.

## Working process

1. Inspect the current code and state of the exhibit before changing it.
2. Make focused changes aligned to the learner's question.
3. Verify internal links, JavaScript syntax, central interactions, and responsive rendering where tools permit.
4. State what was tested, what was not, and any scientific uncertainty.
5. Never claim a browser test or GitHub Pages deployment without evidence.
6. Keep docs accurate: planned exhibits are not implemented features.

## Modern Objectivity implementation

Use the **locally vendored** `modern-objectivity.css` (the v0.1 draft [practical style kit](https://philippklinz.github.io/modern-objectivity-style/), source SHA `c6af71a8688b9001313d19a642e8f308fa463280`). Preserve the vendor stylesheet as an exact copy; make stage-specific changes in the local page styles and prefer `--mo-*` semantic tokens. This is a reference style, **not a universal visual mandate**. Keep the standalone site functioning with no CDN dependencies. If upgrading the kit, compare behavior and update attribution/version notes.

## Agreed lab structure (planning)

Read [docs/LAB-01-ROADMAP.md](docs/LAB-01-ROADMAP.md) before implementing learning exhibits. In particular, the user wants an accurate **Geological Time Explorer**, a daily **Geological Time Trainer** to complement a printed chart, and a Three.js visual exploration of Proto-Earth formation. Use the ICS v2026/06 chart as the versioned starting source; do not hard-code silently outdated ages or claim planetary animations are physically validated. Follow the roadmap incrementally without introducing a cross-lab dependency. M1, M2 and the conceptual M3 viewer are now implemented as prototypes. A prototype is not proof of scientific or accessibility validation.

## Current code contracts

- Shared stratigraphic units are in `time-data.js` (ICS v2026/06, CC BY 4.0). Do not duplicate dates or silently alter boundaries in experiments.
- `earth-lab.css` is the local stage design; keep `modern-objectivity.css` as an unchanged upstream vendor stylesheet.
- Keep the full-Earth timeline **proportional**. The other presets are zoom states, not different age data.
- Trainer progression is local-only (`localStorage`). Free practice **must not** write progress; due-date sessions may. Keep straightforward interval logic and reset controls.
- The 3D viewer uses locally vendored Three.js 0.160.0 (`vendor/three/`, MIT). `proto-model.js` evaluates a deterministic storyboard, `proto-controls.js` handles playback/text without WebGL, and `proto-earth.js` retains one scene and its objects while scrubbing. Keep the no-WebGL/no-JavaScript explanations, reduced-motion behavior and paused render loop. Do not claim N-body, SPH or temperature-field simulation, or a calibrated time axis. Theia's collision precedes the Moon's appearance. Run `node --test tests/proto-model.test.cjs` and check actual browser rendering after model changes.
- Proto-Earth station ages are coarse, overlapping context in `chapters[].time`, not a date computed from animation progress. Load `time-data.js` before `proto-model.js` and reuse its Hadean/Archean boundaries. Keep Theia/debris/Moon on the same approximate age anchor; do not imply millions of years pass during the illustrated collision. The final station spans about 4.4–4.0 Ga into the early Archean, with water evidence already in the Hadean.
- Preserve third-party attribution in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). ICS data = CC BY 4.0, Three.js = MIT, Modern Objectivity = GPL-2.0-only.
- Verify links among `index.html` and all five implemented modules.
- Correctness is scientific and behavioral: positive interval durations; no gaps between adjacent stratigraphic units at the same rank; keyboard-usable selections; accurate feedback; scientific uncertainty visible.

## 36 geological portraits and personal notes

- The Geological Time Explorer has a fully illustrated portrait for each of the 36 units in `time-data.js`. The substantive teaching data are in `period-portraits-data.js`, keyed by unchanged unit IDs; the display is implemented by `period-portraits.js` and `period-portraits.css`.
- Keep **36/36 coverage**. For each portrait, maintain a distinct introduction, three meaningful features, explanation of boundary *definition* (not merely an interesting event), caveat, memory hook, schematic motif and credible reference links.
- Scientific distinction: Phanerozoic/Ediacaran GSSPs are boundary reference points when ratified; other boundaries may be provisional or numerical. Precambrian units often have chronometric GSSA boundaries. Do NOT imply that a mass extinction or evolutionary event itself automatically defines an entire period.
- Graphic scenes are symbolic SVG motifs, not paleogeographic maps, taxonomic species reconstruction, accurate fossil drawings, or scientific data. Preserve explanatory captions.
- A selected time unit triggers the `geo-unit-selected` event; portrait controls send `geo-portrait-navigate` events. Hash deep links use `#unit=<stableID>` so users can share a time unit.
- Per-unit personal notes are stored only in `localStorage` under `lab01-geological-portraits-notes-v1` and are independent of the trainer progress key. Never upload, track, silently remove or migrate them without user consent. Keep JSON export and validated JSON import functional.
- In the trainer feedback, maintain a contextual link to the time unit's portrait; avoid interrupting the ongoing quiz.
- Claims in portraits are authored interpretations, sourced via ICS, USGS, BGS, NPS, and NASA—not verbatim official ICS descriptions. Update source attribution when making changes.

## Modules 04–05: implementation contracts

- Reuse `earth-inquiry.css` and the lab's local Modern Objectivity reference; avoid introducing new dependencies.
- The young-Earth module must **never** suggest its four process tabs are four exactly dated, mutually exclusive phases. The Earth diagrams are schematic, not accurate reconstructions of the Hadean.
- The methods module separates (1) **relative order** from (2) **numeric radiometric ages**. The intrusion E cuts A/B/C but is overlaid by D following an erosional surface; never invert these relationships.
- The isotope activity is a **closed-system teaching model** with a known initial parent fraction. U-238 half-life approx 4468 Ma; U-235 half-life approx 704 Ma. Actual U-Pb mineral dating is not just a slider reading of surviving atoms. Keep an explicit warning for computed ages older than the Earth.
- Four evidence choices: meteorites, Jack Hills zircons, old rock, Moon samples. Distinguish measurable observations from geological hypotheses; keep credible external reference links.
- Avoid localStorage for these modules; they are session-only interactions. Do not invent experiments, fossil evidence or measured isotope results.
- Check all 5 navigation links and the homepage status after introducing future modules. Running browser-level visual tests and accessibility checks remains desirable.
