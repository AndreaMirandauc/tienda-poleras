const WHATSAPP_NUMBER = "56966690359";
const PRODUCT_NAME = "Polera Essential";
const UNIT_PRICE = 4000;

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

document.querySelector("#year").textContent = new Date().getFullYear();
setQuantity(1);
