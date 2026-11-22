/* Young Earth educational stage. Process views are explanatory models,
 * not a fixed chronology, simulation or globally reconstructed surface.
 * Editorial sources: ICS v2026/06, NASA Moon Formation, Wilde et al. 2001.
 */
(() => {
 'use strict';
 const $=id=>document.getElementById(id);
 const stage=$('young-scene');if(!stage)return;
 const processes=[
  {
    name:'Einschläge & Schmelze',tag:'PROZESS 01 / ENERGIE',label:'ENERGIE / SCHMELZE',view:'surface',
    intro:'Beim Wachstum der Proto-Erde setzten Einschläge und Gravitation enorme Mengen Energie frei. Zusammen mit inneren Wärmequellen konnte das große Gesteinsvolumina aufschmelzen.',
    subtitle:'Magmaozeane sind plausible Modelle für Phasen der frühen Erde. Die Ausdehnung und Dauer sind Gegenstand wissenschaftlicher Forschung.',
    limit:'„Hadaikum“ bedeutet nicht, dass die Erde über 536 Millionen Jahre ununterbrochen eine glühende Oberfläche hatte.',
    observed:'Mondproben und Meteorite bewahren Hinweise auf frühe hochenergetische Prozesse. Das älteste irdische Material ist selten.',
    interpreted:'Große Einschläge und radioaktive Wärme konnten Silikate teilweise oder großräumig aufschmelzen.',
    open:'Wie oft und wie lange bestanden Magmaozeane? Welche Unterschiede gab es zwischen Regionen?',
    foot:'AUFHEIZUNG / EIN SCHWERPUNKT, KEINE FESTE PHASE'
  },{
    name:'Kern & Mantel',tag:'PROZESS 02 / DIFFERENTIATION',label:'AUFBAU / SCHICHTEN',view:'section',
    intro:'In einem heißen jungen Planeten konnten dichte metallische Bestandteile nach innen gelangen. Silikatisches Material verblieb überwiegend im Mantel. Daraus entwickelte sich die grobe Schichtung der Erde.',
    subtitle:'Die Schichtung ist real, doch ihre Entstehung lässt sich nicht auf einen einzigen Moment reduzieren. Der gezeigte Querschnitt ist stark vereinfacht.',
    limit:'Die Kreise im Modell zeigen weder maßstabsgerechte Schichtdicken noch einen gemessenen frühhadeischen Aufbau.',
    observed:'Die heutige Erddichte und seismische Untersuchungen zeigen Kern und Mantel. Eisenmeteorite liefern zusätzliche Vergleichshinweise.',
    interpreted:'Metall-Silikat-Trennung ist ein plausibler Mechanismus, der mit Aufheizung und Akkretion zusammenhing.',
    open:'In welchen Schritten und bei welchen Temperaturen und Drücken erfolgte die Kernbildung?',
    foot:'KERN / MANTEL / STARK VEREINFACHTER SCHNITT'
  },{
    name:'Erste Kruste',tag:'PROZESS 03 / ERSTARRUNG',label:'OBERFLÄCHE / MINERALE',view:'surface',
    intro:'Aus Schmelzen kann feste Kruste kristallisieren. Vieles von der ältesten Kruste wurde später verändert oder recycelt. Einzelne Minerale können dennoch wesentlich ältere Zustände bewahren als die Gesteine, in denen wir sie heute finden.',
    subtitle:'Zirkone aus den Jack Hills in Australien erreichen ein Alter um 4,4 Milliarden Jahre und gehören zu den ältesten erhaltenen irdischen Mineralen.',
    limit:'Ein einzelner 4,4 Milliarden Jahre alter Zirkon ist kein vollständiges Stück einer unversehrten 4,4 Milliarden Jahre alten Erdoberfläche.',
    observed:'Das Kristallalter eines Zirkons lässt sich unter geeigneten Bedingungen über Uran-Blei-Isotope messen.',
    interpreted:'Chemische Signaturen erlauben Hypothesen über frühe Schmelzen und teilweise über Wechselwirkungen mit Wasser.',
    open:'Welche Teile der frühesten Kruste existierten, und wie viel davon wurde später vollständig umgewandelt?',
    foot:'ALTE MINERALE / INDIREKTE SPUREN'
  },{
    name:'Wasser & Atmosphäre',tag:'PROZESS 04 / FLÜCHTIGE STOFFE',label:'GASE / HYDROSPHÄRE',view:'atmosphere',
    intro:'Wasser und Gase konnten aus dem Erdinneren freigesetzt und durch frühes Material des Sonnensystems eingebracht werden. Wann dauerhaft flüssiges Wasser an der Oberfläche existierte, wird anhand indirekter Spuren untersucht.',
    subtitle:'Die Sauerstoffisotope mancher sehr alter Zirkone werden als Hinweis auf frühzeitige Wechselwirkungen mit flüssigem Wasser interpretiert.',
    limit:'Ein frühes Wassersignal zeigt keine nachgewiesenen Weltmeere zu einer exakten Jahreszahl. Die Zusammensetzung der damaligen Atmosphäre ist nicht direkt gemessen.',
    observed:'Zirkon-Isotope, Mineralchemie, Meteoriten und spätere Gesteinsarchive enthalten Hinweise zu frühen Stoffkreisläufen.',
    interpreted:'Flüssiges Wasser könnte schon in einem Teil des Hadaikums auf oder nahe der Oberfläche vorhanden gewesen sein.',
    open:'Welche Quellen hatten Wasser und flüchtige Stoffe? Wie sah die Atmosphäre zeitweise aus?',
    foot:'WASSER / ATMOSPHÄRE / HYPOTHESEN'
  }
 ];
 const buttons=[...document.querySelectorAll('[data-phase]')];
 const views=[...document.querySelectorAll('[data-view]')];
 function activateView(name){
   if(!['surface','section','atmosphere'].includes(name))return;
   stage.dataset.view=name;
   views.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===name)));
   stage.setAttribute('aria-label','Schematisches Erdemodell, Ansicht '+({surface:'Oberfläche',section:'Querschnitt',atmosphere:'Atmosphäre und Wasser'})[name]+'. Kein naturwissenschaftlich berechnetes Modell.');
 }
 function activate(index){
   if(!Number.isInteger(index)||index<0||index>=processes.length)return;
   const p=processes[index];
   stage.dataset.phase=String(index);
   buttons.forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.phase)===index)));
   for(const [id,value] of Object.entries({
      'young-step-label':p.tag,'young-title':p.name,'young-intro':p.intro,
      'young-subtitle':p.subtitle,'young-limit':p.limit,'young-observed':p.observed,
      'young-interpreted':p.interpreted,'young-open':p.open,
      'young-visual-label':p.label,'young-stage-foot':p.foot
   }))$(id).textContent=value;
   activateView(p.view);
 }
 buttons.forEach(b=>b.addEventListener('click',()=>activate(Number(b.dataset.phase))));
 views.forEach(b=>b.addEventListener('click',()=>activateView(b.dataset.view)));
 activate(0);
 window.YoungEarthUI=Object.freeze({select:activate,view:activateView});
})();