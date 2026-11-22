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
