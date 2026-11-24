# Third-party sources and notices

## International Chronostratigraphic Chart (ICS)

- **Source:** International Commission on Stratigraphy (ICS), *International Chronostratigraphic Chart*, version **2026/06**, https://stratigraphy.org/chart/
- **License:** Creative Commons Attribution 4.0 International (CC BY 4.0), https://creativecommons.org/licenses/by/4.0/
- **Attribution:** © International Commission on Stratigraphy, 2026.
- **Modifications:** Selected units and numerical ages transcribed to `time-data.js`. Editorial German labels, simplified hierarchy, original colors, new explanatory text and interactive presentations. This project is not an official ICS publication or translation.
- **Hierarchy lesson:** `GeoTime.guideUnits` in the same file includes four selected epoch/age examples (Holocene, Meghalayan, Late Jurassic, Tithonian), not a complete finer-rank dataset. Existing parent boundaries are reused. These examples are displayed by `time-guide.js`; the 36-unit timeline/trainer catalogue is unchanged.
- **Important:** Numerical boundary ages may change. In the Phanerozoic and Ediacaran, stratigraphic boundaries are defined by GSSPs, not the printed numeric ages alone.
- **Suggested citation:** Cohen K, Harper D, Gibbard P, Car N (2025), *The ICS international chronostratigraphic chart this decade*, Episodes 48:105–115, https://doi.org/10.18814/epiiugs/2025/025001.

## Modern Objectivity practical style kit

- **Source:** https://github.com/philippklinz/modern-objectivity-style
- **Live style guide:** https://philippklinz.github.io/modern-objectivity-style/
- **Version:** practical style v0.1.0 draft; source CSS blob `c6af71a8688b9001313d19a642e8f308fa463280`.
- **License:** GNU GPL version 2 only, GPL-2.0-only.
- **Integration:** Unmodified local copy in `modern-objectivity.css`. Project-specific stage CSS is in `earth-lab.css`.

## Geological-time terminology lesson

The text and nested HTML illustration in `02_zeitmassstab.html#zeiteinteilung` are independently authored educational explanations, not reproduced ICS/DSK prose or artwork. The numerical examples follow the ICS chart and its CC BY 4.0 attribution above. The nesting diagram shows containment, not proportional duration. References checked on 24 November 2026:

- ICS, *International Chronostratigraphic Chart v2026/06*: https://stratigraphy.org/ICSchart/ChronostratChart2026-06.pdf.
- Steininger, F. F. & Piller, W. E. (eds., 1999), *Empfehlungen (Richtlinien) zur Handhabung der stratigraphischen Nomenklatur*, terminology excerpt hosted by DSK: https://www.stratigraphie.de/perm-trias/dsk_richtlin.htm.
- ICS, *International Stratigraphic Guide, Chapter 9: Chronostratigraphic Units*: https://stratigraphy.org/guide/chron. Used for concepts; current unit inventory and dates follow the versioned chart, not older examples in the guide.
- ICS, *GSSP register and proposal procedure*: https://stratigraphy.org/gssps/.
- Walker et al. (2018), *Formal ratification of the subdivision of the Holocene Series/Epoch (Quaternary System/Period): two new Global Boundary Stratotype Sections and Points (GSSPs) and three new stages/subseries*: https://doi.org/10.18814/epiiugs/2018/018016. The lesson displays the rounded chart ages; these must not be treated as exact calendar dates or confused with the publication's b2k reference year.
- IUGS/ICS (2024), *Joint statement on the vote by the ICS Subcommission on Quaternary Stratigraphy*: https://stratigraphy.org/news/152.

## Three.js

- **Library:** Three.js, contributors to the Three.js project.
- **Version:** 0.160.0.
- **Source:** https://github.com/mrdoob/three.js
- **Pinned source:** tag `r160`, commit `d04539a76736ff500cae883d6a38b3dd8643c548`.
- **Runtime module:** unmodified upstream `build/three.module.min.js`, copied to `vendor/three/three.module.min.js`.
- **License:** MIT; the full upstream notice is included in [vendor/three/LICENSE](vendor/three/LICENSE).
- **Integration:** Locally vendored ES module for the `01_protoerde.html` conceptual 3D illustration. No CDN request is required. Scene geometry, procedural shaders/textures, storyboard and controls are authored for this project.

## Proto-Earth scientific references

- NASA, *Solar System Facts*: https://science.nasa.gov/solar-system/solar-system-facts/
- NASA, *Planetary Systems*: https://science.nasa.gov/universe/stars/planetary-system/ — early planetesimals/embryos and the first millions of years.
- NASA, *Moon Formation*: https://science.nasa.gov/moon/formation/
- NASA, *Earth Facts*: https://science.nasa.gov/earth/facts/
- NASA Earth Observatory, *Ancient Crystals Suggest Earlier Ocean*: https://science.nasa.gov/earth/earth-observatory/ancient-crystals-suggest-earlier-ocean/
- These are factual references for independently authored German explanations, checked on 24 November 2026. No NASA images, datasets or visual media are embedded. The Theia trajectory, material motion, surface patterns, camera travel and development timing are illustrative choices, not research simulation outputs.
- Station age labels are deliberately coarse and overlapping. The Hadean starting anchor and Archean boundary reuse the ICS dataset in `time-data.js` (attribution above). The final 4.4–4.0 Ga interval is an editorial summary extending to the early Archean, not a measured duration of crust/ocean formation. Theia, debris and early Moon formation share a single approximate 4.5 Ga anchor; animation progress is never converted into a precise date.

## License scope

Original source code of this laboratory is GPL-2.0-only (see `LICENSE`). Scientific source data and external libraries retain their own licensing; those conditions and credits are not superseded by the project's GPL.

## Geological portraits (editorial educational content)

The 36 unit profiles in `period-portraits-data.js` are independently written **educational summaries** that integrate geological chronology, the stratigraphic nature of formal boundaries, evolutionary and environmental context, and learning mnemonics. They are not official descriptions published by ICS.

Reference sources used to inform the summaries:

- U.S. Geological Survey, *Fossils, Rocks, and Time*: https://pubs.usgs.gov/gip/fossils/scale.html
- National Park Service, *Fossils Through Geologic Time*: https://www.nps.gov/subjects/fossils/fossils-through-geologic-time.htm
- British Geological Survey, *Geological timechart*: https://www.bgs.ac.uk/discovering-geology/fossils-and-geological-time/geological-timechart/
- International Commission on Stratigraphy, *Global Boundary Stratotype Section and Points*: https://stratigraphy.org/gssps/
- NASA, *Ancient Crystals Suggest Earlier Ocean*: https://science.nasa.gov/earth/earth-observatory/ancient-crystals-suggest-earlier-ocean/

**Illustrations:** The symbolic SVG graphics are authored locally for this lab. They are **not** original BGS/NPS/ICS artworks, measured geological data, paleogeographical reconstructions, faithful fossils or depictions of specific species. Some sources above use older numerical calibrations than ICS v2026/06; the lab uses ICS exclusively for its numeric ages.

## Geological methods and young-Earth interactive experiments

The materials in `04_junge_erde.html`, `young-earth.js`, `05_geologische_methoden.html`, `geological-methods.js`, and `earth-inquiry.css` are authored for this lab and use schematic diagrams; no scientific photos, third-party illustrations, or proprietary data are embedded.

Scientific references:

- National Park Service, *Radiometric Age Dating*, https://www.nps.gov/subjects/geology/radiometric-age-dating.htm. The uranium isotope half-lives and dating context are approximate teaching values.
- U.S. Geological Survey, *Geologic Age: Using Radioactive Decay to Determine Geologic Age*, https://www.usgs.gov/educational-resources/geologic-age-using-radioactive-decay-determine-geologic-age.
- National Institute of Standards and Technology, *How Do You Know the Age of Fossils and Other Old Things?*, https://www.nist.gov/how-do-you-measure-it/how-do-you-know-age-fossils-and-other-old-things.
- Wilde, S. A., Valley, J. W., Peck, W. H., & Graham, C. M. (2001), *Evidence from detrital zircons for the existence of continental crust and oceans on the Earth 4.4 Gyr ago*, Nature 409, 175–178, https://doi.org/10.1038/35051550.
- NASA, *Moon Formation*, https://science.nasa.gov/moon/formation/.

The stratigraphic outcrop, isotope experiment, selected isotope quantities and planetary cross section are intentionally fictional/idealised educational models and must not be attributed as measured field or laboratory observations.
