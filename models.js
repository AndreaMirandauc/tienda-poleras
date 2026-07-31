const MODEL_PRICE = 25990;
const MODEL_DETAILS = {
  celeste: { name: "Cumbre Celeste", design: "Celeste / negro", description: "Chaqueta bicolor celeste y negra, de estilo outdoor y acolchado térmico." },
  negro: { name: "Eclipse Negra", design: "Negro total", description: "Modelo completamente negro, sobrio y fácil de combinar para el uso diario." },
  rojo: { name: "Cumbre Roja", design: "Rojo / negro", description: "Modelo rojo intenso con panel superior negro y acabado acolchado de invierno." },
  crema: { name: "Arena Crema", design: "Crema / negro", description: "Modelo crema cálido con contraste negro, moderno y de apariencia premium." },
  verde: { name: "Bosque Verde", design: "Verde / negro", description: "Chaqueta verde bosque con parte superior negra y estética outdoor clásica." },
  grafito: { name: "Cordillera Grafito", design: "Gris grafito / negro", description: "Modelo gris grafito con contraste negro, discreto y versátil." },
  montaña: { name: "Montaña Bicolor", design: "Estampado blanco y negro", description: "Diseño estampado inspirado en relieves de montaña, con panel superior negro." },
  bosque: { name: "Bosque Nevado", design: "Estampado ramas crema", description: "Estampado de ramas invernales en tonos crema, gris y negro." },
};

Object.assign(COLORS, {
  verde: { label: "Verde", main: "#2f6758", light: "#568f7e", dark: "#17473b" },
  grafito: { label: "Grafito", main: "#555a61", light: "#777d86", dark: "#34383e" },
  montaña: { label: "Montaña", main: "#30343a", light: "#eef1f3", dark: "#11151a", pattern: "mountain" },
  bosque: { label: "Bosque nevado", main: "#b9ad99", light: "#ede3d3", dark: "#38383b", pattern: "branches" },
});

const originalDefsMarkup = defsMarkup;
defsMarkup = function (color) {
  if (color.pattern === "mountain") {
    return `
      <defs>
        <pattern id="body" width="130" height="105" patternUnits="userSpaceOnUse">
          <rect width="130" height="105" fill="#20242a"/>
          <path d="M-15 92 22 34l22 31 28-46 30 41 24-26 32 58Z" fill="#edf1f3"/>
          <path d="M-6 101 36 54l20 25 30-37 38 59Z" fill="#79818a" opacity=".56"/>
        </pattern>
        <linearGradient id="black" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#343a40"/><stop offset="1" stop-color="#11161b"/></linearGradient>
        <filter id="shadow" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="24" stdDeviation="18" flood-color="#0b1c2b" flood-opacity=".24"/></filter>
        <filter id="soft"><feGaussianBlur stdDeviation="8"/></filter>
        <pattern id="fabric" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M0 12 12 0M-4 4 4-4M8 16 16 8" stroke="#fff" stroke-opacity=".035" stroke-width="1"/></pattern>
      </defs>`;
  }
  if (color.pattern === "branches") {
    return `
      <defs>
        <pattern id="body" width="150" height="120" patternUnits="userSpaceOnUse">
          <rect width="150" height="120" fill="#e7dccb"/>
          <path d="M-15 112C25 78 30 35 78-8M28 126C48 84 84 53 164 28M63 118C89 92 104 60 118-9" fill="none" stroke="#3d3e43" stroke-width="5"/>
          <path d="M18 96 2 73m50 11-21-26m61 15-18-25m38 9 24-22" stroke="#777379" stroke-width="3"/>
        </pattern>
        <linearGradient id="black" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#343a40"/><stop offset="1" stop-color="#11161b"/></linearGradient>
        <filter id="shadow" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="24" stdDeviation="18" flood-color="#0b1c2b" flood-opacity=".24"/></filter>
        <filter id="soft"><feGaussianBlur stdDeviation="8"/></filter>
        <pattern id="fabric" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M0 12 12 0M-4 4 4-4M8 16 16 8" stroke="#fff" stroke-opacity=".035" stroke-width="1"/></pattern>
      </defs>`;
  }
  return originalDefsMarkup(color);
};

function swatchStyle(key) {
  const color = COLORS[key];
  if (key === "montaña") return "background:linear-gradient(135deg,#1d2228 0 35%,#eef1f3 35% 52%,#5f6872 52% 68%,#171b20 68%)";
  if (key === "bosque") return "background:repeating-linear-gradient(125deg,#e7dccb 0 9px,#4d4d52 10px 12px,#b7ac9d 13px 20px)";
  return `background:linear-gradient(135deg,#171b20 0 38%,${color.main} 38%)`;
}

function updateModelUI(key, scrollToViewer = false) {
  const details = MODEL_DETAILS[key];
  if (!details) return;
  state.color = key;
  state.colorLabel = details.design;
  state.frame = 0;
  document.querySelector("#selected-model-title").textContent = details.name;
  document.querySelector("#selected-model-name").textContent = details.name;
  document.querySelector("#selected-model-description").textContent = details.description;
  document.querySelectorAll("[data-model-card]").forEach((card) => card.classList.toggle("is-active", card.dataset.modelCard === key));
  document.querySelectorAll("[data-model-option]").forEach((option) => option.classList.toggle("is-active", option.dataset.modelOption === key));
  renderViewer();
  if (scrollToViewer) document.querySelector("#producto").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderModels() {
  const grid = document.querySelector("#model-grid");
  const options = document.querySelector("#model-options");
  grid.innerHTML = Object.entries(MODEL_DETAILS).map(([key, details]) => `
    <button class="model-card ${key === state.color ? "is-active" : ""}" type="button" data-model-card="${key}">
      <span class="model-card-art">${jacketSvg(0, key, false)}</span>
      <span class="model-card-copy"><small>${details.design}</small><strong>${details.name}</strong><b>${formatPrice(MODEL_PRICE)}</b></span>
    </button>`).join("");
  options.innerHTML = Object.keys(MODEL_DETAILS).map((key) => `
    <button class="model-option ${key === state.color ? "is-active" : ""}" type="button" data-model-option="${key}" aria-label="${MODEL_DETAILS[key].name}" title="${MODEL_DETAILS[key].name}" style="${swatchStyle(key)}"></button>`).join("");
  grid.querySelectorAll("[data-model-card]").forEach((button) => button.addEventListener("click", () => updateModelUI(button.dataset.modelCard, true)));
  options.querySelectorAll("[data-model-option]").forEach((button) => button.addEventListener("click", () => updateModelUI(button.dataset.modelOption, false)));
}

buildWhatsappUrl = function (phone, delivery) {
  const details = MODEL_DETAILS[state.color];
  const total = MODEL_PRICE * state.quantity;
  const message = [
    "¡Hola! 👋 Me interesa comprar una chaqueta LOWY:",
    "",
    `🧥 Modelo: ${details.name}`,
    `🎨 Diseño: ${details.design}`,
    `📏 Talla: ${state.size}`,
    `🔢 Cantidad: ${state.quantity}`,
    `💰 Precio unitario: ${formatPrice(MODEL_PRICE)}`,
    `💵 Total: ${formatPrice(total)}`,
    `🚚 Entrega: ${delivery}`,
    "",
    "¿Me pueden confirmar disponibilidad y condiciones de entrega?",
  ].join("\n");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};

renderModels();
updateModelUI("celeste");
