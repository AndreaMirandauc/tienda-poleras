const PRICE = 25990;
const PHONES = { santiago: "56966690359", regiones: "56961179420" };

const MODELS = [
  { id:"celeste", name:"Cumbre Celeste", design:"Celeste / negro", description:"Chaqueta bicolor celeste y negra, acolchada y con capucha desmontable.", index:0 },
  { id:"negro", name:"Eclipse Negra", design:"Negro total", description:"Modelo completamente negro, sobrio y fácil de combinar durante el invierno.", index:1 },
  { id:"rojo", name:"Cumbre Roja", design:"Rojo / negro", description:"Modelo rojo intenso con panel superior negro y acabado acolchado.", index:2 },
  { id:"crema", name:"Arena Crema", design:"Crema / negro", description:"Modelo crema cálido con contraste negro y apariencia premium.", index:3 },
  { id:"verde", name:"Bosque Verde", design:"Verde / negro", description:"Chaqueta verde bosque con panel superior negro y estética outdoor.", index:4 },
  { id:"marino", name:"Noche Marina", design:"Azul marino / negro", description:"Modelo azul marino oscuro con contraste negro, discreto y versátil.", index:5 },
  { id:"montana", name:"Montaña Bicolor", design:"Estampado blanco y negro", description:"Diseño estampado inspirado en relieves de montaña, con panel superior negro.", index:6 },
  { id:"bosque", name:"Bosque Nevado", design:"Estampado ramas crema", description:"Estampado de ramas invernales en tonos crema, gris y negro.", index:7 },
];

const REAL_PHOTOS = [
  { label:"Celeste · foto frontal", index:0 },
  { label:"Celeste · fotografía real", index:1 },
  { label:"Grafito · fotografía real", index:2 },
  { label:"Verde · fotografía real", index:3 },
  { label:"Bosque nevado · fotografía real", index:4 },
  { label:"Montaña bicolor · fotografía real", index:5 },
  { label:"Negro / grafito · fotografía real", index:6 },
];

const state = { model:MODELS[0], size:"M", quantity:1 };
const els = {
  modelGrid:document.querySelector("#model-grid"), modelOptions:document.querySelector("#model-options"),
  stageTitle:document.querySelector("#stage-model-title"), selectedTitle:document.querySelector("#selected-model-title"),
  selectedName:document.querySelector("#selected-model-name"), selectedDescription:document.querySelector("#selected-model-description"),
  selectedSize:document.querySelector("#selected-size-name"), quantity:document.querySelector("#quantity"),
  image:document.querySelector("#main-product-image"), photoGrid:document.querySelector("#real-photo-grid"),
  deliveryDialog:document.querySelector("#delivery-dialog"), photoDialog:document.querySelector("#photo-dialog"),
  photoDialogImage:document.querySelector("#photo-dialog-image")
};

function formatPrice(value){return new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0}).format(value)}
function escapeHtml(value){return String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}
function spritePosition(index){const col=index%4,row=Math.floor(index/4);return `${col*100/3}% ${row*100}%`}

function renderModels(){
  els.modelGrid.innerHTML=MODELS.map(model=>`<button class="model-card ${model.id===state.model.id?"is-active":""}" type="button" data-model="${model.id}"><span class="model-card-art"><span class="sprite-thumb" style="background-position:${spritePosition(model.index)}" role="img" aria-label="${escapeHtml(model.name)}"></span></span><span class="model-card-copy"><small>${escapeHtml(model.design)}</small><strong>${escapeHtml(model.name)}</strong><b>$25.990</b></span></button>`).join("");
  els.modelOptions.innerHTML=MODELS.map(model=>`<button class="model-option ${model.id===state.model.id?"is-active":""}" type="button" data-model="${model.id}" aria-label="Elegir ${escapeHtml(model.name)}"><span class="sprite-option" style="background-position:${spritePosition(model.index)}"></span></button>`).join("");
  document.querySelectorAll("[data-model]").forEach(button=>button.addEventListener("click",()=>selectModel(button.dataset.model)));
}

function selectModel(id){
  const model=MODELS.find(item=>item.id===id); if(!model)return;
  state.model=model;
  els.stageTitle.textContent=model.name; els.selectedTitle.textContent=model.name; els.selectedName.textContent=model.name;
  els.selectedDescription.textContent=model.description; els.image.style.backgroundPosition=spritePosition(model.index); els.image.setAttribute("aria-label",`${model.name} con capucha desmontable`);
  renderModels();
  document.querySelector("#producto").scrollIntoView({behavior:"smooth",block:"start"});
}

function renderRealPhotos(){
  els.photoGrid.innerHTML=REAL_PHOTOS.map((photo,index)=>`<button class="real-photo-card" type="button" data-photo-index="${index}"><span class="real-sprite-thumb" style="background-position:${spritePosition(photo.index)}" role="img" aria-label="${escapeHtml(photo.label)}"></span><span>${escapeHtml(photo.label)}</span></button>`).join("");
  document.querySelectorAll("[data-photo-index]").forEach(button=>button.addEventListener("click",()=>{
    const photo=REAL_PHOTOS[Number(button.dataset.photoIndex)]; els.photoDialogImage.style.backgroundPosition=spritePosition(photo.index); els.photoDialogImage.setAttribute("aria-label",photo.label); els.photoDialog.showModal();
  }));
}

document.querySelectorAll("[data-size]").forEach(button=>button.addEventListener("click",()=>{
  document.querySelectorAll("[data-size]").forEach(item=>item.classList.remove("is-active")); button.classList.add("is-active"); state.size=button.dataset.size; els.selectedSize.textContent=state.size;
}));
function setQuantity(value){state.quantity=Math.min(10,Math.max(1,value));els.quantity.value=state.quantity;els.quantity.textContent=state.quantity}
document.querySelector("#qty-down").addEventListener("click",()=>setQuantity(state.quantity-1));
document.querySelector("#qty-up").addEventListener("click",()=>setQuantity(state.quantity+1));
document.querySelector("#buy-button").addEventListener("click",()=>els.deliveryDialog.showModal());
document.querySelector("#dialog-close").addEventListener("click",()=>els.deliveryDialog.close());
els.deliveryDialog.addEventListener("click",event=>{if(event.target===els.deliveryDialog)els.deliveryDialog.close()});
document.querySelector("#photo-close").addEventListener("click",()=>els.photoDialog.close());
els.photoDialog.addEventListener("click",event=>{if(event.target===els.photoDialog)els.photoDialog.close()});

function buildWhatsappUrl(phone,delivery){
  const total=PRICE*state.quantity;
  const message=["¡Hola! 👋 Me interesa comprar una chaqueta LOWY:","",`🧥 Modelo: ${state.model.name}`,`🎨 Diseño: ${state.model.design}`,`📏 Talla: ${state.size}`,`🔢 Cantidad: ${state.quantity}`,`💰 Precio unitario: ${formatPrice(PRICE)}`,`🧾 Total: ${formatPrice(total)}`,`🚚 Entrega: ${delivery}`,"","¿Me pueden confirmar disponibilidad y condiciones de entrega?"].join("\n");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
document.querySelectorAll("[data-delivery]").forEach(button=>button.addEventListener("click",()=>{
  const url=buildWhatsappUrl(PHONES[button.dataset.zone],button.dataset.delivery);window.open(url,"_blank","noopener,noreferrer");els.deliveryDialog.close();
}));

document.querySelector("#year").textContent=new Date().getFullYear();
els.image.style.backgroundPosition=spritePosition(0);
renderModels();renderRealPhotos();
