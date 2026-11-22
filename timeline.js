/* Geological Time Explorer v0.1 — static, no runtime dependencies. */
(() => {
'use strict';
const G=window.GeoTime;
if(!G)return;
const $=id=>document.getElementById(id);
const lanes={eon:$('lane-eon'),era:$('lane-era'),period:$('lane-period')};
if(!lanes.eon||!lanes.era||!lanes.period)return;
const PRESETS={all:[4567,0],precambrian:[4567,538.8],phan:[538.8,0],paleo:[538.8,251.902],meso:[251.902,66],ceno:[66,0]};
const TOTAL=4567,MIN_SPAN=.2;
const requestedUnit=(location.hash.match(/^#unit=([a-z0-9_-]+)$/)||[])[1];
let view={old:TOTAL,young:0},selected=G.byId.get(requestedUnit)||G.byId.get('had'),mask=false,drag=null;
const fmt=n=>G.fmt(n);
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));

function setWindow(old,young){
  const span=clamp(old-young,MIN_SPAN,TOTAL),mid=(old+young)/2;
  const older=clamp(mid+span/2,span,TOTAL);
  view={old:older,young:older-span};render();
}
function zoom(factor,focus=(view.old+view.young)/2){
  const span=view.old-view.young,smaller=clamp(span*factor,MIN_SPAN,TOTAL);
  const t=clamp((view.old-focus)/span,0,1);
  const older=clamp(focus+t*smaller,smaller,TOTAL);
  setWindow(older,older-smaller);
}
function focusUnit(unit){
  if(!unit)return;
  select(unit);
  const margin=Math.max((unit.old-unit.young)*.055,.02);
  setWindow(Math.min(TOTAL,unit.old+margin),Math.max(0,unit.young-margin));
}
function select(unit){
  if(!unit)return;
  selected=unit;
  $('inspector-name').textContent=unit.name;
  $('inspector-path').textContent=G.path(unit.id).map(x=>x.name).join(' / ');
  $('inspector-old').textContent=fmt(unit.old);
  $('inspector-young').textContent=fmt(unit.young);
  $('inspector-duration').textContent=fmt(unit.old-unit.young);
  $('inspector-rank').textContent=G.ranks[unit.rank];
  $('inspector-fact').textContent=unit.fact||'Teil der international definierten geologischen Zeitskala.';
  $('inspector-note').textContent=unit.note||'Numerische Alter dienen der Kalibrierung und können revidiert werden.';
  $('parent-selection').hidden=!unit.parent;
  renderLanes();
  window.dispatchEvent(new CustomEvent('geo-unit-selected',{detail:{id:unit.id}}));
}
function renderTicks(){
 const scale=$('time-scale'),span=view.old-view.young;
 scale.replaceChildren();
 const rough=span/6,power=Math.pow(10,Math.floor(Math.log10(rough)));
 const step=[1,2,5,10].map(v=>v*power).find(v=>v>=rough)||power*10;
 let count=0;
 for(let age=Math.floor(view.old/step)*step;age>=view.young-1e-9&&count<14;age-=step){
   if(age<0)continue;
   const x=(view.old-age)/span*100;
   if(x<-.01||x>100.01)continue;
   const tick=document.createElement('div');
   tick.className='earth-time-tick'+(x>89?' right':'');tick.style.left=clamp(x,0,100)+'%';
   const text=document.createElement('span');
   text.textContent=Number(age.toFixed(step>=10?0:3)).toLocaleString('de-DE')+' Ma';
   tick.append(text);scale.append(tick);count++;
 }
 $('time-window').textContent=fmt(view.old)+' – '+fmt(view.young);
 $('scale-note').textContent=span>1000
 ?'Maßstabstreu: Jüngere Perioden sind auf der Gesamtansicht zu schmal zum Lesen. Vergrößere das Phanerozoikum.'
 :span>180?'Im Phanerozoikum werden die zwölf Perioden erkennbar. Klicke auf einen Abschnitt oder zoome weiter.'
 :'Detailansicht. Wähle einen Balken oder nutze die Einheitenliste für präzise Navigation.';
}
function renderLanes(){
 const span=view.old-view.young;
 for(const rank of ['eon','era','period']){
   const lane=lanes[rank];lane.replaceChildren();
   const label=document.createElement('div');
   label.className='earth-lane-label';
   label.textContent={eon:'ÄON',era:'ÄRA',period:'PERIODE'}[rank];
   lane.append(label);
   const visible=G.units.filter(u=>u.rank===rank&&u.old>view.young&&u.young<view.old);
   for(const unit of visible){
     const old=Math.min(unit.old,view.old),young=Math.max(unit.young,view.young);
     const width=(old-young)/span*100;if(width<=0)continue;
     const left=(view.old-old)/span*100;
     const button=document.createElement('button');
     button.type='button';
     button.className='earth-band'+(unit.id===selected.id?' selected':'')+(width<6?' tiny':'');
     button.style.left=left+'%';button.style.width=width+'%';button.style.background=unit.color;
     button.title=mask?('Namen ausgeblendet · '+fmt(unit.old)+' – '+fmt(unit.young)):(unit.name+' · '+fmt(unit.old)+' – '+fmt(unit.young));
     button.setAttribute('aria-label',mask?('Name verdeckt, '+G.ranks[rank]+' von '+fmt(unit.old)+' bis '+fmt(unit.young)+'. Zum Aufdecken auswählen.'):(G.ranks[rank]+' '+unit.name+', '+fmt(unit.old)+' bis '+fmt(unit.young)));
     const inner=document.createElement('div');inner.className='earth-band-inner';
     const labelText=document.createElement('span');labelText.textContent=mask?'?':unit.name;
     inner.append(labelText);button.append(inner);
     button.addEventListener('click',()=>select(unit));
     button.addEventListener('dblclick',e=>{e.preventDefault();focusUnit(unit)});
     lane.append(button);
   }
 }
}
function renderPresetButtons(){
 for(const button of document.querySelectorAll('[data-preset]')){
   const pair=PRESETS[button.dataset.preset];
   const pressed=pair&&Math.abs(view.old-pair[0])<.01&&Math.abs(view.young-pair[1])<.01;
   button.classList.toggle('active',pressed);
   button.setAttribute('aria-pressed',String(!!pressed));
 }
}
function render(){renderTicks();renderLanes();renderPresetButtons()}
function renderOverview(){
 const overview=$('earth-overview');overview.replaceChildren();
 for(const unit of G.eons){
   const button=document.createElement('button');
   button.type='button';button.style.flex=(unit.old-unit.young)+' 1 0';
   button.style.background=unit.color;button.title=unit.name+', '+fmt(unit.old)+' bis '+fmt(unit.young);
   button.setAttribute('aria-label',unit.name+' anzeigen');
   button.addEventListener('click',()=>focusUnit(unit));
   overview.append(button);
 }
}
function renderDirectory(){
 const root=$('unit-directory');root.replaceChildren();
 const groups=[{title:'4 Äonen',items:G.eons},{title:'Ären',items:G.units.filter(u=>u.rank==='era').sort((a,b)=>b.old-a.old)},{title:'Perioden',items:G.units.filter(u=>u.rank==='period').sort((a,b)=>b.old-a.old)}];
 for(const group of groups){
   const section=document.createElement('section');
   const heading=document.createElement('h3');heading.textContent=group.title;section.append(heading);
   const list=document.createElement('ul');list.className='earth-unit-list';
   for(const unit of group.items){
     const li=document.createElement('li'),button=document.createElement('button');
     button.type='button';button.style.setProperty('--band-color',unit.color);
     const left=document.createElement('span'),name=document.createElement('b'),subtitle=document.createElement('small');
     name.textContent=unit.name;
     subtitle.textContent=G.path(unit.id).slice(0,-1).map(x=>x.name).join(' / ')||'Erdgeschichte';
     left.append(name,subtitle);
     const age=document.createElement('span');age.className='unit-age';age.textContent=fmt(unit.old);
     button.append(left,age);li.append(button);list.append(li);
     button.addEventListener('click',()=>{
       focusUnit(unit);
       const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
       $('inspector').scrollIntoView({behavior:reduce?'instant':'smooth',block:'nearest'});
     });
   }
   section.append(list);root.append(section);
 }
}
for(const button of document.querySelectorAll('[data-preset]')){
 button.addEventListener('click',()=>{const pair=PRESETS[button.dataset.preset];if(pair)setWindow(pair[0],pair[1])});
}
$('zoom-in').addEventListener('click',()=>zoom(.55));
$('zoom-out').addEventListener('click',()=>zoom(1.8));
$('reset-view').addEventListener('click',()=>setWindow(TOTAL,0));
$('focus-selection').addEventListener('click',()=>focusUnit(selected));
$('parent-selection').addEventListener('click',()=>{const parent=G.byId.get(selected.parent);if(parent)focusUnit(parent)});
$('mask-toggle').addEventListener('click',e=>{
 mask=!mask;e.currentTarget.setAttribute('aria-pressed',String(mask));
 e.currentTarget.textContent=mask?'◉ Namen anzeigen':'◐ Namen ausblenden';
 renderLanes();
});
const host=$('time-lanes');
let suppressClickUntil=0;
host.addEventListener('pointerdown',e=>{
 if(e.button!==0)return;
 drag={x:e.clientX,old:view.old,young:view.young,moved:false,pointerId:e.pointerId};
});
host.addEventListener('pointermove',e=>{
 if(!drag)return;
 const dx=e.clientX-drag.x;
 // A normal click still selects the underlying geological unit.
 if(!drag.moved&&Math.abs(dx)<6)return;
 if(!drag.moved){
   drag.moved=true;
   host.classList.add('dragging');
   if(host.setPointerCapture)host.setPointerCapture(drag.pointerId);
 }
 const width=Math.max(1,host.getBoundingClientRect().width);
 const shift=dx/width*(drag.old-drag.young);
 const span=drag.old-drag.young;
 const old=clamp(drag.old+shift,span,TOTAL);
 view={old,young:old-span};render();
});
function endDrag(){
 if(drag?.moved)suppressClickUntil=Date.now()+220;
 drag=null;host.classList.remove('dragging');
}
host.addEventListener('pointerup',endDrag);
host.addEventListener('pointercancel',endDrag);
host.addEventListener('click',e=>{
 if(Date.now()<suppressClickUntil){e.stopPropagation();e.preventDefault()}
},true);
host.addEventListener('wheel',e=>{
 if(!e.ctrlKey&&!e.metaKey)return;
 e.preventDefault();
 const box=host.getBoundingClientRect();
 const x=clamp((e.clientX-box.left)/Math.max(box.width,1),0,1);
 zoom(e.deltaY>0?1.18:.82,view.old-x*(view.old-view.young));
},{passive:false});
window.addEventListener('geo-portrait-navigate',event=>{
  const target=G.byId.get(event.detail?.id);
  if(!target)return;
  focusUnit(target);
  const profile=$('portrait-panel');
  if(profile){
    const reduce=window.matchMedia?.('(prefers-reduced-motion:reduce)').matches;
    profile.scrollIntoView({behavior:reduce?'instant':'smooth',block:'start'});
  }
});
renderOverview();renderDirectory();select(selected);
if(requestedUnit&&G.byId.has(requestedUnit))focusUnit(selected);
else setWindow(TOTAL,0);
})();