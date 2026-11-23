/* Progressive enhancement of the geological-time explanation. No storage. */
(() => {
  'use strict';
  const G = window.GeoTime;
  const guide = document.getElementById('zeiteinteilung');
  if (!G || !guide) return;
  const $ = id => document.getElementById(id);
  const byId = new Map([...G.units, ...G.guideUnits].map(unit => [unit.id, unit]));
  const ranks = {
    eon: 'Äon / Eon', era: 'Ära / Era', period: 'Periode / Period',
    epoch: 'Epoche / Epoch', age: 'Alter / Age'
  };
  const examples = {
    today: {
      leaf: 'megha', caption: 'Die geologische Adresse von heute',
      title: 'Alles gleichzeitig.',
      explanation: 'Heute liegt im Meghalayum. Dieses Alter gehört zur Epoche Holozän, diese zur Periode Quartär, diese zur Ära Känozoikum und diese zum Äon Phanerozoikum. Jeder eingerückte Abschnitt ist vollständig im darüberstehenden enthalten.',
      caveat: 'Die fünf Namen sind gleichzeitig richtig: Sie sagen nur unterschiedlich genau, welchen Zeitabschnitt wir meinen. Die heutige formale Einteilung folgt der ICS-Tabelle 2026/06.'
    },
    jurassic: {
      leaf: 'tithon', caption: 'Ein Zeitpunkt vor 145 Millionen Jahren',
      title: 'Jura ist eine Periode.',
      explanation: 'Dieser Zeitpunkt liegt im Alter Tithonium, innerhalb der Epoche Später Jura. Die Periode Jura gehört wiederum zur Ära Mesozoikum im Äon Phanerozoikum. „Jura“ und „Mesozoikum“ sind also keine gleichrangigen Nachbarn.',
      caveat: 'Später Jura ist die zeitliche Bezeichnung. Die entsprechende Gesteinsserie heißt Oberjura (englisch: Upper Jurassic). Die dargestellten Alterszahlen sind Näherungswerte mit Datierungsunsicherheiten.'
    },
    ediacaran: {
      leaf: 'edia', caption: 'Ein Zeitpunkt vor 600 Millionen Jahren',
      title: 'Hier endet die formale Unterteilung früher.',
      explanation: 'Dieser Zeitpunkt liegt in der Periode Ediacarium, innerhalb der Ära Neoproterozoikum und des Äons Proterozoikum. In der hier verwendeten ICS-Tabelle sind darunter noch keine formalen Epochen oder Alter ausgewiesen.',
      caveat: 'Die Zeit läuft lückenlos weiter. Es fehlen hier die weltweit vereinbarten feineren Unterteilungen. Das ganze Beispiel gehört außerdem zum Sammelbegriff Präkambrium.'
    },
    hadean: {
      leaf: 'had', caption: 'Ein Zeitpunkt vor 4,3 Milliarden Jahren',
      title: 'Ein Äon ohne formale Unterränge.',
      explanation: 'Dieser Zeitpunkt liegt im Hadaikum. In der ICS-Tabelle 2026/06 ist dieses Äon nicht in formale Ären, Perioden, Epochen oder Alter unterteilt. Deshalb zeigt der Zweig hier nur eine Ebene.',
      caveat: 'Das bedeutet nicht, dass in dieser Zeit nichts geschah. Es bedeutet, dass wir keine weiteren global ratifizierten Rangnamen aus dieser Tabelle zuordnen können.'
    }
  };
  const number = value => new Intl.NumberFormat('de-DE', { maximumFractionDigits: 4 }).format(value);
  const age = value => value === 0 ? 'heute' : number(value) + ' Ma';

  function renderExample(key, announce = false) {
    const example = examples[key];
    if (!example) return;
    const path = [];
    let unit = byId.get(example.leaf);
    while (unit) {
      path.unshift(unit);
      unit = byId.get(unit.parent);
    }
    const root = $('guide-tree');
    root.replaceChildren();
    let list = root;
    path.forEach((entry, index) => {
      const item = document.createElement('li');
      const box = document.createElement('div');
      box.className = 'guide-unit';
      box.style.setProperty('--unit-color', entry.color);
      const rank = document.createElement('span');
      rank.className = 'guide-rank';
      rank.textContent = ranks[entry.rank];
      const name = document.createElement('strong');
      name.textContent = entry.name;
      const interval = document.createElement('small');
      interval.textContent = 'ca. ' + age(entry.old) + ' – ' + age(entry.young);
      box.append(rank, name, interval);
      item.append(box);
      list.append(item);
      if (index < path.length - 1) {
        const childList = document.createElement('ol');
        item.append(childList);
        list = childList;
      }
    });
    $('guide-example-caption').textContent = example.caption;
    $('guide-example-title').textContent = example.title;
    $('guide-example-explanation').textContent = example.explanation;
    $('guide-example-caveat').textContent = example.caveat;
    for (const button of guide.querySelectorAll('[data-time-example]')) {
      button.setAttribute('aria-pressed', String(button.dataset.timeExample === key));
    }
    if (announce) $('guide-example-status').textContent = example.caption + ': ' + path.map(entry => entry.name).join(', ') + '. ' + example.caveat;
  }

  for (const button of guide.querySelectorAll('[data-time-example]')) {
    button.addEventListener('click', () => renderExample(button.dataset.timeExample, true));
  }
  for (const label of guide.querySelectorAll('[data-guide-duration]')) {
    const unit = G.byId.get(label.dataset.guideDuration);
    if (unit) label.textContent = (unit.young === 0 ? 'Bisher rund ' : 'Rund ') + number(unit.old - unit.young) + ' Millionen Jahre';
  }

  // Direct links open this explanation (or a source within it) without
  // interfering with the existing #unit=... portrait links.
  function revealHashTarget() {
    const target = document.getElementById(location.hash.slice(1));
    if (!target || (target !== guide && !guide.contains(target))) return;
    guide.open = true;
    target.scrollIntoView({ block: 'start', behavior: 'instant' });
  }
  renderExample('today');
  $('guide-examples').hidden = false;
  revealHashTarget();
  window.addEventListener('hashchange', revealHashTarget);
})();
