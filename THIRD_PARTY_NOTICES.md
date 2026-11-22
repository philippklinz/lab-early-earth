# Third-party sources and notices

## International Chronostratigraphic Chart (ICS)

- **Source:** International Commission on Stratigraphy (ICS), *International Chronostratigraphic Chart*, version **2026/06**, https://stratigraphy.org/chart/
- **License:** Creative Commons Attribution 4.0 International (CC BY 4.0), https://creativecommons.org/licenses/by/4.0/
- **Attribution:** © International Commission on Stratigraphy, 2026.
- **Modifications:** Selected units and numerical ages transcribed to `time-data.js`. Editorial German labels, simplified hierarchy, original colors, new explanatory text and interactive presentations. This project is not an official ICS publication or translation.
- **Important:** Numerical boundary ages may change. In the Phanerozoic and Ediacaran, stratigraphic boundaries are defined by GSSPs, not the printed numeric ages alone.
- **Suggested citation:** Cohen K, Harper D, Gibbard P, Car N (2025), *The ICS international chronostratigraphic chart this decade*, Episodes 48:105–115, https://doi.org/10.18814/epiiugs/2025/025001.

## Modern Objectivity practical style kit

- **Source:** https://github.com/philippklinz/modern-objectivity-style
- **Live style guide:** https://philippklinz.github.io/modern-objectivity-style/
- **Version:** practical style v0.1.0 draft; source CSS blob `c6af71a8688b9001313d19a642e8f308fa463280`.
- **License:** GNU GPL version 2 only, GPL-2.0-only.
- **Integration:** Unmodified local copy in `modern-objectivity.css`. Project-specific stage CSS is in `earth-lab.css`.

## Three.js

- **Library:** Three.js, contributors to the Three.js project.
- **Version:** 0.160.0.
- **Source:** https://github.com/mrdoob/three.js
- **Runtime module:** https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js
- **License:** MIT: https://github.com/mrdoob/three.js/blob/r160/LICENSE
- **Integration:** This library is loaded as a pinned external ES module for the `01_protoerde.html` conceptual 3D illustration. It is not bundled or redistributed locally. All planet scene logic in `proto-earth.js` belongs to this project.

## NASA Moon formation information

- **Factual reference:** https://science.nasa.gov/moon/formation/
- No NASA images, datasets or visual media are embedded in the 3D viewer.

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
