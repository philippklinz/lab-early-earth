/* A reversible teaching storyboard, not a physical or calibrated simulation.
   Station ages are approximate context, never interpolated from progress.
   Every visual quantity is a pure function of progress (0..1). */
(() => {
  'use strict';
  const G = window.GeoTime;
  const hadean = G.byId.get('had'), archean = G.byId.get('arc');
  const ga = (ma, digits = 2) => new Intl.NumberFormat('de-DE', {maximumFractionDigits:digits}).format(ma / 1000);
  const startGa = ga(hadean.old), boundaryGa = ga(archean.old, 3);
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  const mix = (a, b, t) => a + (b - a) * t;
  const sources = {
    solar: ['NASA · Entstehung des Sonnensystems', 'https://science.nasa.gov/solar-system/solar-system-facts/'],
    planets: ['NASA · Die ersten Planetenbausteine', 'https://science.nasa.gov/universe/stars/planetary-system/'],
    moon: ['NASA · Mondentstehung und ihre Belege', 'https://science.nasa.gov/moon/formation/'],
    earth: ['NASA · Aufbau der Erde', 'https://science.nasa.gov/earth/facts/'],
    water: ['NASA · Alte Zirkone und frühes Wasser', 'https://science.nasa.gov/earth/earth-observatory/ancient-crystals-suggest-earlier-ocean/'],
    ics: ['ICS · Geologische Zeitskala ' + G.version, G.source],
    hadean: ['ICS/IUGS · Definition des Hadaikum-Beginns', 'https://doi.org/10.18814/epiiugs/2024/024002']
  };
  const chapters = [
    { at: 0, short: 'Scheibe', name: 'Eine Scheibe um die junge Sonne',
      time: {age:'vor ca. ' + startGa + ' Mrd. Jahren', eon:'Am Beginn des Hadaikums', note:'Die ICS legt den Beginn des Hadaikums anhand des Alters früher calcium- und aluminiumreicher Einschlüsse in Meteoriten fest. Diese Feststoffe entstanden in der protoplanetaren Scheibe. Eine fertige Erde ist dafür keine Voraussetzung: Ihre Entstehung gehört bereits zum Hadaikum.'},
      description: 'Gas und Staub umgeben die junge Sonne. Die feinen Punkte stehen für festes Material in dieser Scheibe. Rechts ist der Bereich markiert, in dem wir später die Erde verfolgen.',
      observation: 'Aus dem Material einer protoplanetaren Scheibe können Planeten entstehen. Noch gibt es hier keine fertige Erde. Beobachtungen junger Sternsysteme liefern Vergleichsbilder für solche Scheiben.',
      hint: 'Gehe langsam weiter: Aus dem feinen Material treten größere Körper hervor.', sources: ['solar', 'hadean', 'ics'] },
    { at: .14, short: 'Planetesimale', name: 'Aus kleinen Körpern werden größere',
      time: {age:'vor ca. ' + startGa + '–4,56 Mrd. Jahren', eon:'Frühes Hadaikum', note:'Planetesimale und erste Planetenembryonen entstehen bereits in den ersten Millionen Jahren. Der gerundete Bereich ordnet die Aufbauphase ein; nicht alle Körper entstehen oder wachsen gleichzeitig.'},
      description: 'Größere Gesteinskörper erscheinen zwischen dem Staub. Die Kamera nähert sich dem Bildungsbereich der Erde. Die Sonne bleibt am selben Ort im Sonnensystem.',
      observation: 'Zusammenstöße und die gegenseitige Gravitation beeinflussen das Wachstum. Manche Kollisionen verbinden Material, andere zertrümmern es. Das Modell zeigt vereinfacht den wachsenden Anteil größerer Körper.',
      hint: 'Die Teilchen sind Stellvertreter für Material, keine Darstellung jedes einzelnen Gesteinsbrockens.', sources: ['solar', 'planets'] },
    { at: .28, short: 'Proto-Erde', name: 'Die Proto-Erde wächst',
      time: {age:'vor rund 4,5 Mrd. Jahren', eon:'Hadaikum', note:'Die Erdentstehung erstreckt sich über viele Millionen Jahre. Das grobe Alter bezeichnet eine Wachstumsphase, keinen einzelnen Geburtstag und nicht das Ende weiterer Einschläge.'},
      description: 'Ein größerer Körper sammelt Material aus seiner Umgebung. Derselbe Globus wächst mit dem Entwicklungsregler; die Oberfläche wird heißer und glühende Bereiche werden sichtbar.',
      observation: 'Bei der Akkretion wird Energie frei. Einschläge und radioaktiver Zerfall tragen zur Erwärmung bei. Die Planetenbildung besteht aus vielen Ereignissen über lange Zeiträume.',
      hint: 'Wechsle zur Ansicht „Sonnensystem“, um die Erde wieder im größeren Zusammenhang zu sehen.', sources: ['solar', 'earth'] },
    { at: .39, short: 'Magmaozean', name: 'Eine teilweise geschmolzene Welt',
      time: {age:'vor rund 4,5 Mrd. Jahren', eon:'Hadaikum', note:'Große Schmelzphasen begleiten die frühe Entwicklung und können nach Einschlägen erneut auftreten. Diese Station hat deshalb kein einzelnes, eindeutig bestimmtes Datum.'},
      description: 'Die Oberfläche leuchtet durch ausgedehnte Schmelzbereiche. Dunklere Zonen und helle Risse machen den Unterschied zwischen abgekühltem und heißem Material sichtbar.',
      observation: 'Große Einschläge können umfangreiches Aufschmelzen verursachen. Magmaozeane können wiederholt auftreten. Die Farben sind eine Veranschaulichung, keine rekonstruierte Temperaturkarte.',
      hint: 'Im nächsten Abschnitt öffnet sich der Globus und gibt den Blick ins Innere frei.', sources: ['earth', 'moon'] },
    { at: .48, short: 'Kernbildung', name: 'Metall sammelt sich im Inneren',
      time: {age:'vor rund 4,5 Mrd. Jahren', eon:'Hadaikum', note:'Die Trennung von Metall und Silikat begleitet bereits das Wachstum der Erde und ihrer Vorläufer. Sie überschneidet sich zeitlich mit Akkretion und Aufschmelzen.'},
      description: 'Ein Ausschnitt öffnet sich im selben Planeten. Der helle Kern liegt im Inneren des rötlichen Mantels. Die Schnittflächen zeigen die Schichten als zusammenhängenden Körper.',
      observation: 'Dichtes Metall und silikatisches Material trennen sich bei der Differentiation. Kernbildung, Wachstum und Aufschmelzen überschneiden sich. Die Schnittansicht ist eine Darstellungshilfe, kein Loch in der damaligen Erde.',
      hint: 'Mit „Innenaufbau“ lässt sich der Schnitt auch in anderen Ansichten öffnen oder schließen.', sources: ['earth'] },
    { at: .565, short: 'Theia', name: 'Theia trifft auf die junge Erde',
      time: {age:'vor rund 4,5 Mrd. Jahren', eon:'Hadaikum · Datierung unsicher', note:'Der mondbildende Einschlag wird grob in diese Zeit eingeordnet. Sein genaues Alter wird erforscht; die Animation legt weder ein exaktes Datum noch eine reale Ereignisdauer fest.'},
      description: 'Links nähert sich ein zweiter Protoplanet: Theia. Spiele den Einschlag ab oder ziehe den Regler langsam weiter. Auf Kontakt folgen Verformung, Aufheizung und ausgeworfenes Material.',
      observation: 'Die Giant-Impact-Hypothese beschreibt die Mondentstehung durch einen großen Einschlag. Theia ist der Name des angenommenen Kollisionspartners; seine genaue Gestalt, Bahn und der Ablauf sind nicht bekannt.',
      hint: 'Vor dem Kontakt gibt es in dieser Modellgeschichte noch keinen Mond.', sources: ['moon'] },
    { at: .72, short: 'Trümmer', name: 'Material umkreist die Erde',
      time: {age:'vor rund 4,5 Mrd. Jahren', eon:'Hadaikum · nach dem Einschlag', note:'Diese Folge des mondbildenden Einschlags erhält denselben groben Zeitanker. Der Weg vom Kontakt zur Trümmerscheibe steht nicht für einen Sprung um Millionen Jahre.'},
      description: 'Ein Teil des ausgeworfenen Materials verteilt sich um die heiße Erde. Der Auswurf geht kontinuierlich in eine Trümmerscheibe über. Ein anderer Teil fällt im Modell zurück.',
      observation: 'Ausgeworfenes Gestein, Schmelze und Dampf spielen in Modellen der Mondbildung eine Rolle. Welche Anteile im Orbit bleiben und wie sie sich entwickeln, hängt vom Einschlagsszenario ab.',
      hint: 'Beobachte beim Weitergehen, wie Material zur Position des wachsenden Mondes wandert.', sources: ['moon'] },
    { at: .85, short: 'Junger Mond', name: 'Der Mond nimmt Gestalt an',
      time: {age:'vor rund 4,5 Mrd. Jahren', eon:'Hadaikum · frühes Erde-Mond-System', note:'Die Mondbildung gehört zum selben frühen Ereigniskomplex. Ihre Dauer hängt vom untersuchten Szenario ab und lässt sich nicht aus dem Abstand der Stationen auf dem Regler ablesen.'},
      description: 'Aus dem Material außerhalb der Erde wächst ein neuer Körper. Der junge Mond glüht zunächst. Während er größer wird, nimmt die sichtbare Trümmerscheibe ab.',
      observation: 'Mondgesteine sprechen für eine frühe Schmelzphase. Die hier gezeigte Bildung aus einer Trümmerscheibe ist ein anschaulicher Modellweg; andere Einschlagssimulationen ergeben auch andere Abläufe.',
      hint: 'Die Bahn ist zum Beobachten stark zusammengedrückt. Die Animation stellt keine echte Bildungsdauer dar.', sources: ['moon'] },
    { at: 1, short: 'Abkühlung', name: 'Kruste, Atmosphäre und frühes Wasser',
      time: {age:'vor ca. 4,4–4,0 Mrd. Jahren', eon:'Hadaikum → frühes Archaikum', note:'Zirkone liefern schon für etwa 4,4 Milliarden Jahre Hinweise auf Kruste und flüssiges Wasser, also im Hadaikum. Die letzte Station fasst die weitere Entwicklung bis etwa 4,0 Milliarden Jahre zusammen. Das Archaikum beginnt nach ICS ' + G.version + ' bei rund ' + boundaryGa + ' Milliarden Jahren.'},
      description: 'Glühende Flächen gehen zurück. Dunkle Kruste, Wasserflächen und eine dunstige Atmosphäre werden sichtbar. Erde und Mond bleiben dieselben Körper, die wir durch die Entwicklung verfolgt haben.',
      observation: 'Sehr alte Zirkone liefern indirekte Hinweise auf frühe Kruste und möglicherweise flüssiges Wasser. Die Oberfläche zeigt erfundene Muster, keine heutigen oder sicher rekonstruierten Kontinente.',
      hint: 'Ziehe den Regler zurück: Alle Veränderungen sind in diesem Lernmodell umkehrbar.', sources: ['water', 'earth', 'ics'] }
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
