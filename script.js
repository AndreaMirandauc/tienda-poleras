const FRAME_COUNT = 8;
const PHONES = {
  santiago: "56966690359",
  regiones: "56961179420",
};

const COLORS = {
  celeste: { label: "Celeste", main: "#2c9fd0", light: "#6bc7ed", dark: "#1675a2" },
  negro: { label: "Negro", main: "#252a2f", light: "#444b52", dark: "#12171b" },
  rojo: { label: "Rojo", main: "#c32632", light: "#e14a55", dark: "#861821" },
  crema: { label: "Crema", main: "#c6a878", light: "#e1c89e", dark: "#94764d" },
};

const state = {
  color: "celeste",
  colorLabel: "Celeste",
  size: "M",
  quantity: 1,
  frame: 0,
  mode: "360",
  dragging: false,
  startX: 0,
  startFrame: 0,
};

const viewer = document.querySelector("#product-viewer");
const image = document.querySelector("#product-image");
const hint = document.querySelector("#viewer-hint");
const dots = document.querySelector("#frame-dots");
const angleLabel = document.querySelector("#angle-label");
const controls = document.querySelector("#viewer-controls");
const tab360 = document.querySelector("#tab-360");
const tabHood = document.querySelector("#tab-hood");
const selectedColorName = document.querySelector("#selected-color-name");
const selectedSizeName = document.querySelector("#selected-size-name");
const quantityOutput = document.querySelector("#quantity");
const dialog = document.querySelector("#delivery-dialog");

function brandMarkup(opacity = 1) {
  return `
    <g opacity="${opacity}" transform="translate(416 242)">
      <text x="0" y="0" fill="#fff" font-family="Arial,sans-serif" font-size="14" font-weight="800">THE</text>
      <text x="0" y="14" fill="#fff" font-family="Arial,sans-serif" font-size="14" font-weight="800">NORTH</text>
      <text x="0" y="28" fill="#fff" font-family="Arial,sans-serif" font-size="14" font-weight="800">FACE</text>
      <path d="M52 28a28 28 0 0 0-28-28v8a20 20 0 0 1 20 20Z" fill="#fff"/>
      <path d="M42 28A18 18 0 0 0 24 10v7a11 11 0 0 1 11 11Z" fill="#fff" opacity=".92"/>
    </g>`;
}

function defsMarkup(c) {
  return `
    <defs>
      <linearGradient id="body" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="${c.light}"/>
        <stop offset=".48" stop-color="${c.main}"/>
        <stop offset="1" stop-color="${c.dark}"/>
      </linearGradient>
      <linearGradient id="black" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#343a40"/>
        <stop offset="1" stop-color="#11161b"/>
      </linearGradient>
      <filter id="shadow" x="-30%" y="-30%" width="160%" height="180%">
        <feDropShadow dx="0" dy="24" stdDeviation="18" flood-color="#0b1c2b" flood-opacity=".24"/>
      </filter>
      <filter id="soft"><feGaussianBlur stdDeviation="8"/></filter>
      <pattern id="fabric" width="12" height="12" patternUnits="userSpaceOnUse">
        <path d="M0 12 12 0M-4 4 4-4M8 16 16 8" stroke="#fff" stroke-opacity=".035" stroke-width="1"/>
      </pattern>
    </defs>`;
}

function mountainBackdrop() {
  return `
    <path d="M0 565 110 410l78 90 115-190 92 135 96-165 229 285Z" fill="#b9d8e8" opacity=".42"/>
    <path d="M0 620 120 500l96 70 135-170 110 115 104-128 155 233Z" fill="#6e9bb4" opacity=".28"/>
    <ellipse cx="360" cy="615" rx="225" ry="30" fill="#50697a" opacity=".18" filter="url(#soft)"/>`;
}

function frontJacket(c, detached = false) {
  const shift = detached ? -72 : 0;
  const scale = detached ? .87 : 1;
  const hood = detached ? "" : `
    <path d="M278 190c8-73 42-111 82-111s74 38 82 111l-37 22c-11-45-25-66-45-66s-34 21-45 66Z" fill="url(#black)" stroke="#0a1117" stroke-width="3"/>
    <path d="M304 187c10-39 28-59 56-59s46 20 56 59" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="5"/>`;
  return `
    <g transform="translate(${shift} 0) scale(${scale})" transform-origin="360px 350px" filter="url(#shadow)">
      ${hood}
      <path d="M260 178c30-17 65-26 100-26s70 9 100 26l70 50-48 104-52-35v278c0 18-14 32-32 32H322c-18 0-32-14-32-32V297l-52 35-48-104Z" fill="url(#body)" stroke="${c.dark}" stroke-width="3"/>
      <path d="M260 178c30-17 65-26 100-26s70 9 100 26l37 27-23 89H246l-23-89Z" fill="url(#black)"/>
      <path d="M360 154v452" stroke="#0a1117" stroke-width="8"/>
      <path d="M364 160v440" stroke="#fff" stroke-opacity=".12" stroke-width="2"/>
      <path d="M274 300h172M286 382h148M290 469h140" stroke="#101820" stroke-opacity=".24" stroke-width="3"/>
      <path d="M295 435 326 413v89l-31 18Zm130 0-31-22v89l31 18Z" fill="none" stroke="#111820" stroke-opacity=".62" stroke-width="4"/>
      <path d="M260 178c30-17 65-26 100-26s70 9 100 26l70 50-48 104-52-35v278c0 18-14 32-32 32H322c-18 0-32-14-32-32V297l-52 35-48-104Z" fill="url(#fabric)"/>
      ${brandMarkup()}
    </g>`;
}

function detachedHoodMarkup(c) {
  return `
    <g transform="translate(520 105) rotate(8)" filter="url(#shadow)">
      <path d="M0 75c12-63 42-91 83-91 45 0 78 35 91 100l-18 102c-52 16-101 10-142-17Z" fill="url(#body)" stroke="${c.dark}" stroke-width="3"/>
      <path d="M24 73c15-37 36-54 63-54 29 0 51 20 65 60l-11 70c-39 8-76 4-108-13Z" fill="url(#black)"/>
      <circle cx="19" cy="166" r="6" fill="#111820"/><circle cx="145" cy="179" r="6" fill="#111820"/>
      <path d="M20 164h-20m146 15h23" stroke="#111820" stroke-width="4"/>
      <path d="M0 75c12-63 42-91 83-91 45 0 78 35 91 100l-18 102c-52 16-101 10-142-17Z" fill="url(#fabric)"/>
    </g>`;
}

function rotatingJacket(c, frame) {
  const angle = frame * 45;
  const rad = angle * Math.PI / 180;
  const frontFactor = Math.max(0, Math.cos(rad));
  const backFactor = Math.max(0, -Math.cos(rad));
  const side = Math.abs(Math.sin(rad));
  const widthScale = .28 + .72 * Math.abs(Math.cos(rad));
  const lean = Math.sin(rad) * 28;
  const sleeveNear = 1 + side * .14;
  const sleeveFar = 1 - side * .18;
  const front = frontFactor >= backFactor;
  const logoOpacity = frontFactor > .2 ? Math.min(1, frontFactor * 1.35) : 0;
  const zipperOpacity = front ? frontFactor : 0;
  const backSeamOpacity = front ? 0 : backFactor;

  return `
    <g filter="url(#shadow)" transform="translate(${lean} 0)">
      <g transform="translate(360 0) scale(${widthScale} 1) translate(-360 0)">
        <path d="M278 190c8-73 42-111 82-111s74 38 82 111l-37 22c-11-45-25-66-45-66s-34 21-45 66Z" fill="url(#black)" stroke="#0a1117" stroke-width="3"/>
        <path d="M260 178c30-17 65-26 100-26s70 9 100 26l70 50-48 104-52-35v278c0 18-14 32-32 32H322c-18 0-32-14-32-32V297l-52 35-48-104Z" fill="url(#body)" stroke="${c.dark}" stroke-width="3"/>
        <path d="M260 178c30-17 65-26 100-26s70 9 100 26l37 27-23 89H246l-23-89Z" fill="url(#black)"/>
        <path d="M274 300h172M286 382h148M290 469h140" stroke="#101820" stroke-opacity=".24" stroke-width="3"/>
        <path d="M360 154v452" stroke="#0a1117" stroke-width="8" opacity="${zipperOpacity}"/>
        <path d="M360 174v404" stroke="#fff" stroke-opacity="${.18 * backSeamOpacity}" stroke-width="4"/>
        <g opacity="${zipperOpacity}"><path d="M295 435 326 413v89l-31 18Zm130 0-31-22v89l31 18Z" fill="none" stroke="#111820" stroke-opacity=".62" stroke-width="4"/></g>
        <path d="M260 178c30-17 65-26 100-26s70 9 100 26l70 50-48 104-52-35v278c0 18-14 32-32 32H322c-18 0-32-14-32-32V297l-52 35-48-104Z" fill="url(#fabric)"/>
        ${logoOpacity ? brandMarkup(logoOpacity) : ""}
      </g>
      <path d="M205 225c-44 40-75 106-82 208l58 15 65-160Z" fill="url(#body)" opacity="${sleeveFar}"/>
      <path d="M515 225c44 40 75 106 82 208l-58 15-65-160Z" fill="url(#body)" opacity="${sleeveNear}"/>
    </g>`;
}

function jacketSvg(frame, colorKey, detached = false) {
  const c = COLORS[colorKey];
  const content = detached
    ? `${frontJacket(c, true)}${detachedHoodMarkup(c)}`
    : rotatingJacket(c, frame);
  return `
    <svg viewBox="0 0 720 720" xmlns="http://www.w3.org/2000/svg" role="presentation">
      ${defsMarkup(c)}
      ${mountainBackdrop()}
      ${content}
    </svg>`;
}

function renderDots() {
  dots.innerHTML = Array.from({ length: FRAME_COUNT }, (_, index) =>
    `<i class="${index === state.frame ? "is-active" : ""}"></i>`
  ).join("");
}

function renderViewer() {
  if (state.mode === "hood") {
    image.innerHTML = jacketSvg(0, state.color, true);
    image.setAttribute("aria-label", `Chaqueta ${state.colorLabel} con capucha desmontable mostrada por separado`);
    hint.classList.add("is-hidden");
    controls.hidden = true;
    dots.hidden = true;
    return;
  }

  image.innerHTML = jacketSvg(state.frame, state.color, false);
  image.setAttribute("aria-label", `Chaqueta ${state.colorLabel}, vista ${Math.round(state.frame * 360 / FRAME_COUNT)} grados`);
  angleLabel.textContent = `${Math.round(state.frame * 360 / FRAME_COUNT)}°`;
  controls.hidden = false;
  dots.hidden = false;
  renderDots();
}

function setFrame(nextFrame) {
  state.frame = ((nextFrame % FRAME_COUNT) + FRAME_COUNT) % FRAME_COUNT;
  renderViewer();
}

function setMode(mode) {
  state.mode = mode;
  const is360 = mode === "360";
  tab360.classList.toggle("is-active", is360);
  tabHood.classList.toggle("is-active", !is360);
  tab360.setAttribute("aria-selected", String(is360));
  tabHood.setAttribute("aria-selected", String(!is360));
  renderViewer();
}

function pointerX(event) {
  return event.touches ? event.touches[0].clientX : event.clientX;
}

function startDrag(event) {
  if (state.mode !== "360") return;
  state.dragging = true;
  state.startX = pointerX(event);
  state.startFrame = state.frame;
  viewer.classList.add("is-dragging");
  hint.classList.add("is-hidden");
}

function moveDrag(event) {
  if (!state.dragging || state.mode !== "360") return;
  const delta = pointerX(event) - state.startX;
  const steps = Math.round(delta / 48);
  setFrame(state.startFrame - steps);
}

function endDrag() {
  state.dragging = false;
  viewer.classList.remove("is-dragging");
}

viewer.addEventListener("mousedown", startDrag);
window.addEventListener("mousemove", moveDrag);
window.addEventListener("mouseup", endDrag);
viewer.addEventListener("touchstart", startDrag, { passive: true });
viewer.addEventListener("touchmove", moveDrag, { passive: true });
viewer.addEventListener("touchend", endDrag);

document.querySelector("#rotate-left").addEventListener("click", () => setFrame(state.frame - 1));
document.querySelector("#rotate-right").addEventListener("click", () => setFrame(state.frame + 1));
tab360.addEventListener("click", () => setMode("360"));
tabHood.addEventListener("click", () => setMode("hood"));

document.querySelectorAll("[data-color]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-color]").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    state.color = button.dataset.color;
    state.colorLabel = button.dataset.label;
    state.frame = 0;
    selectedColorName.textContent = state.colorLabel;
    renderViewer();
  });
});

document.querySelectorAll("[data-size]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-size]").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    state.size = button.dataset.size;
    selectedSizeName.textContent = state.size;
  });
});

function setQuantity(value) {
  state.quantity = Math.min(10, Math.max(1, value));
  quantityOutput.value = state.quantity;
  quantityOutput.textContent = state.quantity;
}

document.querySelector("#qty-down").addEventListener("click", () => setQuantity(state.quantity - 1));
document.querySelector("#qty-up").addEventListener("click", () => setQuantity(state.quantity + 1));
document.querySelector("#buy-button").addEventListener("click", () => dialog.showModal());
document.querySelector("#dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

function buildWhatsappUrl(phone, delivery) {
  const message = [
    "¡Hola! 👋 Me interesa comprar la chaqueta acolchada térmica:",
    "",
    `🎨 Color: ${state.colorLabel}`,
    `📏 Talla: ${state.size}`,
    `🔢 Cantidad: ${state.quantity}`,
    `🚚 Entrega: ${delivery}`,
    "",
    "¿Me pueden confirmar disponibilidad, precio y condiciones de entrega?",
  ].join("\n");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

document.querySelectorAll("[data-delivery]").forEach((button) => {
  button.addEventListener("click", () => {
    const phone = PHONES[button.dataset.zone];
    const url = buildWhatsappUrl(phone, button.dataset.delivery);
    window.open(url, "_blank", "noopener,noreferrer");
    dialog.close();
  });
});

document.querySelector("#year").textContent = new Date().getFullYear();
renderViewer();
