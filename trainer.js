/* Geological Time Trainer v0.1.
 * Local-only active recall; uses the same ICS 2026/06 dataset as timeline.js.
 * Intervals are a simple educational heuristic, not a calibrated algorithm. */
(() => {
'use strict';
const G=window.GeoTime;if(!G)return;
const $=id=>document.getElementById(id);
if(!$('learning-level')||!$('quiz-content'))return;
const STORAGE='learning-lab01-geotime-progress-v1';
const DAY_STEPS=[1,3,7,14,30],MAX_QUESTIONS=8;
let memory={},session=null,current=null;
function load(){try{const value=JSON.parse(localStorage.getItem(STORAGE)||'{}');return value&&typeof value==='object'&&!Array.isArray(value)?value:{}}catch{return {}}}
function save(){try{localStorage.setItem(STORAGE,JSON.stringify(memory));$('storage-message').textContent='Lokal gespeichert.'}catch{$('storage-message').textContent='Speicherung nicht verfügbar. Freies Training funktioniert weiter.'}}
memory=load();
function today(delta=0){
 const now=new Date();
 const d=new Date(now.getFullYear(),now.getMonth(),now.getDate()+delta);
 return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
}
function shuffle(list){
 const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a;
}
function deck(){
 const level=$('learning-level').value;
 if(level==='eons')return G.eons;
 if(level==='eras')return G.eras;
 if(level==='periods')return G.phanerozoic;
 return G.units.filter(u=>u.rank==='era'&&(u.parent==='arc'||u.parent==='pro')||u.rank==='period'&&u.old>538.8).sort((a,b)=>b.old-a.old);
}
function due(unit){const m=memory[unit.id];return !m||!m.due||m.due<=today()}
function stats(){
 const units=deck();
 $('due-count').textContent=units.filter(due).length;
 $('learned-count').textContent=units.filter(u=>memory[u.id]&&memory[u.id].last).length+' / '+units.length;
 $('correct-count').textContent=(session?session.correct:0)+' / '+(session?session.answered:0);
}
function updateProgress(){
 const count=session?.queue?.length||0;
 const done=session?session.index+(current?.done?1:0):0;
 $('quiz-step').textContent=done+' / '+count;
 const pct=count?100*done/count:0;
 $('quiz-progress').setAttribute('aria-valuenow',String(Math.round(pct)));
 $('quiz-progress-fill').style.width=pct+'%';
}
function create(tag,css,text){
 const el=document.createElement(tag);if(css)el.className=css;
 if(text!==undefined)el.textContent=text;return el;
}
function possibleKinds(unit){
 const kinds=['age','place'];
 if(unit.parent)kinds.push('parent');
 if(deck().filter(u=>u.rank===unit.rank).length>1)kinds.push('sequence');
 return kinds;
}
function questionFor(unit){
 const kind=$('question-mode').value;
 const types=possibleKinds(unit);
 const selected=kind==='mixed'?shuffle(types)[0]:kind;
 const type=types.includes(selected)||selected==='flash'?selected:types[0];
 const d=deck();
 if(type==='sequence'||type==='flash'){
   const same=d.filter(u=>u.rank===unit.rank).sort((a,b)=>b.old-a.old);
   const index=same.findIndex(u=>u.id===unit.id);
   const after=index<same.length-1;
   const answer=after?same[index+1]:same[index-1];
   if(!answer)return questionForFallback(unit);
   const prompt=(after?'Welche '+G.ranks[unit.rank]+' folgt unmittelbar auf ':'Welche '+G.ranks[unit.rank]+' liegt unmittelbar vor ')+unit.name+'?';
   return {type,unit,prompt,answer:answer.name,alternatives:same.map(x=>x.name),
     explain:'Abfolge von alt nach jung: '+same.map(x=>x.name).join(' → ')+'.'};
 }
 if(type==='parent'){
   const p=G.byId.get(unit.parent);
   if(!p)return questionForFallback(unit);
   const others=G.units.filter(u=>u.rank===p.rank);
   return {type,unit,prompt:'Zu welcher '+G.ranks[p.rank]+' gehört '+unit.name+'?',answer:p.name,alternatives:others.map(x=>x.name),
     explain:unit.name+' ist innerhalb von '+G.path(unit.id).slice(0,-1).map(x=>x.name).join(' / ')+' eingeordnet.'};
 }
 if(type==='age'){
   return {type,unit,prompt:'Vor wie vielen Millionen Jahren begann '+unit.name+'?',answer:G.fmt(unit.old),
     alternatives:d.map(u=>G.fmt(u.old)),
     explain:unit.name+' beginnt numerisch bei '+G.fmt(unit.old)+'. Der Abschnitt endet bei '+G.fmt(unit.young)+'.'};
 }
 if(type==='place'){
   const max=unit.old>538.8?4567:538.8;
   return {type,unit,prompt:'Platziere den Beginn von '+unit.name+' auf der Zeitachse.',answer:unit.old,max,
     explain:'Der numerische Beginn liegt bei '+G.fmt(unit.old)+'. Dies ist eine Schätz-/Kalibrierungsaufgabe, keine Messung.'};
 }
 return questionForFallback(unit);
}
function questionForFallback(unit){
 return {type:'age',unit,prompt:'Vor wie vielen Millionen Jahren begann '+unit.name+'?',answer:G.fmt(unit.old),alternatives:deck().map(u=>G.fmt(u.old)),explain:'Beginn: '+G.fmt(unit.old)+'.'};
}
function mark(unit,correct){
 if(!session||session.type!=='daily')return;
 const prev=memory[unit.id]||{stage:-1};
 const stage=correct?Math.min((Number.isFinite(prev.stage)?prev.stage:-1)+1,DAY_STEPS.length-1):-1;
 memory[unit.id]={stage,last:today(),due:correct?today(DAY_STEPS[stage]):today()};
 save();
}
function feedback(correct,explain,answer){
 const out=$('quiz-feedback');out.replaceChildren();out.hidden=false;out.dataset.correct=String(correct);
 out.append(create('strong','',correct?'Richtig – gut erinnert.':'Noch einmal ansehen.'));
 out.append(create('p','',(answer?'Richtige Antwort: '+answer+'. ':'')+explain));
 const note=current?.unit?.note;
 if(note)out.append(create('p','',note));
}
function finishAnswer(correct,details,answer){
 if(!current||current.done)return;
 current.done=true;
 session.answered++;if(correct)session.correct++;
 mark(current.unit,correct);feedback(correct,current.explain+(details?' '+details:''),answer);
 $('quiz-actions').hidden=false;
 $('next-question').textContent=session.index===session.queue.length-1?'Runde abschließen ✓':'Nächste Frage →';
 updateProgress();stats();
}
function answerButtons(question){
 const node=create('div','earth-choice-list');
 const pool=[...new Set(question.alternatives)].filter(x=>x!==question.answer);
 const opts=shuffle([question.answer,...shuffle(pool).slice(0,3)]);
 for(const [index,value] of opts.entries()){
   const button=create('button','earth-choice');
   button.type='button';
   button.append(create('span','',String(index+1).padStart(2,'0')),create('strong','',value));
   button.addEventListener('click',()=>{
     const correct=value===question.answer;
     for(const b of node.querySelectorAll('button')){
       b.disabled=true;
       const label=b.querySelector('strong')?.textContent;
       b.classList.toggle('correct',label===question.answer);
       b.classList.toggle('wrong',label===value&&!correct);
     }
     finishAnswer(correct,'',question.answer);
   });
   node.append(button);
 }
 return node;
}
function placementControls(question){
 const wrap=create('div');
 const note=create('p','earth-answer-help','Links liegt die Vergangenheit, rechts die Gegenwart. Die erlaubte Toleranz beträgt 4,5 % dieser Ansicht.');
 const track=create('input','mo-range');
 track.type='range';track.min='0';track.max=String(question.max);
 track.step=question.max>1000?'1':'.1';
 track.value=String(Math.round(question.max*.5*10)/10);
 track.style.width='100%';track.style.direction='rtl';
 track.setAttribute('aria-label','Beginn in Millionen Jahren vor heute schätzen');
 const output=create('p','earth-overline','Deine Schätzung: '+G.fmt(Number(track.value)));
 track.addEventListener('input',()=>{output.textContent='Deine Schätzung: '+G.fmt(Number(track.value))});
 const submit=create('button','mo-btn mo-btn-primary','Schätzung prüfen');
 submit.type='button';
 submit.addEventListener('click',()=>{
   const guess=Number(track.value),diff=Math.abs(guess-question.answer),tolerance=question.max*.045;
   const correct=diff<=tolerance;
   track.disabled=true;submit.disabled=true;
   finishAnswer(correct,'Deine Schätzung: '+G.fmt(guess)+'. Differenz: '+G.fmt(diff)+'. Toleranz: ±'+G.fmt(tolerance)+'.',G.fmt(question.answer));
 });
 wrap.append(note,track,output,submit);return wrap;
}
function flashControls(question){
 const wrap=create('div');
 const prompt=create('p','earth-answer-help','Sprich die Antwort laut aus oder schreibe sie auf Papier – erst dann aufdecken.');
 const reveal=create('button','mo-btn mo-btn-primary','Antwort aufdecken');
 const answer=create('div','earth-feedback');answer.hidden=true;
 const certainty=create('div','earth-answer-actions');certainty.hidden=true;
 reveal.addEventListener('click',()=>{
   reveal.hidden=true;answer.hidden=false;certainty.hidden=false;
   answer.append(create('strong','','Antwort: '+question.answer),create('p','',question.explain));
 });
 for(const [correct,label] of [[true,'✓ Gewusst'],[false,'↺ Noch üben']]){
   const button=create('button','mo-btn',label);button.type='button';
   button.addEventListener('click',()=>{certainty.hidden=true;finishAnswer(correct,'',question.answer)});
   certainty.append(button);
 }
 wrap.append(prompt,reveal,answer,certainty);return wrap;
}
function renderQuestion(){
 const content=$('quiz-content');content.replaceChildren();
 $('quiz-feedback').hidden=true;$('quiz-actions').hidden=true;
 if(!session||session.index>=session.queue.length){finishSession();return}
 const unit=session.queue[session.index],q=questionFor(unit);
 current={unit,done:false,...q};
 $('quiz-mode-name').textContent=({mixed:'GEMISCHT',sequence:'REIHENFOLGE',parent:'HIERARCHIE',age:'GRENZEN',place:'EINORDNUNG',flash:'AKTIVES ERINNERN'})[q.type]||'ZEITTRAINER';
 const heading=create('h2','earth-question',q.prompt);heading.id='quiz-question';heading.tabIndex=-1;content.append(heading);
 if(q.type==='place')content.append(placementControls(q));
 else if(q.type==='flash')content.append(flashControls(q));
 else content.append(answerButtons(q));
 updateProgress();stats();
}
function finishSession(){
 current=null;
 const content=$('quiz-content');content.replaceChildren();
 $('quiz-mode-name').textContent='RUNDE ABGESCHLOSSEN';
 $('quiz-feedback').hidden=true;$('quiz-actions').hidden=true;
 const heading=create('h2','earth-question','Deine Runde ist abgeschlossen.');content.append(heading);
 const p=create('p','',session.answered+' Aufgaben · '+session.correct+' richtig. '+(session.type==='daily'?'Deine Wiederholungsintervalle wurden lokal aktualisiert.':'Freies Training – kein Lernstand gespeichert.'));
 p.style.color='var(--mo-muted)';content.append(p);
 const b=create('button','mo-btn mo-btn-primary','Noch eine Runde');
 b.addEventListener('click',()=>start('free'));content.append(b);updateProgress();stats();
}
function start(type){
 const units=deck();const eligible=type==='daily'?units.filter(due):units;
 if(!eligible.length){
   session=null;current=null;
   $('quiz-mode-name').textContent='FÜR HEUTE ERLEDIGT';
   $('quiz-content').replaceChildren(create('h2','earth-question','Heute ist nichts fällig.'),create('p','earth-answer-help','Du kannst im freien Training trotzdem weiterlernen oder eine andere Stufe wählen.'));
   $('quiz-feedback').hidden=true;$('quiz-actions').hidden=true;updateProgress();stats();return;
 }
 session={type,queue:shuffle(eligible).slice(0,MAX_QUESTIONS),index:0,correct:0,answered:0};
 current=null;renderQuestion();
}
$('start-daily').addEventListener('click',()=>start('daily'));
$('start-free').addEventListener('click',()=>start('free'));
$('next-question').addEventListener('click',()=>{if(!session||!current?.done)return;session.index++;renderQuestion()});
function renderMemory(){
 const root=$('memory-cells');root.replaceChildren();
 deck().forEach((unit,index)=>{
   const b=create('button');b.type='button';b.dataset.name=unit.name;b.dataset.revealed='false';
   b.setAttribute('aria-label','Einheit '+(index+1)+' aufdecken');
   b.append(create('span','',String(index+1).padStart(2,'0')),create('strong','','?'));
   b.addEventListener('click',()=>setMemory(b,b.dataset.revealed!=='true'));
   root.append(b);
 });
}
function setMemory(button,revealed){
 button.dataset.revealed=String(revealed);
 button.classList.toggle('revealed',revealed);
 button.querySelector('strong').textContent=revealed?button.dataset.name:'?';
 button.setAttribute('aria-label','Einheit '+(Number(button.querySelector('span').textContent))+(revealed?' verbergen':' aufdecken'));
}
$('hide-memory').addEventListener('click',()=>document.querySelectorAll('#memory-cells button').forEach(b=>setMemory(b,false)));
$('reveal-memory').addEventListener('click',()=>document.querySelectorAll('#memory-cells button').forEach(b=>setMemory(b,true)));
$('learning-level').addEventListener('change',()=>{session=null;current=null;renderMemory();stats();
 $('quiz-mode-name').textContent='NEUE STUFE GEWÄHLT';
 $('quiz-content').replaceChildren(create('h2','earth-question','Neue Stufe bereit.'),create('p','earth-answer-help','Wähle Tagesrunde oder freies Training.'));
 $('quiz-feedback').hidden=true;$('quiz-actions').hidden=true;updateProgress()});
$('reset-progress').addEventListener('click',()=>{
 if(!confirm('Gesamten lokal gespeicherten Lernstand dieses Zeittrainers wirklich löschen?'))return;
 memory={};try{localStorage.removeItem(STORAGE);$('storage-message').textContent='Lernstand auf diesem Gerät gelöscht.'}catch{$('storage-message').textContent='Lokales Speichern oder Löschen ist nicht verfügbar.'}
 stats();
});
renderMemory();stats();updateProgress();
})();