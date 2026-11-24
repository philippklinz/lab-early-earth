/* A reversible teaching storyboard, not a physical or dated simulation.
   Every visual quantity is a pure function of progress (0..1). */
(() => {
  'use strict';
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  const mix = (a, b, t) => a + (b - a) * t;
  const sources = {
    solar: ['NASA · Entstehung des Sonnensystems', 'https://science.nasa.gov/solar-system/solar-system-facts/'],
    moon: ['NASA · Mondentstehung und ihre Belege', 'https://science.nasa.gov/moon/formation/'],
    earth: ['NASA · Aufbau der Erde', 'https://science.nasa.gov/earth/facts/'],
    water: ['NASA · Alte Zirkone und frühes Wasser', 'https://science.nasa.gov/earth/earth-observatory/ancient-crystals-suggest-earlier-ocean/']
  };
  const chapters = [
    { at: 0, short: 'Scheibe', name: 'Eine Scheibe um die junge Sonne',
      description: 'Gas und Staub umgeben die junge Sonne. Die feinen Punkte stehen für festes Material in dieser Scheibe. Rechts ist der Bereich markiert, in dem wir später die Erde verfolgen.',
      observation: 'Aus dem Material einer protoplanetaren Scheibe können Planeten entstehen. Noch gibt es hier keine fertige Erde. Beobachtungen junger Sternsysteme liefern Vergleichsbilder für solche Scheiben.',
      hint: 'Gehe langsam weiter: Aus dem feinen Material treten größere Körper hervor.', sources: ['solar'] },
    { at: .14, short: 'Planetesimale', name: 'Aus kleinen Körpern werden größere',
      description: 'Größere Gesteinskörper erscheinen zwischen dem Staub. Die Kamera nähert sich dem Bildungsbereich der Erde. Die Sonne bleibt am selben Ort im Sonnensystem.',
      observation: 'Zusammenstöße und die gegenseitige Gravitation beeinflussen das Wachstum. Manche Kollisionen verbinden Material, andere zertrümmern es. Das Modell zeigt vereinfacht den wachsenden Anteil größerer Körper.',
      hint: 'Die Teilchen sind Stellvertreter für Material, keine Darstellung jedes einzelnen Gesteinsbrockens.', sources: ['solar'] },
    { at: .28, short: 'Proto-Erde', name: 'Die Proto-Erde wächst',
      description: 'Ein größerer Körper sammelt Material aus seiner Umgebung. Derselbe Globus wächst mit dem Entwicklungsregler; die Oberfläche wird heißer und glühende Bereiche werden sichtbar.',
      observation: 'Bei der Akkretion wird Energie frei. Einschläge und radioaktiver Zerfall tragen zur Erwärmung bei. Die Planetenbildung besteht aus vielen Ereignissen über lange Zeiträume.',
      hint: 'Wechsle zur Ansicht „Sonnensystem“, um die Erde wieder im größeren Zusammenhang zu sehen.', sources: ['solar', 'earth'] },
    { at: .39, short: 'Magmaozean', name: 'Eine teilweise geschmolzene Welt',
      description: 'Die Oberfläche leuchtet durch ausgedehnte Schmelzbereiche. Dunklere Zonen und helle Risse machen den Unterschied zwischen abgekühltem und heißem Material sichtbar.',
      observation: 'Große Einschläge können umfangreiches Aufschmelzen verursachen. Magmaozeane können wiederholt auftreten. Die Farben sind eine Veranschaulichung, keine rekonstruierte Temperaturkarte.',
      hint: 'Im nächsten Abschnitt öffnet sich der Globus und gibt den Blick ins Innere frei.', sources: ['earth', 'moon'] },
    { at: .48, short: 'Kernbildung', name: 'Metall sammelt sich im Inneren',
      description: 'Ein Ausschnitt öffnet sich im selben Planeten. Der helle Kern liegt im Inneren des rötlichen Mantels. Die Schnittflächen zeigen die Schichten als zusammenhängenden Körper.',
      observation: 'Dichtes Metall und silikatisches Material trennen sich bei der Differentiation. Kernbildung, Wachstum und Aufschmelzen überschneiden sich. Die Schnittansicht ist eine Darstellungshilfe, kein Loch in der damaligen Erde.',
      hint: 'Mit „Innenaufbau“ lässt sich der Schnitt auch in anderen Ansichten öffnen oder schließen.', sources: ['earth'] },
    { at: .565, short: 'Theia', name: 'Theia trifft auf die junge Erde',
      description: 'Links nähert sich ein zweiter Protoplanet: Theia. Spiele den Einschlag ab oder ziehe den Regler langsam weiter. Auf Kontakt folgen Verformung, Aufheizung und ausgeworfenes Material.',
      observation: 'Die Giant-Impact-Hypothese beschreibt die Mondentstehung durch einen großen Einschlag. Theia ist der Name des angenommenen Kollisionspartners; seine genaue Gestalt, Bahn und der Ablauf sind nicht bekannt.',
      hint: 'Vor dem Kontakt gibt es in dieser Modellgeschichte noch keinen Mond.', sources: ['moon'] },
    { at: .72, short: 'Trümmer', name: 'Material umkreist die Erde',
      description: 'Ein Teil des ausgeworfenen Materials verteilt sich um die heiße Erde. Der Auswurf geht kontinuierlich in eine Trümmerscheibe über. Ein anderer Teil fällt im Modell zurück.',
      observation: 'Ausgeworfenes Gestein, Schmelze und Dampf spielen in Modellen der Mondbildung eine Rolle. Welche Anteile im Orbit bleiben und wie sie sich entwickeln, hängt vom Einschlagsszenario ab.',
      hint: 'Beobachte beim Weitergehen, wie Material zur Position des wachsenden Mondes wandert.', sources: ['moon'] },
    { at: .85, short: 'Junger Mond', name: 'Der Mond nimmt Gestalt an',
      description: 'Aus dem Material außerhalb der Erde wächst ein neuer Körper. Der junge Mond glüht zunächst. Während er größer wird, nimmt die sichtbare Trümmerscheibe ab.',
      observation: 'Mondgesteine sprechen für eine frühe Schmelzphase. Die hier gezeigte Bildung aus einer Trümmerscheibe ist ein anschaulicher Modellweg; andere Einschlagssimulationen ergeben auch andere Abläufe.',
      hint: 'Die Bahn ist zum Beobachten stark zusammengedrückt. Die Animation stellt keine echte Bildungsdauer dar.', sources: ['moon'] },
    { at: 1, short: 'Abkühlung', name: 'Kruste, Atmosphäre und frühes Wasser',
      description: 'Glühende Flächen gehen zurück. Dunkle Kruste, Wasserflächen und eine dunstige Atmosphäre werden sichtbar. Erde und Mond bleiben dieselben Körper, die wir durch die Entwicklung verfolgt haben.',
      observation: 'Sehr alte Zirkone liefern indirekte Hinweise auf frühe Kruste und möglicherweise flüssiges Wasser. Die Oberfläche zeigt erfundene Muster, keine heutigen oder sicher rekonstruierten Kontinente.',
      hint: 'Ziehe den Regler zurück: Alle Veränderungen sind in diesem Lernmodell umkehrbar.', sources: ['water', 'earth'] }
  ];
  function stateAt(value) {
    const p = clamp(Number.isFinite(value) ? value : 0);
    let chapter = 0;
    for (let i = 1; i < chapters.length; i++) if (p >= (chapters[i-1].at + chapters[i].at) / 2) chapter = i;
    const approach = smooth(.515, .60, p), merge = smooth(.60, .65, p);
    const theia = [mix(-7.0, -2.02, approach), mix(.36, .12, approach), mix(1.25, .66, approach)];
    theia[0] = mix(theia[0], .15, merge); theia[1] = mix(theia[1], 0, merge); theia[2] = mix(theia[2], .12, merge);
    const moonAngle = .25 + Math.max(0, p - .79) * 4.5;
    const moon = [3.65 * Math.cos(moonAngle), .18, 3.65 * Math.sin(moonAngle)];
    let event = chapters[chapter].short;
    if (p >= .515 && p < .598) event = 'Theia nähert sich';
    else if (p >= .598 && p < .63) event = 'Kontakt & Aufheizung';
    else if (p >= .63 && p < .69) event = 'Material wird ausgeworfen';
    else if (p >= .69 && p < .79) event = 'Eine Trümmerscheibe entsteht';
    else if (p >= .79 && p < .91) event = 'Der junge Mond wächst';
    return {
      p, chapter, event,
      earthScale: .025 * smooth(.075, .14, p) + .975 * smooth(.14, .32, p),
      heat: clamp(.12 + .88 * smooth(.20, .39, p) - .22 * smooth(.43, .53, p) + .22 * smooth(.598, .65, p) - .96 * smooth(.85, 1, p)),
      crust: smooth(.87, 1, p), water: smooth(.935, 1, p),
      cut: smooth(.425, .475, p) * (1 - smooth(.49, .535, p)),
      core: mix(.12, .39, smooth(.23, .49, p)),
      gas: 1 - smooth(.12, .34, p),
      rocks: smooth(.025, .14, p) * (1 - smooth(.29, .39, p)),
      theia, theiaScale: smooth(.515, .54, p) * (1 - smooth(.612, .655, p)),
      impact: smooth(.598, .612, p) * (1 - smooth(.625, .68, p)),
      debris: smooth(.60, .655, p) * (1 - smooth(.83, .94, p)),
      settle: smooth(.64, .755, p), collect: smooth(.795, .925, p),
      moon, moonScale: smooth(.79, .905, p),
      moonHeat: .7 * (1 - smooth(.87, 1, p)),
      cameraClose: smooth(.12, .31, p),
      cameraWide: smooth(.51, .56, p) * (1 - smooth(.65, .70, p)),
      moonView: smooth(.73, .87, p)
    };
  }
  window.ProtoEarthModel = Object.freeze({ chapters, sources, stateAt, clamp, smooth, mix });
})();
