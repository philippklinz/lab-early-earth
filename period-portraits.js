/* Interactive geological portraits: accessible SVG illustrations and local notes. */
(() => {
'use strict';
const G=window.GeoTime,D=window.GeoPortraitsData,$=id=>document.getElementById(id);
if(!G||!D||!$('portrait-panel'))return;

const picture={
 magma:['Planetarisches Aufschmelzen','<ellipse cx="275" cy="151" rx="193" ry="66" transform="rotate(-20 275 151)" stroke="#91c8b8" stroke-width="2" stroke-dasharray="6 9"/><circle cx="275" cy="151" r="105" fill="#a9513c" stroke="#e8ae7b" stroke-width="3"/><path d="M211 120q42-35 69 5t60-5M220 187q46-30 60 4t55-8" fill="none" stroke="#ffbb86" stroke-width="11" stroke-linecap="round"/><circle cx="97" cy="93" r="13" fill="#ce916e"/><circle cx="445" cy="222" r="8" fill="#a7b7a4"/>'],
 rock:['Alte Gesteinsarchive','<path d="M15 235L113 118 216 200 312 77 431 215 548 136V280H15Z" fill="#577982"/><path d="M15 245l140-44 98 49 128-68 167 49M15 268l148-22 114 23 122-28 149 19" stroke="#c2ab96" stroke-width="11" fill="none"/><path d="M113 118L86 156l31-13 37 43M312 77l-34 70 37-21 26 49" stroke="#d4e3d4" stroke-width="4" fill="none"/>'],
 microbes:['Mikrobielle Lebensräume','<path d="M15 243q136-45 268 0t262-14" stroke="#5d9f96" stroke-width="18" fill="none"/><g fill="#3e918d" stroke="#b4e7d6" stroke-width="3"><ellipse cx="145" cy="134" rx="64" ry="37" transform="rotate(-14 145 134)"/><ellipse cx="338" cy="113" rx="71" ry="35" transform="rotate(25 338 113)"/><circle cx="454" cy="189" r="25"/></g><g fill="#d9f2c8"><circle cx="128" cy="133" r="10"/><circle cx="165" cy="135" r="8"/><circle cx="328" cy="109" r="10"/><circle cx="361" cy="121" r="7"/><circle cx="453" cy="188" r="8"/></g>'],
 iron:['Eisenreiche Sedimentschichten','<path d="M0 250q140-36 280-5t280-23v58H0Z" fill="#6d7b83"/><path d="M10 195q128-31 262-2t278-22" stroke="#b56b4f" stroke-width="25" fill="none"/><path d="M10 229q128-31 262-2t278-22" stroke="#b2c2ba" stroke-width="17" fill="none"/><path d="M10 157q128-31 262-2t278-22" stroke="#d9ac86" stroke-width="17" fill="none"/><circle cx="430" cy="70" r="28" stroke="#e0bf9b" stroke-width="7" fill="none"/>'],
 oxygen:['Veränderungen von Atmosphäre und Ozean','<circle cx="270" cy="141" r="105" fill="#244e65" stroke="#79b6bd" stroke-width="3"/><path d="M180 141q73-61 171-4M190 183q81 39 153-9" stroke="#93cfaf" stroke-width="14" fill="none"/><g fill="#61c5b5" stroke="#d5efe3" stroke-width="4"><circle cx="104" cy="85" r="22"/><circle cx="141" cy="73" r="22"/><circle cx="420" cy="169" r="24"/><circle cx="460" cy="151" r="24"/></g><path d="M123 80l15-5m304 84 16-6" stroke="#ecf7e9" stroke-width="7"/>'],
 ice:['Schematische Vereisung','<path d="M0 235L105 93 188 199 298 72 384 185 466 124 560 238v40H0Z" fill="#8abecf"/><path d="M105 93l-28 85 27-23 27 34 57 10M298 72l-43 89 47-25 22 39 60 10M466 124l-23 63 24-15 34 39" fill="#e0f6ee"/><path d="M0 258q130-32 260 0t300-16" stroke="#b8dddf" stroke-width="9" fill="none"/>'],
 sea:['Reiche Meereslebensräume','<path d="M0 77q55-26 110 0t110 0 110 0 110 0 110 0M0 110q55-26 110 0t110 0 110 0 110 0 110 0" stroke="#4a9dac" stroke-width="4" fill="none"/><ellipse cx="240" cy="196" rx="99" ry="49" fill="#347e83" stroke="#c9dfc6" stroke-width="4"/><ellipse cx="240" cy="196" rx="20" ry="43" fill="#9dcdb3"/><path d="M160 175l-40-24m40 44-46 0m46 22-40 27m200-73 39-24m-39 47 42 0m-42 22 41 28" stroke="#b6d7cc" stroke-width="4"/><path d="M411 180q41-31 61 11t-34 42q-26-11-13-30t25 1" fill="none" stroke="#e8c19b" stroke-width="10"/>'],
 reef:['Marine Fossilien und Riffe','<path d="M0 262q140-41 280 0t280-22" stroke="#5a9991" stroke-width="15" fill="none"/><g stroke="#8ed2bc" fill="none" stroke-width="11" stroke-linecap="round"><path d="M121 256V143m0 42-46-38m46 24 47-40M301 257V101m0 42-39-31m39 70 61-43M432 253V170m0 38 42-26"/></g><g fill="#dcb68d"><circle cx="74" cy="140" r="13"/><circle cx="363" cy="120" r="16"/><ellipse cx="502" cy="220" rx="27" ry="15"/></g>'],
 land:['Pflanzen erobern das Land','<path d="M0 260q150-58 280-12t280-17v49H0Z" fill="#4e8079"/><g stroke="#a6d0ac" stroke-width="9" fill="none" stroke-linecap="round"><path d="M117 246V112m0 49-41-35m41 45 48-35M297 246V91m0 42-38-27m38 48 48-31M443 243V145m0 36-31-34m31 48 40-28"/></g><g fill="#b0dfb0"><ellipse cx="76" cy="127" rx="20" ry="10"/><ellipse cx="165" cy="137" rx="21" ry="9"/><ellipse cx="344" cy="124" rx="24" ry="9"/></g>'],
 forest:['Wald- und Sumpflandschaft','<path d="M0 264q145-37 280-3t280-28" stroke="#678a73" stroke-width="19" fill="none"/><g stroke="#b9c79b" stroke-width="12"><path d="M133 254V76M282 262V62M429 253V102"/></g><g stroke="#86d1ab" stroke-width="6" fill="none" stroke-linecap="round"><path d="M133 98q-67-70-104-5M133 98q69-67 104-8M282 90q-65-79-110-20M282 90q61-76 117-5M429 116q-51-63-83-17M429 116q70-61 110 0"/></g>'],
 mountain:['Gebirgsbildung und Krustendynamik','<path d="M0 264L113 103 217 220 335 69 448 224 518 150 560 243v34H0Z" fill="#567681"/><path d="M113 103l-40 80 40-21 35 42 69 16M335 69l-48 84 48-23 31 45 82 49M518 150l-24 53 24-14 42 54" fill="#ccded6"/><circle cx="72" cy="69" r="23" fill="#86c4be"/>'],
 desert:['Trockene Landschaften und Großkontinente','<circle cx="407" cy="88" r="37" fill="#e0b47f"/><path d="M0 245q125-103 230-23t220-24q60-36 110 19v63H0Z" fill="#b78669"/><path d="M0 261q150-48 270-11t290-25M45 222q88-49 168 0M355 245q92-58 175-12" stroke="#e4ba93" stroke-width="7" fill="none"/>'],
 dinosaur:['Dinosaurier als Symbol des Mesozoikums','<path d="M0 265q130-34 280 0t280-20" stroke="#629287" stroke-width="12" fill="none"/><path d="M162 211q45-66 131-25 40-24 47-104l21-13 25 11-5 20-17 7q-4 82-66 106l-22 13-5 38h-21l2-48-46 3-11 46h-19l5-47-37-8-49-35-51-3-6-17 82 7" fill="#86b5a6" stroke="#d0e8d8" stroke-width="4"/><circle cx="362" cy="89" r="4" fill="#15333b"/>'],
 mammal:['Säugetiere und wechselnde Ökosysteme','<path d="M0 256q150-39 280 0t280-21" stroke="#6a9985" stroke-width="14" fill="none"/><path d="M155 216q35-57 104-43 42 5 60 31l39-9 26 24-25 17-33-6-13 33h-18l-4-42-52 4-12 38h-18l-6-43-21 4-15 41h-20l9-46" fill="#c3aa87" stroke="#e5d7bd" stroke-width="4"/><path d="M65 242V113m0 41-39-30m39 26 47-33M469 247V123m0 40-32-31m32 18 41-24" stroke="#8ad0b1" stroke-width="10" fill="none"/>'],
 human:['Mensch und eiszeitliche Landschaft','<path d="M0 260l110-101 63 66 124-137 90 141 61-77 112 106v26H0Z" fill="#6c91a2"/><path d="M297 88l-37 71 37-16 23 41 67 45M448 152l-22 47 22-17 34 27" fill="#d7e9e6"/><circle cx="105" cy="133" r="18" fill="#e2c09d"/><path d="M105 155v65m0-56-28 27m28-27 30 30m-30 26-25 43m25-43 26 43" stroke="#e2c09d" stroke-width="9" stroke-linecap="round"/>']
};
const storageKey='lab01-geological-portraits-notes-v1';
const maxNote=5000;
let notes={};
try { const n=JSON.parse(localStorage.getItem(storageKey)||'{}');if(n&&typeof n==='object'&&!Array.isArray(n))notes=n; } catch {}
let current=G.byId.get('had');
const set=(id,text)=>{if($(id))$(id).textContent=text};
const make=(tag,text,className)=>{const el=document.createElement(tag);if(className)el.className=className;el.textContent=text;return el};
const peers=u=>G.units.filter(x=>x.rank===u.rank).sort((a,b)=>b.old-a.old);
function render(unit) {
  if(!unit || !D.byId.has(unit.id))return;
  current=unit;
  const item=D.byId.get(unit.id);
  $('portrait-panel').style.setProperty('--portrait-accent',unit.color);
  set('portrait-name',unit.name);
  set('portrait-breadcrumb',G.path(unit.id).map(x=>x.name).join(' / '));
  set('portrait-tagline',item.tagline);
  set('portrait-definition',item.definition);
  set('portrait-boundary',item.boundary);
  set('portrait-caution',item.clarity);
  set('portrait-memo',item.memo);
  set('portrait-period',G.fmt(unit.old)+' – '+G.fmt(unit.young));
  set('portrait-graphic-identity',G.ranks[unit.rank].toUpperCase()+' / '+unit.name.toUpperCase());
  const drawing=picture[item.scene]||picture.rock;
  $('portrait-illustration').innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 300" role="img" aria-hidden="true"><rect x="0" y="0" width="560" height="300" fill="transparent"/>'+drawing[1]+'</svg>';
  $('portrait-illustration').setAttribute('aria-label',drawing[0]+'; rein symbolische Illustration.');
  set('portrait-graphic-caption','SYMBOLISCHE SKIZZE / '+drawing[0].toUpperCase()+'. Keine Rekonstruktion einer konkreten Fundstelle.');
  const parent=unit.parent?G.byId.get(unit.parent):{old:G.MAX,young:0,name:'Erdgeschichte'};
  const span=parent.old-parent.young;
  const pos=100*(parent.old-unit.old)/span;
  const size=100*(unit.old-unit.young)/span;
  $('portrait-context-band').style.left=pos+'%';$('portrait-context-band').style.width=size+'%';
  set('portrait-parent-label',parent.name+' · maßstabsgerecht');
  set('portrait-context-older',G.fmt(parent.old));
  set('portrait-context-younger',G.fmt(parent.young));
  const features=$('portrait-feature-grid');features.replaceChildren();
  for(let i=0;i<item.highlights.length;i++){
    const card=make('div','','portrait-feature');
    card.append(make('span',['01 / ERDWELT','02 / LEBEN','03 / SPUREN IM GESTEIN'][i]));
    card.append(make('p',item.highlights[i]));features.append(card);
  }
  const sourceEl=$('portrait-source-links');sourceEl.replaceChildren();
  for(const key of item.refs){
    const source=D.sources[key];if(!source)continue;
    const anchor=make('a',source.title+' ↗');
    anchor.href=source.url;anchor.target='_blank';anchor.rel='noopener noreferrer';
    sourceEl.append(anchor);
  }
  const siblings=peers(unit),n=siblings.findIndex(x=>x.id===unit.id);
  const prev=$('portrait-prev'),next=$('portrait-next');
  prev.disabled=n<=0;next.disabled=n===siblings.length-1;
  prev.dataset.unit=siblings[n-1]?.id||'';next.dataset.unit=siblings[n+1]?.id||'';
  prev.textContent=n>0?'← '+siblings[n-1].name:'← Älter';
  next.textContent=n<siblings.length-1?siblings[n+1].name+' →':'Jünger →';
  $('portrait-notes').value=typeof notes[unit.id]==='string'?notes[unit.id]:'';
  set('portrait-notes-status',notes[unit.id]?'Eigene Notiz lokal vorhanden.':'Noch keine Notiz für diesen Abschnitt.');
  set('portrait-note-count',Object.values(notes).filter(x=>typeof x==='string'&&x.trim()).length+' / '+G.units.length+' Abschnitte mit Notizen.');
  const hash='#unit='+unit.id;
  if(location.hash!==hash&&history.replaceState)history.replaceState(null,'',location.pathname+location.search+hash);
}
window.addEventListener('geo-unit-selected',event=>{
 const id=typeof event.detail==='string'?event.detail:event.detail?.id;
 if(G.byId.has(id))render(G.byId.get(id));
});
for(const id of ['portrait-prev','portrait-next']){
 $(id).addEventListener('click',()=>{
   const target=$(id).dataset.unit;
   if(target)window.dispatchEvent(new CustomEvent('geo-portrait-navigate',{detail:{id:target}}));
 });
}
$('portrait-read').addEventListener('click',()=>{
 $('portrait-panel').scrollIntoView({behavior:window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
 $('portrait-name').focus({preventScroll:true});
});
$('portrait-copy-link').addEventListener('click',async()=>{
 const link=new URL(location.href);link.hash='unit='+current.id;
 try{await navigator.clipboard.writeText(link.href);set('portrait-copy-link','✓ Link kopiert')}
 catch{set('portrait-copy-link','Link steht in der Adresszeile')}
});
$('portrait-notes').addEventListener('input',event=>{
 const value=event.currentTarget.value.slice(0,maxNote);
 if(value.trim())notes[current.id]=value;else delete notes[current.id];
 try{
   localStorage.setItem(storageKey,JSON.stringify(notes));
   set('portrait-notes-status','Lokal gespeichert · '+value.length+' / '+maxNote+' Zeichen.');
 }catch{set('portrait-notes-status','Speichern nicht möglich. Bitte Text kopieren oder Datei exportieren.')}
 set('portrait-note-count',Object.keys(notes).length+' / '+G.units.length+' Abschnitte mit Notizen.');
});
$('portrait-clear-note').addEventListener('click',()=>{
 if(!notes[current.id]||!confirm('Eigene Notiz zu '+current.name+' löschen?'))return;
 delete notes[current.id];$('portrait-notes').value='';
 try{localStorage.setItem(storageKey,JSON.stringify(notes))}catch{}
 set('portrait-notes-status','Notiz gelöscht.');
 set('portrait-note-count',Object.keys(notes).length+' / '+G.units.length+' Abschnitte mit Notizen.');
});
$('portrait-export').addEventListener('click',()=>{
 const payload={format:'learning-lab01-geonotes',version:1,exported:new Date().toISOString(),notes};
 const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
 const address=URL.createObjectURL(blob),anchor=document.createElement('a');
 anchor.href=address;anchor.download='geologische-notizen.json';document.body.append(anchor);anchor.click();anchor.remove();
 setTimeout(()=>URL.revokeObjectURL(address),1200);
 set('portrait-notes-status','Notizen als JSON-Datei exportiert.');
});
$('portrait-import').addEventListener('change',async e=>{
 const file=e.currentTarget.files?.[0];if(!file)return;
 try{
   if(file.size>200000)throw new Error('Datei zu groß.');
   const data=JSON.parse(await file.text());
   if(data?.format!=='learning-lab01-geonotes'||data?.version!==1||!data.notes||typeof data.notes!=='object'||Array.isArray(data.notes))throw new Error('Ungültige Sicherungsdatei.');
   const safe={};
   for(const [id,text] of Object.entries(data.notes))if(G.byId.has(id)&&typeof text==='string')safe[id]=text.slice(0,maxNote);
   if(!confirm('Vorhandene Notizen durch '+Object.keys(safe).length+' importierte Notizen ersetzen?'))return;
   localStorage.setItem(storageKey,JSON.stringify(safe));notes=safe;render(current);
   set('portrait-notes-status','Notizen importiert und gespeichert.');
 }catch(error){set('portrait-notes-status','Import fehlgeschlagen: '+String(error.message||error))}
 finally{e.currentTarget.value=''}
});
const match=location.hash.match(/^#unit=([a-z0-9_-]+)$/);
render(G.byId.get(match?.[1])||G.byId.get('had'));
window.GeoPortraitUI=Object.freeze({get selected(){return current.id},render});
})();