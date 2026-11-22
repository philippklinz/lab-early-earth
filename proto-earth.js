/* Proto-Earth 3D illustration — deliberately non-physical.
 * Three.js version is pinned. No orbital integration, accretion physics,
 * thermal transport, SPH or Moon-formation model is performed.
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const stage=document.getElementById('proto-stage');
const fallback=document.getElementById('proto-fallback');
const loadStatus=document.getElementById('proto-load-status');
if(stage){
  try {
    const scene=new THREE.Scene();
    scene.background=new THREE.Color(0x0c1922);
    const camera=new THREE.PerspectiveCamera(42,1,.1,100);
    const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'default'});
    renderer.setClearColor(0x0c1922);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.75));
    renderer.domElement.setAttribute('aria-label','Schematische, drehbare räumliche Darstellung zur Entstehung der Erde. Informationen stehen im angrenzenden Text.');
    renderer.domElement.setAttribute('role','img');
    stage.append(renderer.domElement);
    scene.add(new THREE.AmbientLight(0x88a6bb,2.3));
    const key=new THREE.PointLight(0xffe2a6,60,40);key.position.set(-4,5,6);scene.add(key);
    const fill=new THREE.DirectionalLight(0x69c9e3,1.6);fill.position.set(4,-3,-3);scene.add(fill);
    const planetGeo=new THREE.SphereGeometry(1.35,64,48);
    const material=new THREE.MeshStandardMaterial({color:0xaf573f,metalness:.13,roughness:.93,emissive:0x361409,emissiveIntensity:.42});
    const planet=new THREE.Mesh(planetGeo,material);scene.add(planet);
    const innerCore=new THREE.Mesh(new THREE.SphereGeometry(.53,40,28),new THREE.MeshStandardMaterial({color:0xffa74e,emissive:0xb7310b,emissiveIntensity:.6,metalness:.32,roughness:.5}));
    scene.add(innerCore);
    const mantle=new THREE.Mesh(new THREE.SphereGeometry(.99,40,28),new THREE.MeshStandardMaterial({color:0xbb6b49,transparent:true,opacity:.29,roughness:1,side:THREE.DoubleSide}));
    scene.add(mantle);
    const ringMaterial=new THREE.MeshBasicMaterial({color:0xcdab88,transparent:true,opacity:.4,side:THREE.DoubleSide,depthWrite:false});
    const ring=new THREE.Mesh(new THREE.RingGeometry(1.9,3.6,96),ringMaterial);
    ring.rotation.x=1.15;ring.rotation.z=.22;scene.add(ring);
    const glow=new THREE.Mesh(new THREE.SphereGeometry(.8,48,32),new THREE.MeshBasicMaterial({color:0xffd4a3}));
    scene.add(glow);
    const moon=new THREE.Mesh(new THREE.SphereGeometry(.38,32,24),new THREE.MeshStandardMaterial({color:0xa1a6a2,roughness:1}));
    moon.position.set(2.2,.7,.1);scene.add(moon);
    const impactor=new THREE.Mesh(new THREE.SphereGeometry(.43,28,20),new THREE.MeshStandardMaterial({color:0xc48259,roughness:1}));
    impactor.position.set(-2.12,.15,.8);scene.add(impactor);
    const debris=new THREE.Group();
    const debrisGeometry=new THREE.IcosahedronGeometry(.09,0);
    const debrisMaterial=new THREE.MeshStandardMaterial({color:0xd7ac8c,roughness:1,flatShading:true});
    for(let i=0;i<85;i++){
      const mesh=new THREE.Mesh(debrisGeometry,debrisMaterial);
      const angle=(i*2.39996);
      const radius=1.6+Math.sqrt(i/85)*2.0;
      mesh.position.set(Math.cos(angle)*radius,(Math.sin(angle*4)*.28),Math.sin(angle)*radius*.7);
      const s=.42+(i%11)/15;mesh.scale.setScalar(s);debris.add(mesh);
    }
    scene.add(debris);
    const scatterGeometry=new THREE.BufferGeometry(),scatterCount=1800;
    const scatterCoords=new Float32Array(scatterCount*3);
    for(let i=0;i<scatterCount;i++){
      const angle=i*2.39996;
      const r=1.7+Math.sqrt((i+.5)/scatterCount)*3.3;
      const p=i*3;
      scatterCoords[p]=Math.cos(angle)*r;
      scatterCoords[p+1]=Math.sin(angle*3.7)*.24;
      scatterCoords[p+2]=Math.sin(angle)*r*.78;
    }
    scatterGeometry.setAttribute('position',new THREE.BufferAttribute(scatterCoords,3));
    const scatter=new THREE.Points(scatterGeometry,new THREE.PointsMaterial({color:0xe3a485,size:.046,sizeAttenuation:true,transparent:true,opacity:.88}));
    scene.add(scatter);
    // Deterministic decorative crust colors; not a reconstruction of continents.
    const crustGeometry=planetGeo.clone();
    const normals=crustGeometry.getAttribute('normal');
    const colors=new Float32Array(normals.count*3);
    const c1=new THREE.Color(0x426e77),c2=new THREE.Color(0x867f69),c3=new THREE.Color(0x273e4d);
    for(let i=0;i<normals.count;i++){
      const x=normals.getX(i),y=normals.getY(i),z=normals.getZ(i);
      const signal=Math.sin(x*15+z*9)*.4+Math.cos(y*11-x*6)*.35+Math.sin(z*23)*.19;
      const result=(signal>.42?c2:signal<-.25?c3:c1);
      colors[i*3]=result.r;colors[i*3+1]=result.g;colors[i*3+2]=result.b;
    }
    crustGeometry.setAttribute('color',new THREE.BufferAttribute(colors,3));
    const crust=new THREE.Mesh(crustGeometry,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,metalness:0}));
    scene.add(crust);
    // Stars are an atmospheric background, not actual early Solar System positions.
    const stars=new Float32Array(1100*3);
    for(let i=0;i<1100;i++){
      const a=i*2.39996,u=1-2*(i+.5)/1100,s=Math.sqrt(1-u*u),r=18+(i%9)*.35;
      stars[i*3]=s*Math.cos(a)*r;stars[i*3+1]=u*r;stars[i*3+2]=s*Math.sin(a)*r;
    }
    const starsGeo=new THREE.BufferGeometry();starsGeo.setAttribute('position',new THREE.BufferAttribute(stars,3));
    scene.add(new THREE.Points(starsGeo,new THREE.PointsMaterial({color:0x93b9bd,size:.045,sizeAttenuation:true})));

    let phase=0,playing=true;
    const all=[planet,innerCore,mantle,ring,glow,moon,impactor,debris,scatter,crust];
    function setPhase(index){
      phase=Math.max(0,Math.min(6,Number(index)||0));
      all.forEach(x=>x.visible=false);
      planet.scale.setScalar(1);planet.material.transparent=false;planet.material.opacity=1;
      ring.material.opacity=.4;
      if(phase===0){
        glow.visible=true;scatter.visible=true;ring.visible=true;
        glow.material.color.set(0xffdb9e);
        scatter.material.color.set(0xb5d5c8);ring.material.color.set(0x9ebfc1);
      }else if(phase===1){
        glow.visible=true;scatter.visible=true;ring.visible=true;debris.visible=true;
        glow.scale.setScalar(.45);scatter.material.color.set(0xe1a480);
        ring.material.color.set(0xb78f80);
      }else if(phase===2){
        glow.scale.setScalar(1);planet.visible=true;debris.visible=true;scatter.visible=true;
        planet.scale.setScalar(.86);material.color.set(0xb55b42);material.emissive.set(0x572314);
        material.emissiveIntensity=.45;
      }else if(phase===3){
        planet.visible=true;debris.visible=true;material.color.set(0xec7847);
        material.emissive.set(0xc8440b);material.emissiveIntensity=.85;
      }else if(phase===4){
        planet.visible=true;innerCore.visible=true;mantle.visible=true;
        planet.material.transparent=true;planet.material.opacity=.18;
        material.color.set(0x778f8d);material.emissive.set(0x1a3939);material.emissiveIntensity=.25;
      }else if(phase===5){
        planet.visible=true;impactor.visible=true;moon.visible=true;debris.visible=true;
        material.color.set(0xcc724e);material.emissive.set(0x8e2d12);material.emissiveIntensity=.7;
      }else{
        crust.visible=true;moon.visible=true;moon.position.set(3.2,1.1,-.4);
        crust.rotation.copy(planet.rotation);
      }
      if(phase!==1)glow.scale.setScalar(1);
      if(phase!==6)moon.position.set(2.2,.7,.1);
    }
    window.addEventListener('earth-phase-change',e=>setPhase(e.detail));
    window.addEventListener('earth-motion-toggle',e=>{playing=Boolean(e.detail)});
    setPhase(window.EarthPhaseUI?.index||0);
    playing=window.EarthPhaseUI?.playing??true;
    let yaw=.38,pitch=.13,drag=null;
    function orient(){
      const distance=phase===0?7.9:6.6;
      camera.position.set(Math.sin(yaw)*Math.cos(pitch)*distance,Math.sin(pitch)*distance,Math.cos(yaw)*Math.cos(pitch)*distance);
      camera.lookAt(0,0,0);
    }
    renderer.domElement.addEventListener('pointerdown',e=>{
      if(e.button!==0)return;
      drag={x:e.clientX,y:e.clientY,yaw,pitch};
      renderer.domElement.setPointerCapture(e.pointerId);
    });
    renderer.domElement.addEventListener('pointermove',e=>{
      if(!drag)return;
      yaw=drag.yaw+(e.clientX-drag.x)*.005;
      pitch=Math.max(-1.16,Math.min(1.16,drag.pitch-(e.clientY-drag.y)*.005));
      orient();
    });
    for(const name of ['pointerup','pointercancel'])renderer.domElement.addEventListener(name,()=>{drag=null});
    function resize(){
      const w=Math.max(320,stage.clientWidth),h=Math.max(320,stage.clientHeight);
      renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();orient();
    }
    if(window.ResizeObserver)new ResizeObserver(resize).observe(stage);
    else window.addEventListener('resize',resize);
    resize();
    fallback.hidden=true;
    let last=performance.now();
    renderer.setAnimationLoop(now=>{
      const dt=Math.min((now-last)/1000,.075);last=now;
      if(playing&&!document.hidden){
        if(planet.visible)planet.rotation.y+=dt*.12;
        if(crust.visible)crust.rotation.y+=dt*.12;
        if(mantle.visible)mantle.rotation.y+=dt*.08;
        if(innerCore.visible)innerCore.rotation.y+=dt*.07;
        if(scatter.visible)scatter.rotation.y+=dt*.038;
        if(debris.visible)debris.rotation.y+=dt*.035;
        if(ring.visible)ring.rotation.z+=dt*.022;
      }
      renderer.render(scene,camera);
    });
  }catch(error){
    if(loadStatus)loadStatus.textContent='3D ist auf diesem Gerät oder Browser nicht verfügbar. Die Erläuterungen und die Szenennavigation funktionieren weiterhin. Grund: '+String(error?.message||error);
  }
}