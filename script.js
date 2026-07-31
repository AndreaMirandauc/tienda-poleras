import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

const PRICE = 25990;
const PHONES = { santiago: "56966690359", regiones: "56961179420" };

const MODELS = [
  { id:"celeste", name:"Cumbre Celeste", design:"Celeste / negro", description:"Chaqueta bicolor celeste y negra, con acolchado térmico y estilo outdoor.", color:"#2b9fd0", light:"#67c7ed", dark:"#14749f", type:"solid" },
  { id:"negro", name:"Eclipse Negra", design:"Negro total", description:"Modelo completamente negro, sobrio y fácil de combinar para el uso diario.", color:"#22272c", light:"#464d54", dark:"#0f1418", type:"solid" },
  { id:"rojo", name:"Cumbre Roja", design:"Rojo / negro", description:"Modelo rojo intenso con panel superior negro y acabado acolchado de invierno.", color:"#c62835", light:"#e0525d", dark:"#811922", type:"solid" },
  { id:"crema", name:"Arena Crema", design:"Crema / negro", description:"Modelo crema cálido con contraste negro, moderno y de apariencia premium.", color:"#caae7f", light:"#e8d2a9", dark:"#967448", type:"solid" },
  { id:"verde", name:"Bosque Verde", design:"Verde / negro", description:"Chaqueta verde bosque con parte superior negra y estética outdoor clásica.", color:"#2f6758", light:"#5d9887", dark:"#16483b", type:"solid" },
  { id:"grafito", name:"Cordillera Grafito", design:"Grafito / negro", description:"Modelo gris grafito con contraste negro, discreto y versátil.", color:"#555b62", light:"#7d848c", dark:"#34383e", type:"solid" },
  { id:"montana", name:"Montaña Bicolor", design:"Estampado blanco y negro", description:"Diseño estampado inspirado en relieves de montaña, con panel superior negro.", color:"#22272c", light:"#eef1f3", dark:"#101419", type:"mountain" },
  { id:"bosque", name:"Bosque Nevado", design:"Estampado ramas crema", description:"Estampado de ramas invernales en tonos crema, gris y negro.", color:"#c2b49d", light:"#eee4d4", dark:"#3a393b", type:"branches" },
];

const state = { model: MODELS[0], size:"M", quantity:1, autoRotate:false };

const els = {
  modelGrid: document.querySelector("#model-grid"),
  modelOptions: document.querySelector("#model-options"),
  viewerTitle: document.querySelector("#viewer-model-title"),
  selectedTitle: document.querySelector("#selected-model-title"),
  selectedName: document.querySelector("#selected-model-name"),
  selectedDescription: document.querySelector("#selected-model-description"),
  selectedSize: document.querySelector("#selected-size-name"),
  quantity: document.querySelector("#quantity"),
  viewer: document.querySelector("#product-viewer"),
  viewerHint: document.querySelector("#viewer-hint"),
  loading: document.querySelector("#loading-state"),
  autoRotate: document.querySelector("#auto-rotate"),
  resetView: document.querySelector("#reset-view"),
  dialog: document.querySelector("#delivery-dialog"),
};

function formatPrice(value){
  return new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0}).format(value);
}

function makePatternTexture(type, base, light, dark){
  const canvas=document.createElement("canvas"); canvas.width=512; canvas.height=512;
  const ctx=canvas.getContext("2d"); ctx.fillStyle=base; ctx.fillRect(0,0,512,512);
  if(type==="mountain"){
    ctx.fillStyle=light;
    for(let y=20;y<540;y+=120){
      for(let x=-50;x<560;x+=150){
        ctx.beginPath();ctx.moveTo(x,y+100);ctx.lineTo(x+48,y+20);ctx.lineTo(x+78,y+66);ctx.lineTo(x+112,y+6);ctx.lineTo(x+160,y+100);ctx.closePath();ctx.fill();
      }
    }
    ctx.strokeStyle="#727b84";ctx.lineWidth=9;ctx.globalAlpha=.55;
    for(let i=0;i<14;i++){ctx.beginPath();ctx.moveTo(Math.random()*512,Math.random()*512);ctx.lineTo(Math.random()*512,Math.random()*512);ctx.stroke()}
  } else {
    ctx.fillStyle=light;ctx.fillRect(0,0,512,512);ctx.strokeStyle=dark;ctx.lineWidth=7;ctx.globalAlpha=.72;
    for(let i=0;i<22;i++){
      const x=Math.random()*512,y=Math.random()*512;ctx.beginPath();ctx.moveTo(x,y);ctx.bezierCurveTo(x+80,y-60,x+130,y+60,x+220,y-20);ctx.stroke();
      for(let j=0;j<3;j++){ctx.beginPath();ctx.moveTo(x+55*j,y-10*j);ctx.lineTo(x+75+55*j,y-45-10*j);ctx.stroke()}
    }
  }
  const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(1.1,1.1);return tex;
}

function makeMaterial(model, black=false){
  if(black) return new THREE.MeshStandardMaterial({color:0x14191e,roughness:.7,metalness:.02});
  const params={color:new THREE.Color(model.color),roughness:.66,metalness:.015};
  if(model.type!=="solid"){params.map=makePatternTexture(model.type,model.color,model.light,model.dark);params.color=new THREE.Color(0xffffff)}
  return new THREE.MeshStandardMaterial(params);
}

function roundedBox(w,h,d,r=0.12,segments=5){
  return new RoundedBoxGeometry(w,h,d,segments,r);
}

function puffSegment(w,h,d,material,position,rotation={x:0,y:0,z:0}){
  const mesh=new THREE.Mesh(roundedBox(w,h,d,Math.min(w,h,d)*.17,6),material);
  mesh.position.set(position.x,position.y,position.z);mesh.rotation.set(rotation.x||0,rotation.y||0,rotation.z||0);mesh.castShadow=true;mesh.receiveShadow=true;return mesh;
}

function logoTexture(){
  const canvas=document.createElement("canvas");canvas.width=512;canvas.height=180;const ctx=canvas.getContext("2d");ctx.clearRect(0,0,512,180);ctx.fillStyle="#fff";ctx.font="900 54px Arial";ctx.textAlign="left";ctx.fillText("THE",20,58);ctx.fillText("NORTH",20,112);ctx.fillText("FACE",20,166);ctx.lineWidth=18;ctx.strokeStyle="#fff";ctx.beginPath();ctx.arc(270,164,132,-Math.PI/2,0);ctx.stroke();ctx.beginPath();ctx.arc(270,164,88,-Math.PI/2,0);ctx.stroke();const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;return tex;
}

function createHood(material){
  const hood=new THREE.Group();
  const back=puffSegment(1.75,1.38,.78,material,{x:0,y:.12,z:0},{x:-.05});back.scale.z=.8;hood.add(back);
  const opening=new THREE.Mesh(new THREE.TorusGeometry(.58,.12,18,48,Math.PI*1.65),new THREE.MeshStandardMaterial({color:0x10151a,roughness:.8}));opening.rotation.z=Math.PI*.175;opening.position.set(0,.12,.45);hood.add(opening);
  return hood;
}

function createJacket(model){
  const group=new THREE.Group();
  const colorMat=makeMaterial(model,false), blackMat=makeMaterial(model,true), darkMat=new THREE.MeshStandardMaterial({color:0x0b1015,roughness:.65});

  const bodyY=[1.35,.72,.08,-.56];
  bodyY.forEach((y)=>group.add(puffSegment(2.55,.62,.92,colorMat,{x:0,y,z:0})));
  group.add(puffSegment(2.58,.58,.95,blackMat,{x:0,y:1.95,z:0}));

  [-1,1].forEach(side=>{
    const x=side*1.56;
    const segments=[1.65,1.05,.45,-.15];
    segments.forEach((y,i)=>{
      group.add(puffSegment(.72,.78,.78,colorMat,{x:x+side*i*.08,y,z:0},{z:side*(.18+i*.025)}));
    });
    const cuff=puffSegment(.69,.27,.74,darkMat,{x:x+side*.3,y:-.63,z:0},{z:side*.27});group.add(cuff);
  });

  const collar=new THREE.Mesh(new THREE.TorusGeometry(.52,.22,18,64,Math.PI*1.58),blackMat);collar.rotation.z=Math.PI*.21;collar.rotation.x=Math.PI/2;collar.position.set(0,2.38,.02);group.add(collar);

  const hood=createHood(blackMat);hood.position.set(0,2.72,-.1);hood.scale.set(.92,.92,.92);group.add(hood);

  const zipper=puffSegment(.075,3.75,.12,darkMat,{x:0,y:.48,z:.51});group.add(zipper);
  [-1,1].forEach(side=>{
    const pocket=puffSegment(.12,.76,.11,darkMat,{x:side*.72,y:-.05,z:.53},{z:side*.28});group.add(pocket);
  });

  const logoMat=new THREE.MeshBasicMaterial({map:logoTexture(),transparent:true,side:THREE.FrontSide,depthWrite:false});
  const logo=new THREE.Mesh(new THREE.PlaneGeometry(.58,.21),logoMat);logo.position.set(.72,2.0,.505);group.add(logo);

  group.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});
  group.scale.set(.98,.98,.98);group.position.y=-.55;
  return {group,hood:createDetachedHood(model)};
}

function createDetachedHood(model){
  const group=createHood(makeMaterial(model,false));
  group.rotation.set(-.12,.55,.08);group.scale.set(1.18,1.18,1.18);return group;
}

function setupScene(canvas,{hood=false}={}){
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:"high-performance"});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(34,1,.1,100);camera.position.set(hood?3.4:0,hood?2.2:1.0,hood?5.3:7.1);
  const hemi=new THREE.HemisphereLight(0xffffff,0x24445d,2.5);scene.add(hemi);
  const key=new THREE.DirectionalLight(0xffffff,5);key.position.set(4,7,6);key.castShadow=true;scene.add(key);
  const fill=new THREE.DirectionalLight(0x8fd8ff,2.2);fill.position.set(-5,2,3);scene.add(fill);
  const rim=new THREE.DirectionalLight(0xffffff,2.1);rim.position.set(0,4,-5);scene.add(rim);
  const floor=new THREE.Mesh(new THREE.CircleGeometry(4.5,64),new THREE.ShadowMaterial({color:0x17354b,opacity:.16}));floor.rotation.x=-Math.PI/2;floor.position.y=hood?-1.0:-2.52;floor.receiveShadow=true;scene.add(floor);
  let controls=null;
  if(!hood){controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.dampingFactor=.075;controls.enablePan=false;controls.minDistance=5.1;controls.maxDistance=9.2;controls.minPolarAngle=.6;controls.maxPolarAngle=2.18;controls.target.set(0,.3,0)}
  return {renderer,scene,camera,controls,current:null};
}

const main3d=setupScene(document.querySelector("#product-canvas"));
const hood3d=setupScene(document.querySelector("#hood-canvas"),{hood:true});

function fitRenderer(ctx){
  const rect=ctx.renderer.domElement.getBoundingClientRect();
  const w=Math.max(1,Math.floor(rect.width)),h=Math.max(1,Math.floor(rect.height));
  if(ctx.renderer.domElement.width!==Math.floor(w*ctx.renderer.getPixelRatio())||ctx.renderer.domElement.height!==Math.floor(h*ctx.renderer.getPixelRatio())){
    ctx.renderer.setSize(w,h,false);ctx.camera.aspect=w/h;ctx.camera.updateProjectionMatrix();
  }
}

function disposeObject(object){
  object.traverse(o=>{
    if(o.geometry)o.geometry.dispose();
    if(o.material){const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>{if(m.map)m.map.dispose();m.dispose()})}
  });
}

function set3DModel(model){
  [main3d,hood3d].forEach(ctx=>{if(ctx.current){ctx.scene.remove(ctx.current);disposeObject(ctx.current);ctx.current=null}});
  const jacket=createJacket(model);main3d.current=jacket.group;main3d.scene.add(jacket.group);hood3d.current=jacket.hood;hood3d.scene.add(jacket.hood);
  main3d.camera.position.set(0,1.0,7.1);main3d.controls.target.set(0,.3,0);main3d.controls.update();
  els.loading.classList.add("is-hidden");
}

function animate(){
  requestAnimationFrame(animate);fitRenderer(main3d);fitRenderer(hood3d);
  main3d.controls.autoRotate=state.autoRotate;main3d.controls.autoRotateSpeed=2.1;main3d.controls.update();
  main3d.renderer.render(main3d.scene,main3d.camera);hood3d.renderer.render(hood3d.scene,hood3d.camera);
}

function swatchBackground(model){
  if(model.type==="mountain")return "linear-gradient(135deg,#191e23 0 35%,#f0f2f4 35% 52%,#4c555e 52% 68%,#fff 68%)";
  if(model.type==="branches")return "repeating-linear-gradient(45deg,#e7dccb 0 8px,#444 8px 10px,#d6c8b4 10px 18px)";
  return model.color;
}

function modelCardMarkup(model){
  return `<button class="model-card${model.id===state.model.id?" is-active":""}" type="button" data-model="${model.id}">
    <span class="model-card-art"><span class="mini-jacket" style="--mini-color:${swatchBackground(model)}"><i class="mini-hood"></i><i class="mini-yoke"></i><i class="mini-zip"></i><i class="mini-logo"></i></span></span>
    <span class="model-card-copy"><small>${model.design}</small><strong>${model.name}</strong><b>$25.990</b></span>
  </button>`;
}

function renderModels(){
  els.modelGrid.innerHTML=MODELS.map(modelCardMarkup).join("");
  els.modelOptions.innerHTML=MODELS.map(m=>`<button class="model-option${m.id===state.model.id?" is-active":""}" type="button" data-model="${m.id}" aria-label="${m.name}" title="${m.name}" style="background:${swatchBackground(m)}"></button>`).join("");
  document.querySelectorAll("[data-model]").forEach(button=>button.addEventListener("click",()=>selectModel(button.dataset.model,true)));
}

function selectModel(id,scroll=false){
  const model=MODELS.find(m=>m.id===id);if(!model)return;state.model=model;
  els.viewerTitle.textContent=model.name;els.selectedTitle.textContent=model.name;els.selectedName.textContent=model.name;els.selectedDescription.textContent=model.description;
  renderModels();set3DModel(model);
  if(scroll)document.querySelector("#producto").scrollIntoView({behavior:"smooth",block:"start"});
}

els.viewer.addEventListener("pointerdown",()=>els.viewerHint.classList.add("is-hidden"),{once:true});
els.autoRotate.addEventListener("click",()=>{state.autoRotate=!state.autoRotate;els.autoRotate.setAttribute("aria-pressed",String(state.autoRotate));els.autoRotate.textContent=state.autoRotate?"Detener giro":"Giro automático"});
els.resetView.addEventListener("click",()=>{state.autoRotate=false;els.autoRotate.setAttribute("aria-pressed","false");els.autoRotate.textContent="Giro automático";main3d.camera.position.set(0,1.0,7.1);main3d.controls.target.set(0,.3,0);main3d.controls.update()});

document.querySelectorAll("[data-size]").forEach(button=>button.addEventListener("click",()=>{document.querySelectorAll("[data-size]").forEach(b=>b.classList.remove("is-active"));button.classList.add("is-active");state.size=button.dataset.size;els.selectedSize.textContent=state.size}));
function setQuantity(q){state.quantity=Math.min(10,Math.max(1,q));els.quantity.value=state.quantity;els.quantity.textContent=state.quantity}
document.querySelector("#qty-down").addEventListener("click",()=>setQuantity(state.quantity-1));document.querySelector("#qty-up").addEventListener("click",()=>setQuantity(state.quantity+1));

document.querySelector("#buy-button").addEventListener("click",()=>els.dialog.showModal());document.querySelector("#dialog-close").addEventListener("click",()=>els.dialog.close());els.dialog.addEventListener("click",e=>{if(e.target===els.dialog)els.dialog.close()});
function whatsappUrl(phone,delivery){const total=PRICE*state.quantity;const msg=["¡Hola! 👋 Me interesa comprar esta chaqueta:","",`🧥 Modelo: ${state.model.name}`,`🎨 Diseño: ${state.model.design}`,`📏 Talla: ${state.size}`,`🔢 Cantidad: ${state.quantity}`,`💰 Precio unitario: ${formatPrice(PRICE)}`,`💳 Total: ${formatPrice(total)}`,`🚚 Entrega: ${delivery}`,"","¿Me pueden confirmar disponibilidad y condiciones de entrega?"].join("\n");return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`}
document.querySelectorAll("[data-delivery]").forEach(button=>button.addEventListener("click",()=>{window.open(whatsappUrl(PHONES[button.dataset.zone],button.dataset.delivery),"_blank","noopener,noreferrer");els.dialog.close()}));

document.querySelector("#year").textContent=new Date().getFullYear();renderModels();set3DModel(state.model);animate();