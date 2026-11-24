/* One persistent scene. Geometry is allocated once; scrubbing evaluates a
   deterministic storyboard. No orbital, fluid or thermal solver is used. */
import * as THREE from './vendor/three/three.module.min.js';

const NOISE = `
float hash31(vec3 p){ p=fract(p*.1031); p+=dot(p,p.yzx+33.33); return fract((p.x+p.y)*p.z); }
float noise3(vec3 p){
 vec3 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
 return mix(mix(mix(hash31(i),hash31(i+vec3(1,0,0)),f.x),mix(hash31(i+vec3(0,1,0)),hash31(i+vec3(1,1,0)),f.x),f.y),
 mix(mix(hash31(i+vec3(0,0,1)),hash31(i+vec3(1,0,1)),f.x),mix(hash31(i+vec3(0,1,1)),hash31(i+vec3(1,1,1)),f.x),f.y),f.z);
}
float fbm(vec3 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise3(p);p=p*2.03+vec3(13.1,7.7,3.3);a*=.5;}return v;}
`;
const BODY_VERTEX = `
uniform float uImpact;
varying vec3 vLocal; varying vec3 vWorld; varying vec3 vNormal;
void main(){
 vLocal=position;
 float bulge=pow(max(dot(normal,normalize(vec3(-1.,.12,.55))),0.),7.);
 vec3 shape=position*(1.+uImpact*.18*bulge);
 vec4 world=modelMatrix*vec4(shape,1.);
 vWorld=world.xyz;vNormal=normalize(mat3(modelMatrix)*normal);
 gl_Position=projectionMatrix*viewMatrix*world;
}`;
const BODY_FRAGMENT = `
uniform float uHeat,uWater,uCut,uImpact,uTime,uMoon;
varying vec3 vLocal,vWorld,vNormal;
${NOISE}
void main(){
 float a=atan(vLocal.x,vLocal.z);
 if(uCut>.001 && a>-.65 && a<-.65+uCut*1.65) discard;
 vec3 q=normalize(vLocal);
 float broad=fbm(q*3.8+vec3(.2,0.,.4));
 float fine=fbm(q*30.);
 float veins=fbm(q*8.+vec3(0.,uTime*.28,0.));
 float cracks=1.-smoothstep(.012,.065,abs(veins-.49));
 float smallCracks=1.-smoothstep(.006,.023,abs(fbm(q*21.)-.48));
 float molten=smoothstep(.67-uHeat*.41,.80-uHeat*.35,broad);
 float lava=clamp(molten*.9+cracks*.72+smallCracks*.13,0.,1.)*uHeat;
 vec3 rock=mix(vec3(.075,.055,.047),vec3(.26,.22,.17),broad)*(.7+fine*.6);
 vec3 lunar=mix(vec3(.19,.17,.15),vec3(.52,.49,.42),broad)*(.65+fine*.65);
 rock=mix(rock,lunar,uMoon);
 float ocean=(1.-smoothstep(.49,.56,broad))*uWater;
 rock=mix(rock,vec3(.018,.075,.095),ocean);
 vec3 normal=normalize(vNormal);
 vec3 light=normalize(-vWorld);
 float day=max(dot(normal,light),0.);
 float fill=max(dot(normal,normalize(vec3(.2,.7,1.))),0.);
 vec3 color=rock*(.22+day*1.55+fill*.30);
 vec3 fire=mix(vec3(1.15,.13,.008),vec3(2.9,1.0,.14),pow(lava,2.));
 color=mix(color,fire,lava*.95);
 float hotSpot=pow(max(dot(q,normalize(vec3(-1.,.12,.55))),0.),8.)*uImpact;
 color+=vec3(3.,1.1,.15)*hotSpot;
 vec3 eye=normalize(cameraPosition-vWorld);
 float shine=pow(max(dot(reflect(-light,normal),eye),0.),70.)*ocean;
 color+=vec3(.75,.85,.85)*shine*.8;
 gl_FragColor=vec4(color,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;

function start() {
  const host = document.getElementById('proto-viewport');
  const M = window.ProtoEarthModel;
  if (!host || !M || !window.ProtoUI) return;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'default'});
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x070d16);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    const canvas = renderer.domElement;
    canvas.tabIndex = 0;
    canvas.setAttribute('role','img');
    canvas.setAttribute('aria-label','Drehbares 3D-Modell: junge Sonne, wachsende Erde, Theia-Einschlag und Mondbildung.');
    canvas.setAttribute('aria-describedby','proto-camera-help phase-description');
    host.prepend(canvas);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42,1,.04,450);
    const {mix,smooth,clamp} = M;
    let snapshot = window.ProtoUI.snapshot;
    let yaw = -.22, pitch = .37, zoom = 1, drag = null, width = 1, height = 1;
    let renderCount = 0, lost = false;
    let cameraTween = null, cameraFrame = 0, lastView = snapshot.view;
    const currentTarget = new THREE.Vector3();
    const earthPosition = new THREE.Vector3(19,0,0);
    const dummy = new THREE.Object3D();
    const tmp = new THREE.Vector3();
    let seed = 721986;
    const random = () => {seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};

    scene.add(new THREE.AmbientLight(0xaebdcc,.65));
    const sunlight = new THREE.PointLight(0xffd8a6,1900,0,2);
    scene.add(sunlight);
    const fill = new THREE.DirectionalLight(0xc3d7dc,.8); fill.position.set(15,10,15); scene.add(fill);

    function glowTexture() {
      const c=document.createElement('canvas');c.width=c.height=128;
      const ctx=c.getContext('2d'),g=ctx.createRadialGradient(64,64,0,64,64,64);
      g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.12,'rgba(255,233,187,.9)');
      g.addColorStop(.3,'rgba(255,170,79,.35)');g.addColorStop(.65,'rgba(255,115,32,.065)');g.addColorStop(1,'rgba(255,98,23,0)');
      ctx.fillStyle=g;ctx.fillRect(0,0,128,128);
      const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;return texture;
    }
    const glowMap=glowTexture();
    function glow(size,opacity=1) {
      const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:glowMap,color:0xffffff,transparent:true,opacity,blending:THREE.AdditiveBlending,depthWrite:false}));
      sprite.scale.setScalar(size);return sprite;
    }
    const sphere=new THREE.SphereGeometry(1,80,56);
    const sunUniforms={uTime:{value:0}};
    const sun=new THREE.Mesh(sphere,new THREE.ShaderMaterial({uniforms:sunUniforms,
      vertexShader:'varying vec3 vLocal;void main(){vLocal=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader:`varying vec3 vLocal;uniform float uTime;${NOISE}
      void main(){float n=fbm(vLocal*14.+uTime*.15);vec3 c=mix(vec3(1.7,.52,.12),vec3(3.4,1.9,.6),n);gl_FragColor=vec4(c,1.);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      }`
    }));
    sun.scale.setScalar(2.15);scene.add(sun);
    const sunHalo=glow(16,.92);scene.add(sunHalo);

    const starCoords=[],starColors=[];
    for(let i=0;i<1300;i++){
      const a=random()*Math.PI*2,u=random()*2-1,r=110+random()*60,s=Math.sqrt(1-u*u);
      starCoords.push(Math.cos(a)*s*r,u*r,Math.sin(a)*s*r);
      const b=.22+random()*.5;starColors.push(b*.83,b*.91,b);
    }
    const starsGeo=new THREE.BufferGeometry();
    starsGeo.setAttribute('position',new THREE.Float32BufferAttribute(starCoords,3));
    starsGeo.setAttribute('color',new THREE.Float32BufferAttribute(starColors,3));
    scene.add(new THREE.Points(starsGeo,new THREE.PointsMaterial({vertexColors:true,size:.16,transparent:true,opacity:.7,depthWrite:false})));

    const diskGroup=new THREE.Group();scene.add(diskGroup);
    const diskUniforms={uTime:{value:0},uOpacity:{value:1}};
    const disk=new THREE.Mesh(new THREE.RingGeometry(2.8,29,160,10),new THREE.ShaderMaterial({
      uniforms:diskUniforms,transparent:true,side:THREE.DoubleSide,depthWrite:false,
      vertexShader:'varying vec3 vLocal;void main(){vLocal=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader:`varying vec3 vLocal;uniform float uTime,uOpacity;${NOISE}
      void main(){float r=length(vLocal.xy),a=atan(vLocal.y,vLocal.x);float n=fbm(vec3(vLocal.xy*.38,uTime*.12));
      float bands=.45+.55*pow(.5+.5*sin(r*2.3+a*2.+n*5.),2.);
      float edge=smoothstep(2.8,5.,r)*(1.-smoothstep(22.,29.,r));
      vec3 c=mix(vec3(.74,.34,.13),vec3(.22,.40,.48),smoothstep(7.,26.,r));
      gl_FragColor=vec4(c,edge*(.1+bands*.2+n*.1)*uOpacity);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      }`
    }));
    disk.rotation.x=-Math.PI/2;diskGroup.add(disk);
    const dustCoords=[],dustColors=[];
    for(let i=0;i<7200;i++){
      const r=3.3+Math.sqrt(random())*25,a=random()*Math.PI*2;
      dustCoords.push(Math.cos(a)*r,(random()-.5)*(.18+r*.015),Math.sin(a)*r);
      const c=new THREE.Color().lerpColors(new THREE.Color('#dc9c63'),new THREE.Color('#819ba7'),r/31);
      c.multiplyScalar(.45+random()*.6);dustColors.push(c.r,c.g,c.b);
    }
    const dustGeo=new THREE.BufferGeometry();
    dustGeo.setAttribute('position',new THREE.Float32BufferAttribute(dustCoords,3));
    dustGeo.setAttribute('color',new THREE.Float32BufferAttribute(dustColors,3));
    const dust=new THREE.Points(dustGeo,new THREE.PointsMaterial({vertexColors:true,map:glowMap,size:.13,transparent:true,opacity:.9,depthWrite:false,blending:THREE.AdditiveBlending}));
    diskGroup.add(dust);

    function orbit(radius,color,opacity){
      const points=[];for(let i=0;i<160;i++){const a=i/160*Math.PI*2;points.push(new THREE.Vector3(Math.cos(a)*radius,0,Math.sin(a)*radius));}
      return new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color,transparent:true,opacity,depthWrite:false}));
    }
    const earthOrbit=orbit(19,0x638c92,.25);scene.add(earthOrbit);
    const marker=orbit(.8,0x9de5ce,.75);marker.position.copy(earthPosition);scene.add(marker);

    const rockGeo=new THREE.IcosahedronGeometry(1,1);
    const positions=rockGeo.attributes.position;
    for(let i=0;i<positions.count;i++){
      tmp.fromBufferAttribute(positions,i);const factor=.84+.13*Math.sin(tmp.x*19+tmp.y*8)+.06*Math.cos(tmp.z*23);
      tmp.multiplyScalar(factor);positions.setXYZ(i,tmp.x,tmp.y,tmp.z);
    }
    rockGeo.computeVertexNormals();
    const rockMaterial=new THREE.MeshStandardMaterial({color:0xaa9180,roughness:1,flatShading:true,transparent:true});
    const rocks=new THREE.InstancedMesh(rockGeo,rockMaterial,220);rocks.frustumCulled=false;scene.add(rocks);
    const rockSeeds=Array.from({length:220},()=>({r:8+random()*20,a:random()*Math.PI*2,y:(random()-.5)*.5,size:.07+random()*.16,delay:random(),spin:random()*6.28}));

    const earthSystem=new THREE.Group();scene.add(earthSystem);
    const body=new THREE.Group();earthSystem.add(body);
    function planetMaterial(moon=false){
      return new THREE.ShaderMaterial({uniforms:{uHeat:{value:0},uWater:{value:0},uCut:{value:0},uImpact:{value:0},uTime:{value:0},uMoon:{value:moon?1:0}},vertexShader:BODY_VERTEX,fragmentShader:BODY_FRAGMENT});
    }
    const earthMaterial=planetMaterial();
    const earth=new THREE.Mesh(sphere,earthMaterial);earth.scale.setScalar(1.45);body.add(earth);
    const sectionMaterial=new THREE.ShaderMaterial({uniforms:{uCore:{value:.39}},side:THREE.DoubleSide,
      vertexShader:'varying vec3 vLocal;varying float vShade;void main(){vLocal=position;vShade=.60+.38*abs(dot(normalize(mat3(modelMatrix)*normal),normalize(vec3(-.3,.6,1.))));gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader:`varying vec3 vLocal;varying float vShade;uniform float uCore;${NOISE}
      void main(){float r=length(vLocal.xy)/1.45;float n=noise3(vLocal*18.);vec3 c=mix(vec3(.38,.095,.035),vec3(.8,.3,.09),r)*(.82+n*.3);
      c=mix(vec3(1.7,.84,.19),c,smoothstep(uCore-.007,uCore+.007,r));
      c=mix(c,vec3(.105,.073,.049),smoothstep(.965,.985,r));gl_FragColor=vec4(c*vShade,1.);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      }`
    });
    const sectionGeometry=new THREE.CircleGeometry(1.449,96,-Math.PI/2,Math.PI);
    const faceA=new THREE.Mesh(sectionGeometry,sectionMaterial),faceB=new THREE.Mesh(sectionGeometry,sectionMaterial);
    body.add(faceA,faceB);

    const airUniforms={uHeat:{value:0},uWater:{value:0},uOpacity:{value:0},uTime:{value:0},uCut:{value:0}};
    const atmosphere=new THREE.Mesh(sphere,new THREE.ShaderMaterial({uniforms:airUniforms,transparent:true,depthWrite:false,
      vertexShader:'varying vec3 vLocal,vWorld,vNormal;void main(){vLocal=position;vec4 w=modelMatrix*vec4(position,1.);vWorld=w.xyz;vNormal=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*w;}',
      fragmentShader:`varying vec3 vLocal,vWorld,vNormal;uniform float uHeat,uWater,uOpacity,uTime,uCut;${NOISE}
      void main(){float a=atan(vLocal.x,vLocal.z);if(uCut>.001&&a>-.65&&a<-.65+uCut*1.65)discard;
      float rim=pow(1.-max(dot(normalize(vNormal),normalize(cameraPosition-vWorld)),0.),3.2);
      float cloud=smoothstep(.48,.7,fbm(vLocal*5.+vec3(uTime*.16,0,0)))*uWater*.25;
      vec3 c=mix(vec3(.55,.22,.075),vec3(.28,.52,.58),uWater);c=mix(c,vec3(.7,.72,.68),cloud);
      gl_FragColor=vec4(c,(rim*.60+cloud)*uOpacity);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      }`
    }));
    atmosphere.scale.setScalar(1.49);body.add(atmosphere);

    const theiaMaterial=planetMaterial();theiaMaterial.uniforms.uHeat.value=.34;
    const theia=new THREE.Mesh(sphere,theiaMaterial);earthSystem.add(theia);
    const moonMaterial=planetMaterial(true);
    const moon=new THREE.Mesh(sphere,moonMaterial);earthSystem.add(moon);
    const impactGlow=glow(1,0);impactGlow.position.set(-1.13,.13,.48);earthSystem.add(impactGlow);

    const debrisCount=1600,debrisArray=new Float32Array(debrisCount*3),debrisColors=new Float32Array(debrisCount*3);
    const debrisSeeds=Array.from({length:debrisCount},(_,i)=>{
      const entry={r:2.0+random()*2.1,a:random()*Math.PI*2,y:(random()-.5),speed:.65+random()*1.2,delay:random(),size:.02+random()*.07};
      const c=new THREE.Color().lerpColors(new THREE.Color('#ffbd71'),new THREE.Color('#9e8170'),random());
      debrisColors[i*3]=c.r;debrisColors[i*3+1]=c.g;debrisColors[i*3+2]=c.b;return entry;
    });
    const debrisGeo=new THREE.BufferGeometry();
    debrisGeo.setAttribute('position',new THREE.BufferAttribute(debrisArray,3).setUsage(THREE.DynamicDrawUsage));
    debrisGeo.setAttribute('color',new THREE.BufferAttribute(debrisColors,3));
    const debrisMaterial=new THREE.PointsMaterial({map:glowMap,size:.10,vertexColors:true,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending});
    const debris=new THREE.Points(debrisGeo,debrisMaterial);debris.frustumCulled=false;earthSystem.add(debris);
    const chunkMaterial=new THREE.MeshStandardMaterial({color:0xb38c6e,emissive:0xc65b1e,emissiveIntensity:.25,roughness:1,transparent:true});
    const chunks=new THREE.InstancedMesh(rockGeo,chunkMaterial,100);chunks.frustumCulled=false;earthSystem.add(chunks);

    function applyState(s,cutOverride){
      const p=s.p;
      earthPosition.set(19*Math.cos(p*.22),0,19*Math.sin(p*.22));earthSystem.position.copy(earthPosition);marker.position.copy(earthPosition);
      diskGroup.rotation.y=-p*7;diskUniforms.uTime.value=p*12;diskUniforms.uOpacity.value=s.gas;
      diskGroup.visible=s.gas>.001;dust.material.opacity=s.gas*.85;
      sunUniforms.uTime.value=p*20;
      marker.visible=p<.27;marker.material.opacity=(1-smooth(.18,.27,p))*.7;
      earthOrbit.material.opacity=snapshot.view==='system'?.26:.12*(1-s.cameraClose);
      rockMaterial.opacity=s.rocks;rocks.visible=s.rocks>.001;
      if(rocks.visible) rockSeeds.forEach((r,i)=>{
        const a=r.a+p*7/Math.sqrt(r.r/10),localAngle=r.a+p*9;
        const gather=smooth(.11+r.delay*.045,.235+r.delay*.04,p);
        const fall=smooth(.225+r.delay*.045,.31+r.delay*.055,p);
        const localRadius=(3+r.delay*3)*(1-fall)+1.1*fall;
        dummy.position.set(mix(Math.cos(a)*r.r,earthPosition.x+Math.cos(localAngle)*localRadius,gather),mix(r.y,r.y*2.3,gather),mix(Math.sin(a)*r.r,earthPosition.z+Math.sin(localAngle)*localRadius,gather));
        dummy.rotation.set(r.spin+p*3,r.spin*2+p*2,p+r.spin);
        dummy.scale.setScalar(r.size*(.4+smooth(.03,.15,p))*(1-fall));dummy.updateMatrix();rocks.setMatrixAt(i,dummy.matrix);
      });
      rocks.instanceMatrix.needsUpdate=true;
      body.scale.setScalar(Math.max(.0001,s.earthScale)*(1+smooth(.60,.66,p)*.025));body.visible=s.earthScale>.001;
      const cut=p>=.24?(cutOverride===null?s.cut:Number(cutOverride)):0;
      const uniforms=earthMaterial.uniforms;
      uniforms.uHeat.value=s.heat;uniforms.uWater.value=s.water;uniforms.uCut.value=cut;uniforms.uImpact.value=s.impact;uniforms.uTime.value=p*7;
      sectionMaterial.uniforms.uCore.value=s.core;faceA.visible=faceB.visible=cut>.001;
      faceA.rotation.y=-.65-Math.PI/2;faceB.rotation.y=-.65+cut*1.65-Math.PI/2;
      airUniforms.uHeat.value=s.heat;airUniforms.uWater.value=s.water;airUniforms.uOpacity.value=smooth(.20,.40,p)*(.36+s.water*.5);airUniforms.uTime.value=p*5;airUniforms.uCut.value=cut;
      theia.position.fromArray(s.theia);theia.scale.setScalar(Math.max(.00001,s.theiaScale)*.78);theia.visible=s.theiaScale>.001;
      theiaMaterial.uniforms.uTime.value=p*4;theiaMaterial.uniforms.uHeat.value=.25+s.impact*.6;
      moon.position.fromArray(s.moon);moon.scale.setScalar(Math.max(.00001,s.moonScale)*.42);moon.visible=s.moonScale>.001;
      moonMaterial.uniforms.uHeat.value=s.moonHeat;moonMaterial.uniforms.uTime.value=p*2;
      impactGlow.material.opacity=s.impact*.85;impactGlow.scale.setScalar(1+s.impact*5.3);impactGlow.visible=s.impact>.001;
      debris.visible=chunks.visible=s.debris>.001;debrisMaterial.opacity=s.debris*.95;chunkMaterial.opacity=s.debris;
      if(debris.visible){
        const flight=Math.max(0,p-.602)*24;
        debrisSeeds.forEach((r,i)=>{
          const angle=r.a+(p-.63)*13/Math.sqrt(r.r);
          const rx=Math.cos(angle)*r.r,rz=Math.sin(angle)*r.r;
          const distance=flight*r.speed;
          let x=mix(-1.1+distance*(.3+Math.cos(r.a)*.8),rx,s.settle);
          let y=mix(.12+r.y*distance*.5,r.y*.18,s.settle);
          let z=mix(.48+distance*(.6+Math.sin(r.a)*.9),rz,s.settle);
          const collect=smooth(.795+r.delay*.05,.90+r.delay*.035,p);
          if(r.delay<.73){
            const spiral=(1-collect)*.65,theta=r.a+collect*9;
            x=mix(x,s.moon[0]+Math.cos(theta)*spiral,collect);y=mix(y,s.moon[1]+r.y*spiral,collect);z=mix(z,s.moon[2]+Math.sin(theta)*spiral,collect);
          }else{x*=1-collect*.95;y*=1-collect*.95;z*=1-collect*.95;}
          debrisArray[i*3]=x;debrisArray[i*3+1]=y;debrisArray[i*3+2]=z;
          if(i<100){dummy.position.set(x,y,z);dummy.rotation.set(r.a+p*9,p*7,r.a);dummy.scale.setScalar(r.size*(1-collect*.95));dummy.updateMatrix();chunks.setMatrixAt(i,dummy.matrix);}
        });
        debrisGeo.attributes.position.needsUpdate=true;chunks.instanceMatrix.needsUpdate=true;
      }
      return cut;
    }

    function cameraPose(){
      const s=snapshot.state;
      const close=snapshot.view==='system'?0:snapshot.view==='earth'?1:s.cameraClose;
      const target=new THREE.Vector3(3,0,0).lerp(earthPosition,close);
      if(close>.5){target.x-=s.cameraWide*.8;target.addScaledVector(moon.position,s.moonView*.24);}
      const wide=Math.max(s.cameraWide,s.debris*.7);
      let distance=Math.exp(mix(Math.log(73),Math.log(7.8+wide*4.2+s.moonView*2),close))*zoom;
      // Fit the model on portrait screens without cropping the impactor/Moon.
      distance*=Math.max(1,1.55/camera.aspect)**.68;
      const angle=yaw+mix(.34,0,close),elevation=clamp(pitch+mix(.11,0,close),-1.1,1.3);
      const position=new THREE.Vector3(Math.sin(angle)*Math.cos(elevation),Math.sin(elevation),Math.cos(angle)*Math.cos(elevation)).multiplyScalar(distance).add(target);
      return {position,target,close};
    }
    const labelItems=[...document.querySelectorAll('.proto-object-label')];
    function placeLabel(id,point,visible,dx=0,dy=0){
      const element=document.getElementById(id);
      if(!visible||!snapshot.labels){element.style.visibility='hidden';return;}
      tmp.copy(point).project(camera);
      const x=(tmp.x*.5+.5)*width+dx,y=(-tmp.y*.5+.5)*height+dy;
      const half=Math.max(30,element.offsetWidth/2);
      const show=tmp.z>-1&&tmp.z<1&&x>half+8&&x<width-half-8&&y>62&&y<height-65;
      element.style.visibility=show?'visible':'hidden';
      if(show){element.style.left=x+'px';element.style.top=y+'px';}
    }
    function labelsFor(s,cut){
      placeLabel('label-sun',new THREE.Vector3(0,2.6,0),true,0,-8);
      const earthAnchor=earthPosition.clone().add(new THREE.Vector3(0,Math.max(.5,s.earthScale*1.58),0));
      document.getElementById('label-earth').textContent=s.p<.23?'Bildungsbereich der Erde':s.p<.9?'Proto-Erde':'Junge Erde';
      placeLabel('label-earth',earthAnchor,true,0,-12);
      placeLabel('label-theia',earthPosition.clone().add(theia.position).add(new THREE.Vector3(0,.85*s.theiaScale,0)),s.theiaScale>.08,0,-10);
      placeLabel('label-moon',earthPosition.clone().add(moon.position).add(new THREE.Vector3(0,.5*s.moonScale,0)),s.moonScale>.12,0,-10);
      placeLabel('label-core',earthPosition.clone().add(new THREE.Vector3(.12,0,.25)),cut>.75,-50,7);
      placeLabel('label-mantle',earthPosition.clone().add(new THREE.Vector3(.75,.6,.6)),cut>.75,55,-10);
      placeLabel('label-debris',earthPosition.clone().add(new THREE.Vector3(-2.8,0,-.5)),s.debris>.4&&s.p>.66,-20,-16);
    }
    let effectiveCut=0;
    function render(){
      if(lost)return;
      const pose=cameraPose();
      if(cameraTween){
        const t=smooth(0,1,clamp((performance.now()-cameraTween.started)/850));
        camera.position.copy(cameraTween.position).lerp(pose.position,t);currentTarget.copy(cameraTween.target).lerp(pose.target,t);
        if(t>=1)cameraTween=null;
      }else{camera.position.copy(pose.position);currentTarget.copy(pose.target);}
      camera.lookAt(currentTarget);camera.updateMatrixWorld();
      renderer.render(scene,camera);renderCount++;
      labelsFor(snapshot.state,effectiveCut);
      document.getElementById('proto-view-label').textContent=pose.close<.05?'ÜBERBLICK':pose.close>.96?'ERDE & UMGEBUNG':'KAMERAFLUG ZUR ERDE';
      if(cameraTween&&!cameraFrame)cameraFrame=requestAnimationFrame(()=>{cameraFrame=0;render();});
    }
    function update(next){
      if(next.view!==lastView){
        if(!matchMedia('(prefers-reduced-motion: reduce)').matches)cameraTween={position:camera.position.clone(),target:currentTarget.clone(),started:performance.now()};
        lastView=next.view;
      }
      snapshot=next;effectiveCut=applyState(next.state,next.cut);render();
    }
    function resize(){
      width=Math.max(1,host.clientWidth);height=Math.max(1,host.clientHeight);
      renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();render();
    }
    window.addEventListener('proto-frame',event=>update(event.detail));
    function cameraAction(action){
      cameraTween=null;
      if(action==='in')zoom=clamp(zoom*.82,.55,2.3);
      else if(action==='out')zoom=clamp(zoom/ .82,.55,2.3);
      else if(action==='reset'){yaw=-.22;pitch=.37;zoom=1;}
      render();
    }
    window.addEventListener('proto-camera',event=>cameraAction(event.detail));
    canvas.addEventListener('pointerdown',event=>{
      if(event.button!==0)return;
      cameraTween=null;drag={id:event.pointerId,x:event.clientX,y:event.clientY,yaw,pitch};canvas.setPointerCapture(event.pointerId);
    });
    canvas.addEventListener('pointermove',event=>{
      if(!drag||event.pointerId!==drag.id)return;
      yaw=drag.yaw-(event.clientX-drag.x)*.006;
      pitch=clamp(drag.pitch+(event.clientY-drag.y)*.006,-1.05,1.25);render();
    });
    const endDrag=()=>{drag=null;};canvas.addEventListener('pointerup',endDrag);canvas.addEventListener('pointercancel',endDrag);canvas.addEventListener('lostpointercapture',endDrag);
    canvas.addEventListener('wheel',event=>{
      if(!event.ctrlKey&&!event.metaKey)return;
      event.preventDefault();cameraAction(event.deltaY<0?'in':'out');
    },{passive:false});
    canvas.addEventListener('keydown',event=>{
      if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','Home'].includes(event.key))event.preventDefault();else return;
      cameraTween=null;
      if(event.key==='ArrowLeft')yaw-=.12;
      if(event.key==='ArrowRight')yaw+=.12;
      if(event.key==='ArrowUp')pitch=clamp(pitch+.12,-1.05,1.25);
      if(event.key==='ArrowDown')pitch=clamp(pitch-.12,-1.05,1.25);
      if(event.key==='+'||event.key==='=')cameraAction('in');
      else if(event.key==='-')cameraAction('out');
      else if(event.key==='Home')cameraAction('reset');
      else render();
    });
    canvas.addEventListener('webglcontextlost',event=>{
      event.preventDefault();lost=true;host.dataset.renderer='lost';
      window.dispatchEvent(new CustomEvent('proto-renderer-error',{detail:'Die 3D-Verbindung wurde unterbrochen. Lade die Seite neu, um sie wiederherzustellen. Die Erklärungen bleiben nutzbar.'}));
    });
    const observer=new ResizeObserver(resize);observer.observe(host);
    update(snapshot);resize();
    document.getElementById('proto-fallback').hidden=true;host.dataset.renderer='ready';
    // Read-only inspection for regression checks. No telemetry or persistence.
    window.ProtoScene=Object.freeze({get diagnostics(){return {renderCount,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures,earthId:earth.uuid,sunId:sun.uuid,moonId:moon.uuid,theiaId:theia.uuid,moonVisible:moon.visible,theiaVisible:theia.visible,progress:snapshot.state.p,camera:camera.position.toArray(),cut:effectiveCut};}});
    window.addEventListener('pagehide',event=>{
      cancelAnimationFrame(cameraFrame);window.ProtoUI.pause();
      if(event.persisted)return;
      observer.disconnect();
      const geometries=new Set(),materials=new Set();
      scene.traverse(object=>{if(object.geometry)geometries.add(object.geometry);if(object.material){for(const material of [].concat(object.material))materials.add(material);}});
      geometries.forEach(geometry=>geometry.dispose());materials.forEach(material=>material.dispose());glowMap.dispose();renderer.dispose();
    },{once:true});
  } catch(error) {
    if(renderer)renderer.dispose();
    host.dataset.renderer='error';
    window.dispatchEvent(new CustomEvent('proto-renderer-error',{detail:'Die 3D-Ansicht ist auf diesem Gerät nicht verfügbar. Die Entwicklungsstationen und ihre Erklärungen bleiben nutzbar.'}));
    console.error('Proto-Earth viewer:',error);
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
