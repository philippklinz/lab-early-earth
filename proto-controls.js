/* Text, playback and scrubbing work independently of WebGL. */
(() => {
  'use strict';
  const M = window.ProtoEarthModel;
  if (!M) return;
  const $ = id => document.getElementById(id);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let progress = 0, playing = false, speed = 1, stopAt = 1;
  let transition = null, frame = 0, last = null, chapter = -1;
  let view = 'auto', labels = true, cut = null;
  const phaseButtons = [...document.querySelectorAll('[data-phase]')];

  function emit() {
    const state = M.stateAt(progress);
    if (state.chapter !== chapter) {
      chapter = state.chapter;
      const item = M.chapters[chapter];
      $('stage-age').textContent = item.time.age;
      $('stage-eon').textContent = item.time.eon;
      $('phase-age').textContent = item.time.age.replace('Mrd.', 'Milliarden');
      $('phase-eon').textContent = item.time.eon;
      $('phase-time-note').textContent = item.time.note;
      $('phase-name').textContent = item.name;
      $('phase-description').textContent = item.description;
      $('phase-evidence').textContent = item.observation;
      $('phase-hint').textContent = item.hint;
      $('phase-number').textContent = String(chapter + 1).padStart(2, '0') + ' / ' + String(M.chapters.length).padStart(2, '0');
      $('phase-sources').replaceChildren(...item.sources.map(key => {
        const a = document.createElement('a');
        [a.textContent, a.href] = M.sources[key];
        return a;
      }));
      phaseButtons.forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.phase) === chapter)));
    }
    $('proto-progress').value = String(Math.round(progress * 1000));
    $('proto-progress').setAttribute('aria-valuetext', Math.round(progress * 100) + ' Prozent des Modellablaufs: ' + state.event + ', ' + M.chapters[chapter].time.age.replace('Mrd.', 'Milliarden') + ', ' + M.chapters[chapter].time.eon);
    $('stage-caption').textContent = state.event;
    $('proto-progress-label').textContent = state.event;
    $('prev-phase').disabled = progress <= 0;
    $('next-phase').disabled = progress >= 1;
    const moving = playing || Boolean(transition);
    $('play-evolution').textContent = moving ? 'Ⅱ Pause' : '▶ Entwicklung abspielen';
    $('play-evolution').setAttribute('aria-pressed', String(moving));
    $('cutaway-toggle').disabled = progress < .24;
    $('cutaway-toggle').setAttribute('aria-pressed', String((cut === null ? state.cut : Number(cut)) > .5));
    window.dispatchEvent(new CustomEvent('proto-frame', { detail: { state, view, labels, cut } }));
  }
  function schedule() {
    if (!frame && !document.hidden && (playing || transition)) frame = requestAnimationFrame(tick);
  }
  function tick(now) {
    frame = 0;
    const dt = last === null ? 0 : Math.min((now - last) / 1000, .1);
    last = now;
    if (transition) {
      if (transition.started === null) transition.started = now;
      const u = M.clamp((now - transition.started) / transition.duration);
      progress = M.mix(transition.from, transition.to, M.smooth(0, 1, u));
      if (u === 1) {
        const playAfter = transition.playAfter;
        transition = null;
        if (playAfter) playing = true;
      }
    } else if (playing) {
      progress = Math.min(stopAt, progress + dt * speed / 120);
      if (progress >= stopAt) playing = false;
    }
    emit(); schedule();
  }
  function pause() {
    playing = false; transition = null; last = null;
    cancelAnimationFrame(frame); frame = 0;
  }
  function seek(value, animate = true, playAfter = false) {
    pause();
    const target = M.clamp(value);
    if (!animate || reduced.matches || Math.abs(target-progress) < .0001) {
      progress = target; playing = playAfter;
    } else {
      transition = {from:progress, to:target, started:null, duration:700 + Math.abs(target-progress)*2600, playAfter};
    }
    emit(); schedule();
  }
  function selectChapter(index) {
    cut = null;
    seek(M.chapters[M.clamp(index, 0, M.chapters.length - 1)].at);
  }
  phaseButtons.forEach(button => button.addEventListener('click', () => selectChapter(Number(button.dataset.phase))));
  $('prev-phase').addEventListener('click', () => {
    const previous = M.chapters.filter(item => item.at < progress - .003).at(-1);
    cut = null; seek(previous?.at ?? 0);
  });
  $('next-phase').addEventListener('click', () => {
    const next = M.chapters.find(item => item.at > progress + .003);
    cut = null; seek(next?.at ?? 1);
  });
  $('play-evolution').addEventListener('click', () => {
    if (playing || transition) pause();
    else { if (progress >= 1) progress = 0; stopAt = 1; playing = true; last = null; }
    emit(); schedule();
  });
  $('proto-progress').addEventListener('input', event => seek(Number(event.target.value) / 1000, false));
  $('proto-speed').addEventListener('change', event => { speed = Number(event.target.value); });
  $('play-impact').addEventListener('click', () => {
    stopAt = .77; cut = null; view = 'auto';
    updateViewButtons(); seek(.53, true, true);
    $('proto-viewport').scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});
  });
  function updateViewButtons() {
    document.querySelectorAll('[data-proto-view]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.protoView === view)));
  }
  for (const button of document.querySelectorAll('[data-proto-view]')) {
    button.addEventListener('click', () => { view = button.dataset.protoView; updateViewButtons(); emit(); });
  }
  $('label-toggle').addEventListener('click', event => {
    labels = !labels; event.currentTarget.setAttribute('aria-pressed', String(labels)); emit();
  });
  $('cutaway-toggle').addEventListener('click', () => {
    cut = !((cut === null ? M.stateAt(progress).cut : Number(cut)) > .5); emit();
  });
  for (const button of document.querySelectorAll('[data-proto-camera]')) {
    button.addEventListener('click', () => window.dispatchEvent(new CustomEvent('proto-camera', {detail:button.dataset.protoCamera})));
  }
  $('proto-fullscreen').addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await $('proto-exhibit').requestFullscreen();
    } catch { $('proto-status').textContent = 'Vollbild ist in diesem Browserfenster nicht verfügbar.'; }
  });
  document.addEventListener('fullscreenchange', () => {
    $('proto-fullscreen').textContent = document.fullscreenElement ? 'Vollbild beenden' : 'Vollbild';
  });
  document.addEventListener('visibilitychange', () => {
    last = null;
    if (document.hidden) {
      cancelAnimationFrame(frame); frame = 0;
      if (transition) transition = {...transition, from:progress, started:null};
    } else schedule();
  });
  reduced.addEventListener('change', () => {
    if (reduced.matches) { pause(); emit(); }
  });
  window.addEventListener('proto-renderer-error', event => {
    pause(); emit();
    $('proto-load-status').textContent = event.detail;
    $('proto-fallback').hidden = false;
  });
  window.ProtoUI = Object.freeze({
    get snapshot() { return {state:M.stateAt(progress),view,labels,cut}; },
    get playing() { return playing; },
    seek, pause:() => {pause();emit();}
  });
  emit();
  setTimeout(() => {
    if ($('proto-viewport').dataset.renderer !== 'ready') {
      $('proto-load-status').textContent = 'Die 3D-Ansicht konnte nicht geladen werden. Du kannst die Entwicklungsstationen und ihre Erklärungen weiterhin unten auswählen.';
    }
  }, 10000);
})();
