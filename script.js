const WHATSAPP_NUMBER = "56966690359";
const PRODUCT_NAME = "Polera Essential";
const UNIT_PRICE = 4000;
const PANTS_NAME = "Pantalón Urban";
const PANTS_UNIT_PRICE = 9990;
const PANTS_STOCK = 10;

const form = document.querySelector("#product-form");
const quantityOutput = document.querySelector("#quantity");
const decreaseButton = document.querySelector("#decrease");
const increaseButton = document.querySelector("#increase");
const whatsappButton = document.querySelector("#whatsapp-button");
const footerWhatsapp = document.querySelector("#footer-whatsapp");
const selectedColor = document.querySelector("#selected-color");
const shirtBody = document.querySelector(".shirt-body");
const shirtLogo = document.querySelector(".shirt-logo");
const sizeGuide = document.querySelector("#size-guide");
const openSizeGuide = document.querySelector("#open-size-guide");
const closeSizeGuide = document.querySelector("#close-size-guide");

let quantity = 1;
let pantsQuantity = 1;

const pantsForm = document.querySelector("#pants-form");
const pantsQuantityOutput = document.querySelector("#pants-quantity");
const pantsDecreaseButton = document.querySelector("#pants-decrease");
const pantsIncreaseButton = document.querySelector("#pants-increase");
const pantsWhatsappButton = document.querySelector("#pants-whatsapp-button");

const colorStyles = {
  Negro: { shirt: "#1d1d1a", logo: "#f6f1e9" },
  Blanco: { shirt: "#ebe8df", logo: "#1d1d1a" },
  Beige: { shirt: "#b89568", logo: "#fffaf0" },
};

function formatPrice(value) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}

function getSelection() {
  const data = new FormData(form);
  return {
    color: data.get("color"),
    size: data.get("size"),
  };
}

function buildWhatsappUrl() {
  const { color, size } = getSelection();
  const total = UNIT_PRICE * quantity;
  const message = [
    "¡Hola! 👋 Me interesa comprar:",
    "",
    `👕 ${PRODUCT_NAME}`,
    `🎨 Color: ${color}`,
    `📏 Talla: ${size}`,
    `🔢 Cantidad: ${quantity}`,
    `💰 Total: ${formatPrice(total)}`,
    "",
    "¿Está disponible? Quisiera coordinar el pago y el despacho.",
  ].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function updatePurchaseLink() {
  const url = buildWhatsappUrl();
  whatsappButton.href = url;
  footerWhatsapp.href = url;
}

function setQuantity(nextQuantity) {
  quantity = Math.min(10, Math.max(1, nextQuantity));
  quantityOutput.value = quantity;
  quantityOutput.textContent = quantity;
  decreaseButton.disabled = quantity === 1;
  increaseButton.disabled = quantity === 10;
  updatePurchaseLink();
}

decreaseButton.addEventListener("click", () => setQuantity(quantity - 1));
increaseButton.addEventListener("click", () => setQuantity(quantity + 1));

form.addEventListener("change", () => {
  const { color } = getSelection();
  const palette = colorStyles[color];

  selectedColor.textContent = color;
  shirtBody.style.fill = palette.shirt;
  shirtLogo.style.fill = palette.logo;
  updatePurchaseLink();
});

openSizeGuide.addEventListener("click", () => sizeGuide.showModal());
closeSizeGuide.addEventListener("click", () => sizeGuide.close());
sizeGuide.addEventListener("click", (event) => {
  if (event.target === sizeGuide) {
    sizeGuide.close();
  }
});


function buildPantsWhatsappUrl() {
  const data = new FormData(pantsForm);
  const size = data.get("pants-size");
  const total = PANTS_UNIT_PRICE * pantsQuantity;
  const message = [
    "¡Hola! 👋 Me interesa comprar:",
    "",
    `👖 ${PANTS_NAME}`,
    `📏 Talla: ${size}`,
    `🔢 Cantidad: ${pantsQuantity}`,
    `💰 Total: ${formatPrice(total)}`,
    "",
    "¿Está disponible? Quisiera coordinar el pago y el despacho.",
  ].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function updatePantsPurchaseLink() {
  pantsWhatsappButton.href = buildPantsWhatsappUrl();
}

function setPantsQuantity(nextQuantity) {
  pantsQuantity = Math.min(PANTS_STOCK, Math.max(1, nextQuantity));
  pantsQuantityOutput.value = pantsQuantity;
  pantsQuantityOutput.textContent = pantsQuantity;
  pantsDecreaseButton.disabled = pantsQuantity === 1;
  pantsIncreaseButton.disabled = pantsQuantity === PANTS_STOCK;
  updatePantsPurchaseLink();
}

pantsDecreaseButton.addEventListener("click", () => setPantsQuantity(pantsQuantity - 1));
pantsIncreaseButton.addEventListener("click", () => setPantsQuantity(pantsQuantity + 1));
pantsForm.addEventListener("change", updatePantsPurchaseLink);

document.querySelector("#year").textContent = new Date().getFullYear();
setQuantity(1);
setPantsQuantity(1);
