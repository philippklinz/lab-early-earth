const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const context = {window:{}};
for(const file of ['time-data.js','proto-model.js'])vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../'+file),'utf8'),context);
const {stateAt,chapters,sources} = context.window.ProtoEarthModel;

test('stations span the whole storyboard and have resolvable sources',()=>{
  assert.equal(chapters[0].at,0);
  assert.equal(chapters.at(-1).at,1);
  chapters.forEach((chapter,i)=>{
    if(i)assert.ok(chapter.at>chapters[i-1].at);
    assert.equal(stateAt(chapter.at).chapter,i);
    assert.ok(chapter.name && chapter.description && chapter.observation);
    chapter.sources.forEach(key=>assert.ok(sources[key]?.[1].startsWith('https://')));
  });
});

test('all sampled states are finite and visual fractions stay bounded',()=>{
  const fractions=['earthScale','heat','crust','water','cut','gas','rocks','theiaScale','impact','debris','settle','collect','moonScale','moonHeat','cameraClose','cameraWide','moonView'];
  for(let i=0;i<=1000;i++){
    const state=stateAt(i/1000);
    Object.values(state).flat().filter(value=>typeof value==='number').forEach(value=>assert.ok(Number.isFinite(value)));
    fractions.forEach(key=>assert.ok(state[key]>=0 && state[key]<=1,`${key} at ${state.p}`));
  }
  assert.equal(stateAt(-3).p,0);assert.equal(stateAt(4).p,1);
  for(const value of [NaN,Infinity,undefined])assert.equal(stateAt(value).p,0);
});

test('Theia approaches before debris and the Moon appears only afterwards',()=>{
  assert.equal(stateAt(.5).theiaScale,0);
  assert.ok(stateAt(.565).theiaScale>.9);
  assert.equal(stateAt(.565).impact,0);
  assert.equal(stateAt(.565).debris,0);
  assert.ok(stateAt(.615).impact>.9);
  assert.ok(stateAt(.72).debris>.9);
  for(let i=0;i<=790;i++)assert.equal(stateAt(i/1000).moonScale,0);
  assert.ok(stateAt(.85).moonScale>0);
  assert.equal(stateAt(1).moonScale,1);
  assert.equal(stateAt(1).theiaScale,0);
  assert.equal(stateAt(1).debris,0);
});

test('scrubbing backwards restores exactly the same state',()=>{
  const points=[0,.14,.28,.39,.48,.565,.61,.65,.72,.85,1];
  const expected=points.map(p=>JSON.stringify(stateAt(p)));
  for(const p of [...points].reverse())stateAt(p);
  points.forEach((p,i)=>assert.equal(JSON.stringify(stateAt(p)),expected[i]));
  const changed=stateAt(.61);changed.theia[0]=999;
  assert.notEqual(stateAt(.61).theia[0],999);
});

test('geometry-driving values remain continuous between stations',()=>{
  let previous=stateAt(0);
  for(let i=1;i<=1000;i++){
    const next=stateAt(i/1000);
    for(const key of Object.keys(next)){
      if(key==='chapter'||typeof next[key]==='string')continue;
      const a=[].concat(previous[key]),b=[].concat(next[key]);
      b.forEach((value,j)=>assert.ok(Math.abs(value-a[j])<.2,`${key} jumps at ${next.p}`));
    }
    previous=next;
  }
});
