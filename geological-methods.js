/* Geological methods laboratory v0.1.
 * Exercises are idealised, not actual field measurements.
 * Half-lives: USGS/NPS/NIST, roughly 4.468 Ga (U-238) and 0.704 Ga (U-235).
 */
(() => {
 'use strict';
 const $=id=>document.getElementById(id);
 if(!$('strata-answers')||!$('isotope-remaining'))return;
 const questions=[
  {q:'Welche der vier Sedimentschichten ist bei ungestörter Lagerung die älteste?',
   options:['A – ganz unten','B','C','D – ganz oben'],correct:0,
   why:'Das Superpositionsprinzip: In einer nicht umgekippten Abfolge liegt eine ältere Sedimentschicht normalerweise unter einer jüngeren. A liegt hier zuunterst.'},
  {q:'Der magmatische Gang E durchschneidet A, B und C. Was folgt daraus?',
   options:['E ist älter als A','E ist jünger als C','E ist genau so alt wie B','Man kann nichts vergleichen'],correct:1,
   why:'Eine Intrusion, die ältere Schichten durchschneidet, muss erst nach deren Ablagerung entstanden sein. E ist also jünger als A, B und C.'},
  {q:'Die obere Schicht D liegt über einer Erosionsfläche und überdeckt Gang E. Was ist im gezeichneten Modell richtig?',
   options:['D ist älter als E','E ist jünger als D','D ist jünger als E','A ist jünger als D'],correct:2,
   why:'Der Gang E wurde vor Ablagerung von D abgeschnitten/erodiert. D bedeckt die ältere Erosionsfläche, also ist D im dargestellten Szenario jünger als E.'},
  {q:'Wie viele Millionen Jahre liegt Schicht A zurück? Was verrät uns dieses Profil allein?',
   options:['Genau 4567 Ma','Genau 538,8 Ma','Genau die Hälfte der Erdgeschichte','Kein absolutes Zahlenalter'],correct:3,
   why:'Die Reihenfolge allein ergibt kein Alter in Millionen Jahren. Dafür braucht man zusätzliche datierbare Materialien oder andere unabhängig kalibrierte Hinweise.'}
 ];
 let index=0,answered=false,score=0;
 const answers=$('strata-answers'),feedback=$('strata-feedback'),next=$('strata-next');
 function renderQuestion(){
  answered=false;const q=questions[index];
  $('strata-question').textContent=q.q;
  $('strata-counter').textContent='Aufgabe '+(index+1)+' / '+questions.length+' · '+score+' bisher richtig';
  answers.replaceChildren();feedback.replaceChildren();next.disabled=true;
  next.textContent=index===questions.length-1?'Ergebnis anzeigen →':'Nächste Frage →';
  q.options.forEach((label,i)=>{
    const b=document.createElement('button');b.type='button';b.textContent=label;
    b.addEventListener('click',()=>{
      if(answered)return;
      answered=true;
      const correct=i===q.correct;if(correct)score++;
      [...answers.querySelectorAll('button')].forEach((candidate,j)=>{
        candidate.disabled=true;
        if(j===q.correct)candidate.classList.add('correct');
        else if(j===i)candidate.classList.add('wrong');
      });
      feedback.dataset.correct=String(correct);
      const strong=document.createElement('strong');strong.textContent=correct?'Richtig. ':'Noch einmal anschauen. ';
      const text=document.createElement('span');text.textContent=q.why;
      feedback.append(strong,text);next.disabled=false;
    });
    answers.append(b);
  });
 }
 function finish(){
   answers.replaceChildren();
   $('strata-question').textContent='Vier Fragen abgeschlossen.';
   $('strata-counter').textContent=score+' / '+questions.length+' richtig beantwortet';
   feedback.replaceChildren();
   const result=document.createElement('p');
   result.textContent='Du kannst die Reihenfolge der Schichten jetzt mit der radiometrischen Uhr darunter vergleichen: relative und absolute Datierung beantworten unterschiedliche Fragen.';
   feedback.append(result);
   next.textContent='Erneut üben ↺';next.disabled=false;next.dataset.restart='true';
 }
 next.addEventListener('click',()=>{
   if(next.disabled)return;
   if(next.dataset.restart==='true'){next.dataset.restart='false';index=0;score=0;renderQuestion();return}
   if(index===questions.length-1){finish();return}
   index++;renderQuestion();
 });
 renderQuestion();

 // An ideal closed-system decay clock based on the surviving P/P0 fraction.
 // Real U-Pb methods measure isotope ratios and correct for daughter products.
 const systems={
   u238:{name:'Uran-238',daughter:'Blei-206',halfMa:4468,label:'4,468 Ga'},
   u235:{name:'Uran-235',daughter:'Blei-207',halfMa:704,label:'704 Ma'}
 };
 const fmt=(n,digits=2)=>new Intl.NumberFormat('de-DE',{maximumFractionDigits:digits,minimumFractionDigits:digits}).format(n);
 function renderClock(){
   const sys=systems[$('isotope-select').value]||systems.u238;
   const pct=Number($('isotope-remaining').value);
   const fraction=pct/100;
   const cycles=Math.log2(1/fraction);
   const ageMa=sys.halfMa*cycles;
   $('isotope-remaining-label').textContent=pct+' %';
   $('isotope-half').textContent=sys.label;
   $('isotope-age').textContent=ageMa<1000?fmt(ageMa,1)+' Ma':fmt(ageMa/1000,3)+' Ga';
   $('isotope-cycles').textContent=fmt(cycles);
   $('isotope-parent-bar').style.width=pct+'%';
   $('isotope-bars').setAttribute('aria-label',pct+' Prozent verbleibendes '+sys.name+'; '+(100-pct)+' Prozent davon im idealisierten Modell zerfallen.');
   $('isotope-parent-legend').textContent=sys.name+' · '+pct+' %';
   $('isotope-daughter-legend').textContent='Vereinfacht zerfallen · '+(100-pct)+' %';
   const warn=$('isotope-warning');warn.replaceChildren();
   const strong=document.createElement('strong'),p=document.createElement('p');
   if(ageMa>4567){
     strong.textContent='PLAUSIBILITÄT: ÄLTER ALS DIE ERDE';
     p.textContent='Diese ideale Rechnung ergibt '+fmt(ageMa/1000,3)+' Milliarden Jahre. Das übersteigt den rund 4,567 Milliarden Jahre langen ICS-Zeitrahmen. Eine irdische Probe mit diesem Ergebnis müsste kritisch überprüft werden; hier ist es nur ein mathematisches Modell.';
     warn.style.borderLeftColor='#b47a4a';
   }else{
     strong.textContent='MODELLVORAUSSETZUNG: GESCHLOSSENES SYSTEM';
     p.textContent='Wir tun so, als kennten wir die Ausgangsmenge von '+sys.name+' und als hätte kein Isotop das Mineral verlassen. Echte Uran-Blei-Datierungen sind komplexer und nutzen gemessene Isotopenverhältnisse samt Störungskontrollen.';
     warn.style.borderLeftColor='var(--mo-accent)';
   }
   warn.append(strong,p);
 }
 $('isotope-select').addEventListener('change',renderClock);
 $('isotope-remaining').addEventListener('input',renderClock);
 for(const button of document.querySelectorAll('[data-frac]')){
   button.addEventListener('click',()=>{$('isotope-remaining').value=button.dataset.frac;renderClock()});
 }
 renderClock();

 const evidence={
  meteorite:{
    tag:'EVIDENZ 01 / SONNENSYSTEM',title:'Meteorite: Material aus der Frühzeit',
    desc:'Meteorite liefern Zugang zu frühen Festkörpern des Sonnensystems. Die Altersmessung einiger primitiver Bestandteile hilft, den Beginn der planetaren Geschichte einzuordnen.',
    observation:'Isotopenverhältnisse in meteoritenbildenden Mineralen und anderen ursprünglichen Bestandteilen.',
    interpretation:'Der Beginn der Sonnensystemgeschichte wird auf etwa 4,567 Milliarden Jahre datiert; das Alter der Erde als Planet wird typischerweise auf rund 4,54 Milliarden Jahre geschätzt.',
    caution:'4,567 Milliarden Jahre sind kein punktgenau bestimmter Tag, an dem die fertige Erde entstanden ist.',
    link:'https://www.nist.gov/how-do-you-measure-it/how-do-you-know-age-fossils-and-other-old-things'
  },
  zircon:{
    tag:'EVIDENZ 02 / KRISTALL',title:'Jack Hills: winzige Minerale, sehr alte Informationen',
    desc:'Zirkone sind chemisch widerstandsfähig. Einige Jack-Hills-Körner wurden auf ungefähr 4,4 Milliarden Jahre datiert.',
    observation:'Uran-Blei-Alter und Sauerstoffisotope in einzelnen Kristallen; ein beschriebener Kristall erreichte 4404 ± 8 Ma.',
    interpretation:'Kristallchemie kann auf frühere Wechselwirkungen von Oberflächenmaterial mit flüssigem Wasser hinweisen.',
    caution:'Das ist kein direkter Nachweis eines globalen Ozeans oder einer vollständig erhaltenen uralten Kruste.',
    link:'https://www.nature.com/articles/35051550'
  },
  rock:{
    tag:'EVIDENZ 03 / GESTEIN',title:'Alte Kruste: ein Gestein ist mehr als ein Mineral',
    desc:'Die ältesten erhaltenen Krustengesteine geben Einblicke in Magmatismus und geologische Umwandlung, sind aber selten und häufig mehrfach verändert.',
    observation:'Radiometrisch datierte Minerale und mehrere Gesteinsgenerationen in sehr alten Gneiskomplexen, etwa Acasta.',
    interpretation:'Teile der Erdkruste existierten vor rund vier Milliarden Jahren bereits und wurden mehrfach verändert.',
    caution:'Das Alter eines einzelnen Zirkons ist nicht automatisch das Alter seiner heutigen Wirtsgesteinsschicht.',
    link:'https://www.nature.com/articles/35051550'
  },
  moon:{
    tag:'EVIDENZ 04 / MOND',title:'Mondproben: ein zweites geologisches Archiv',
    desc:'Der Mond bewahrt eine andere, teilweise besser erhaltene Geschichte früher Einschläge und Gesteinsbildung.',
    observation:'Alter, Mineralogie und chemische Zusammensetzung der Apollo-Proben; Hinweise auf ehemals geschmolzene Mondkruste.',
    interpretation:'Große Einschläge und ein Magmaozean spielen eine wichtige Rolle in führenden Modellfamilien der Mondentstehung.',
    caution:'Proben legen Randbedingungen fest; sie zeigen keinen fotografisch bekannten genauen Einschlagsablauf.',
    link:'https://science.nasa.gov/moon/formation/'
  }
 };
 function showEvidence(id){
   const e=evidence[id];if(!e)return;
   for(const button of document.querySelectorAll('[data-evidence]'))button.setAttribute('aria-pressed',String(button.dataset.evidence===id));
   for(const [target,value] of Object.entries({
     'evidence-label':e.tag,'evidence-title':e.title,'evidence-description':e.desc,
     'evidence-observed':e.observation,'evidence-inferred':e.interpretation,
     'evidence-caveat':e.caution
   }))$(target).textContent=value;
   $('evidence-link').href=e.link;
 }
 for(const button of document.querySelectorAll('[data-evidence]'))button.addEventListener('click',()=>showEvidence(button.dataset.evidence));
 showEvidence('meteorite');
 window.GeologicalMethodsUI=Object.freeze({selectEvidence:showEvidence,renderClock});
})();