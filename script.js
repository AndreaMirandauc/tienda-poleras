const WHATSAPP_NUMBER = "56966690359";

const PRODUCTS = [
  {
    id: "polera-essential",
    name: "Polera Essential",
    category: "Poleras",
    description: "Polera cómoda de calce relajado, cuello redondo y estilo versátil para todos los días.",
    price: 4000,
    stock: 12,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Negro", hex: "#1d1d1a" },
      { name: "Blanco", hex: "#ebe8df" },
      { name: "Beige", hex: "#b89568" },
    ],
    art: "shirt",
    garmentLight: "#30302d",
    garmentDark: "#11110f",
    background: "#f1ebdf",
    accent: "#f26a38",
    badge: "Precio lanzamiento",
  },
  {
    id: "pantalon-urban",
    name: "Pantalón Urban",
    category: "Pantalones",
    description: "Pantalón de calce relajado y diseño urbano, pensado para combinar comodidad y estilo.",
    price: 9990,
    stock: 10,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Negro", hex: "#20201e" },
      { name: "Gris", hex: "#72716c" },
    ],
    art: "pants",
    garmentLight: "#3a3a37",
    garmentDark: "#161614",
    background: "#e8ece7",
    accent: "#9eb5a6",
    badge: "10 unidades",
  },
];

const state = {
  category: "Todos",
  search: "",
  selectedProduct: null,
  quantity: 1,
  cart: loadCart(),
};

const elements = {
  productGrid: document.querySelector("#product-grid"),
  emptyState: document.querySelector("#empty-state"),
  filters: document.querySelector("#category-filters"),
  search: document.querySelector("#product-search"),
  dialog: document.querySelector("#product-dialog"),
  dialogArt: document.querySelector("#dialog-art"),
  dialogCategory: document.querySelector("#dialog-category"),
  dialogName: document.querySelector("#dialog-name"),
  dialogDescription: document.querySelector("#dialog-description"),
  dialogPrice: document.querySelector("#dialog-price"),
  colorOptions: document.querySelector("#color-options"),
  sizeOptions: document.querySelector("#size-options"),
  colorLabel: document.querySelector("#selected-color-label"),
  productForm: document.querySelector("#product-form"),
  quantityOutput: document.querySelector("#dialog-quantity"),
  quantityMinus: document.querySelector("#quantity-minus"),
  quantityPlus: document.querySelector("#quantity-plus"),
  closeDialog: document.querySelector("#close-product-dialog"),
  cartDrawer: document.querySelector("#cart-drawer"),
  drawerBackdrop: document.querySelector("#drawer-backdrop"),
  openCart: document.querySelector("#open-cart"),
  closeCart: document.querySelector("#close-cart"),
  continueShopping: document.querySelector("#continue-shopping"),
  cartItems: document.querySelector("#cart-items"),
  cartEmpty: document.querySelector("#cart-empty"),
  cartSummary: document.querySelector("#cart-summary"),
  cartCount: document.querySelector("#cart-count"),
  cartTotal: document.querySelector("#cart-total"),
  checkout: document.querySelector("#checkout-whatsapp"),
  clearCart: document.querySelector("#clear-cart"),
  floatingWhatsapp: document.querySelector("#floating-whatsapp"),
  toast: document.querySelector("#toast"),
};

function formatPrice(value) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem("lowy-cart"));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem("lowy-cart", JSON.stringify(state.cart));
}

function artMarkup(product) {
  const style = `--garment-light:${product.garmentLight};--garment-dark:${product.garmentDark};`;
  return `<div class="product-art art-${product.art}" style="${style}" aria-hidden="true"></div>`;
}

function productWhatsAppUrl(product) {
  const message = [
    "Hola 👋 Me interesa este producto de LOWY:",
    "",
    `• ${product.name}`,
    `• Precio: ${formatPrice(product.price)}`,
    "",
    "¿Qué tallas y colores tienen disponibles?",
  ].join("\n");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function renderFilters() {
  const categories = ["Todos", ...new Set(PRODUCTS.map((product) => product.category))];
  elements.filters.innerHTML = categories.map((category) => `
    <button class="filter-chip ${category === state.category ? "active" : ""}" type="button" data-category="${escapeHtml(category)}">${escapeHtml(category)}</button>
  `).join("");
}

function filteredProducts() {
  const term = state.search.trim().toLocaleLowerCase("es");
  return PRODUCTS.filter((product) => {
    const matchesCategory = state.category === "Todos" || product.category === state.category;
    const haystack = `${product.name} ${product.category} ${product.description}`.toLocaleLowerCase("es");
    return matchesCategory && (!term || haystack.includes(term));
  });
}

function renderProducts() {
  const products = filteredProducts();
  elements.productGrid.innerHTML = products.map((product) => `
    <article class="product-card">
      <div class="product-visual" style="--product-bg:${product.background};--accent:${product.accent}">
        ${product.badge ? `<span class="product-badge">${escapeHtml(product.badge)}</span>` : ""}
        ${artMarkup(product)}
      </div>
      <div class="product-info-card">
        <div class="product-meta">
          <div><p class="product-category">${escapeHtml(product.category)}</p><h3 class="product-name">${escapeHtml(product.name)}</h3></div>
          <p class="product-price">${formatPrice(product.price)}</p>
        </div>
        <p class="product-stock">● ${product.stock} unidades disponibles</p>
        <div class="product-actions">
          <button class="quick-view" type="button" data-product-id="${product.id}">Elegir opciones</button>
          <a class="direct-whatsapp" href="${productWhatsAppUrl(product)}" target="_blank" rel="noopener noreferrer" aria-label="Consultar ${escapeHtml(product.name)} por WhatsApp">
            <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16.04 3a12.76 12.76 0 0 0-10.9 19.4L3.34 29l6.76-1.77A12.77 12.77 0 1 0 16.04 3Zm0 23.37c-2.1 0-4.15-.56-5.94-1.62l-.42-.25-4 .99 1.06-3.87-.28-.44a10.57 10.57 0 1 1 9.58 5.19Zm5.8-7.9c-.32-.16-1.88-.92-2.17-1.03-.29-.1-.5-.16-.71.16-.21.32-.82 1.03-1 1.24-.19.21-.37.24-.69.08-.32-.16-1.34-.49-2.55-1.57-.94-.84-1.58-1.88-1.76-2.2-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.18.21-.32.32-.52.1-.21.05-.4-.03-.56-.08-.16-.71-1.72-.98-2.35-.25-.62-.52-.54-.71-.55h-.61c-.21 0-.55.08-.84.4-.29.31-1.11 1.08-1.11 2.64s1.14 3.07 1.29 3.28c.16.21 2.24 3.42 5.42 4.8.76.32 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.88-.77 2.14-1.51.27-.74.27-1.38.19-1.51-.08-.13-.29-.21-.61-.37Z" /></svg>
          </a>
        </div>
      </div>
    </article>
  `).join("");
  elements.emptyState.hidden = products.length > 0;
}

function openProduct(productId) {
  const product = PRODUCTS.find((item) => item.id === productId);
  if (!product) return;
  state.selectedProduct = product;
  state.quantity = 1;
  elements.dialogCategory.textContent = product.category;
  elements.dialogName.textContent = product.name;
  elements.dialogDescription.textContent = product.description;
  elements.dialogPrice.textContent = formatPrice(product.price);
  elements.dialogArt.style.setProperty("--accent", product.accent);
  elements.dialogArt.style.background = product.background;
  elements.dialogArt.innerHTML = artMarkup(product);
  elements.colorOptions.innerHTML = product.colors.map((color, index) => `
    <label class="variant-option">
      <input type="radio" name="product-color" value="${escapeHtml(color.name)}" ${index === 0 ? "checked" : ""} />
      <span class="color-swatch" style="background:${color.hex}" title="${escapeHtml(color.name)}"></span>
      <span class="sr-only">${escapeHtml(color.name)}</span>
    </label>
  `).join("");
  elements.sizeOptions.innerHTML = product.sizes.map((size, index) => `
    <label class="size-option"><input type="radio" name="product-size" value="${escapeHtml(size)}" ${index === 0 ? "checked" : ""} /><span>${escapeHtml(size)}</span></label>
  `).join("");
  elements.colorLabel.textContent = product.colors[0].name;
  updateQuantity(1);
  elements.dialog.showModal();
}

function updateQuantity(next) {
  const max = state.selectedProduct?.stock ?? 1;
  state.quantity = Math.max(1, Math.min(max, next));
  elements.quantityOutput.value = state.quantity;
  elements.quantityOutput.textContent = state.quantity;
  elements.quantityMinus.disabled = state.quantity === 1;
  elements.quantityPlus.disabled = state.quantity === max;
}

function addSelectedProduct() {
  const product = state.selectedProduct;
  if (!product) return;
  const data = new FormData(elements.productForm);
  const color = data.get("product-color");
  const size = data.get("product-size");
  const key = `${product.id}-${color}-${size}`;
  const existing = state.cart.find((item) => item.key === key);
  if (existing) {
    existing.quantity = Math.min(product.stock, existing.quantity + state.quantity);
  } else {
    state.cart.push({ key, productId: product.id, name: product.name, price: product.price, color, size, quantity: state.quantity, art: product.art, garmentLight: product.garmentLight, garmentDark: product.garmentDark });
  }
  saveCart();
  renderCart();
  elements.dialog.close();
  showToast("Producto agregado al carrito");
}

function removeItem(key) {
  state.cart = state.cart.filter((item) => item.key !== key);
  saveCart();
  renderCart();
}

function checkoutUrl() {
  const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const lines = state.cart.flatMap((item, index) => [
    `${index + 1}. ${item.name}`,
    `   Talla: ${item.size} | Color: ${item.color}`,
    `   Cantidad: ${item.quantity} | Subtotal: ${formatPrice(item.price * item.quantity)}`,
  ]);
  const message = [
    "Hola 👋 Quiero realizar este pedido en LOWY:",
    "",
    ...lines,
    "",
    `Total estimado: ${formatPrice(total)}`,
    "",
    "¿Me pueden confirmar el stock y coordinar la entrega?",
  ].join("\n");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function renderCart() {
  const itemCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  elements.cartCount.textContent = itemCount;
  elements.cartItems.innerHTML = state.cart.map((item) => `
    <article class="cart-item">
      <div class="cart-thumb">${artMarkup(item)}</div>
      <div><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.color)} · Talla ${escapeHtml(item.size)} · ${item.quantity} unidad${item.quantity === 1 ? "" : "es"}</p><strong>${formatPrice(item.price * item.quantity)}</strong></div>
      <button class="remove-item" type="button" data-remove-key="${escapeHtml(item.key)}" aria-label="Eliminar ${escapeHtml(item.name)}">×</button>
    </article>
  `).join("");
  const hasItems = state.cart.length > 0;
  elements.cartEmpty.hidden = hasItems;
  elements.cartSummary.hidden = !hasItems;
  elements.cartTotal.textContent = formatPrice(total);
  elements.checkout.href = hasItems ? checkoutUrl() : "#";
}

function openCart() {
  elements.cartDrawer.classList.add("open");
  elements.cartDrawer.setAttribute("aria-hidden", "false");
  elements.openCart.setAttribute("aria-expanded", "true");
  elements.drawerBackdrop.hidden = false;
  document.body.classList.add("drawer-open");
  elements.closeCart.focus();
}

function closeCart() {
  elements.cartDrawer.classList.remove("open");
  elements.cartDrawer.setAttribute("aria-hidden", "true");
  elements.openCart.setAttribute("aria-expanded", "false");
  elements.drawerBackdrop.hidden = true;
  document.body.classList.remove("drawer-open");
}

let toastTimer;
function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => elements.toast.classList.remove("show"), 2200);
}

elements.filters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  state.category = button.dataset.category;
  renderFilters();
  renderProducts();
});

elements.search.addEventListener("input", (event) => {
  state.search = event.target.value;
  renderProducts();
});

elements.productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-product-id]");
  if (button) openProduct(button.dataset.productId);
});

elements.colorOptions.addEventListener("change", (event) => {
  if (event.target.name === "product-color") elements.colorLabel.textContent = event.target.value;
});

elements.quantityMinus.addEventListener("click", () => updateQuantity(state.quantity - 1));
elements.quantityPlus.addEventListener("click", () => updateQuantity(state.quantity + 1));
elements.productForm.addEventListener("submit", (event) => { event.preventDefault(); addSelectedProduct(); });
elements.closeDialog.addEventListener("click", () => elements.dialog.close());
elements.dialog.addEventListener("click", (event) => { if (event.target === elements.dialog) elements.dialog.close(); });
elements.openCart.addEventListener("click", openCart);
elements.closeCart.addEventListener("click", closeCart);
elements.drawerBackdrop.addEventListener("click", closeCart);
elements.continueShopping.addEventListener("click", () => { closeCart(); document.querySelector("#productos").scrollIntoView(); });
elements.cartItems.addEventListener("click", (event) => { const button = event.target.closest("[data-remove-key]"); if (button) removeItem(button.dataset.removeKey); });
elements.clearCart.addEventListener("click", () => { state.cart = []; saveCart(); renderCart(); });
elements.floatingWhatsapp.addEventListener("click", () => { if (state.cart.length) openCart(); else window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola 👋 Quisiera conocer los productos disponibles en LOWY")}`, "_blank", "noopener,noreferrer"); });
document.addEventListener("keydown", (event) => { if (event.key === "Escape" && elements.cartDrawer.classList.contains("open")) closeCart(); });
document.querySelector("#year").textContent = new Date().getFullYear();

renderFilters();
renderProducts();
renderCart();
