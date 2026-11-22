/* Geological Time — teaching dataset, ICS 2026/06.
 * Source: International Commission on Stratigraphy, chart v2026/06
 * https://stratigraphy.org/chart/ (CC BY 4.0).
 * Ages in Ma before present. Numerical ages are approximate calibrations;
 * for the Phanerozoic and Ediacaran, ratified GSSPs define boundaries.
 * German translations are editorial, not an official ICS translation.
 */
(() => {
  'use strict';
  const U = (id, name, rank, old, young, parent, color, fact = '', note = '') =>
    ({ id, name, rank, old, young, parent, color, fact, note });
  const units = [
    U('had','Hadaikum','eon',4567,4031,null,'#b97962','Beginn der Erdgeschichte; frühe Akkretion und Differentiation.','Die Erde entstand über einen Zeitraum; 4567 Ma ist keine punktgenau gemessene Geburtsstunde.'),
    U('arc','Archaikum','eon',4031,2500,null,'#8e667e','Sehr alte Krustenreste; frühe geochemische und biologische Spuren.','Die Grenze um 4031 Ma hat eine numerische Unsicherheit von ±3 Ma.'),
    U('pro','Proterozoikum','eon',2500,538.8,null,'#687fa0','Atmosphäre, Ozeane und biologische Entwicklung über enorme Zeiträume.'),
    U('pha','Phanerozoikum','eon',538.8,0,null,'#3e9a88','Fossilienreiche Abschnitte der Erdgeschichte.','Die numerische Basis des Phanerozoikums wird mit 538,8 ±0,6 Ma angegeben.'),
    U('eoarc','Eoarchaikum','era',4031,3600,'arc','#977383','Die älteste Ära des Archaikums.'),
    U('palearc','Paläoarchaikum','era',3600,3200,'arc','#8d7185','Eine Ära des Archaikums.'),
    U('mesoarc','Mesoarchaikum','era',3200,2800,'arc','#816580','Eine Ära des Archaikums.'),
    U('neoarc','Neoarchaikum','era',2800,2500,'arc','#745b77','Die jüngste Ära des Archaikums.'),
    U('paleopro','Paläoproterozoikum','era',2500,1600,'pro','#6987ad','Früher Abschnitt des Proterozoikums.'),
    U('mesopro','Mesoproterozoikum','era',1600,1000,'pro','#5e7da8','Mittlerer Abschnitt des Proterozoikums.'),
    U('neopro','Neoproterozoikum','era',1000,538.8,'pro','#51749e','Jüngster Abschnitt vor dem Phanerozoikum.'),
    U('paleo','Paläozoikum','era',538.8,251.902,'pha','#629b76','Erdaltertum; sechs Perioden von Kambrium bis Perm.'),
    U('meso','Mesozoikum','era',251.902,66,'pha','#5b83a7','Erdmittelalter; Trias, Jura und Kreide.'),
    U('ceno','Känozoikum','era',66,0,'pha','#c49b5b','Erdneuzeit; Paläogen, Neogen und Quartär.'),
    U('sider','Siderium','period',2500,2300,'paleopro','#8199bc'),
    U('rhyac','Rhyacium','period',2300,2050,'paleopro','#7893b7'),
    U('orosi','Orosirium','period',2050,1800,'paleopro','#6e8bb0'),
    U('stath','Statherium','period',1800,1600,'paleopro','#6281a7'),
    U('calym','Calymmium','period',1600,1400,'mesopro','#7493b7'),
    U('ectas','Ectasium','period',1400,1200,'mesopro','#6c8aac'),
    U('steni','Stenium','period',1200,1000,'mesopro','#6283a7'),
    U('ton','Tonium','period',1000,720,'neopro','#6991b6'),
    U('cryo','Cryogenium','period',720,635,'neopro','#789bad'),
    U('edia','Ediacarium','period',635,538.8,'neopro','#7a92b0','Vor dem Kambrium; die Ediacarium-Basis wird durch einen GSSP definiert.'),
    U('camb','Kambrium','period',538.8,486.85,'paleo','#69ab80','Frühe Phase der starken Diversifizierung tierischer Fossilien.'),
    U('ordo','Ordovizium','period',486.85,443.1,'paleo','#65a77e'),
    U('silu','Silur','period',443.1,419.62,'paleo','#76a97a'),
    U('devo','Devon','period',419.62,358.86,'paleo','#89ae78'),
    U('carb','Karbon','period',358.86,298.9,'paleo','#6d9678'),
    U('perm','Perm','period',298.9,251.902,'paleo','#b67c6f','Endet an der großen Perm-Trias-Grenze.'),
    U('tria','Trias','period',251.902,201.4,'meso','#9c80a7'),
    U('jura','Jura','period',201.4,143.1,'meso','#75a0b2','','Die Grenze Jura–Kreide hat in der Quelle eine Näherungsangabe (~143,1 Ma).'),
    U('cret','Kreide','period',143.1,66,'meso','#79b0a1'),
    U('palg','Paläogen','period',66,23.04,'ceno','#d4ae71'),
    U('neog','Neogen','period',23.04,2.58,'ceno','#cda35d'),
    U('quat','Quartär','period',2.58,0,'ceno','#e1c48a')
  ];
  const byId = new Map(units.map(u => [u.id,u]));
  const ranks={eon:'Äon',era:'Ära',period:'Periode'};
  const fmt = n => n === 0 ? 'heute' : new Intl.NumberFormat('de-DE',{maximumFractionDigits:3}).format(n) + ' Ma';
  const children = parent => units.filter(u=>u.parent===parent).sort((a,b)=>b.old-a.old);
  const path = id => {const a=[];let u=byId.get(id);while(u){a.unshift(u);u=byId.get(u.parent)}return a};
  const phanerozoic=units.filter(u=>u.rank==='period'&&['paleo','meso','ceno'].includes(u.parent)).sort((a,b)=>b.old-a.old);
  const eons=units.filter(u=>u.rank==='eon').sort((a,b)=>b.old-a.old);
  const eras=units.filter(u=>u.rank==='era'&&u.parent==='pha').sort((a,b)=>b.old-a.old);
  Object.assign(window,{GeoTime:Object.freeze({
    version:'2026/06', source:'https://stratigraphy.org/chart/',
    license:'CC BY 4.0 — International Commission on Stratigraphy',
    MAX:4567,units,byId,ranks,fmt,children,path,phanerozoic,eons,eras
  })});
})();
