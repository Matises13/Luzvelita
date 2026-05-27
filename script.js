const productForm = document.getElementById("productForm");
const contactForm = document.getElementById("contactForm");
const productList = document.getElementById("productList");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const clearCartBtn = document.getElementById("clearCartBtn");
const verProductosBtn = document.getElementById("verProductosBtn");
const scrollTopBtn = document.getElementById("scrollTopBtn");
const carouselTrack = document.getElementById("carouselTrack");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let products = [
  {
    id: 1,
    name: "Combo Vela Horno",
    price: 15.000,
    image: "image/comboVelaHorno.jpeg",
    description: "Combo de vela aromatica, hornito y waxmelt.",
  },
  {
    id: 2,
    name: "Vela Cactus Vaso Grande",
    price: 8.000,
    image: "image/cactusVasoGrande.jpeg",
    description: "Vaso Vela Aromatica Decoración Cactus.",
  },
  {
    id: 3,
    name: "Difusor de Ambiente",
    price: 10.000,
    image: "image/difusores.jpeg",
    description: "Difusor plastico aromatizante de ambientes.",
  },
];
let cart = [];
let carouselIndex = 0;

function formatCurrency(value) {
  return `$${value.toFixed(4)}`;
}

function renderProducts() {
  productList.innerHTML = "";
  products.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <div class="card-body">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p class="price">${formatCurrency(product.price)}</p>
        <button class="btn add-to-cart" data-id="${product.id}">Agregar al carrito</button>
      </div>
    `;
    productList.appendChild(card);
  });
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => addToCart(Number(button.dataset.id)));
  });
  renderCarousel();
}

function renderCarousel() {
  const product = products[carouselIndex];
  carouselTrack.innerHTML = `
    <div class="carousel-card">
      <img src="${product.image}" alt="${product.name}" />
      <h4>${product.name}</h4>
      <p>${product.description}</p>
      <p class="price">${formatCurrency(product.price)}</p>
      <button class="btn" onclick="addToCart(${product.id})">Comprar ahora</button>
    </div>
  `;
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  const existingItem = cart.find((item) => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  renderCart();
}

function renderCart() {
  cartItems.innerHTML = "";
  if (cart.length === 0) {
    cartItems.innerHTML = `<p style="color: var(--muted);">Tu carrito está vacío. Agrega productos para verlos aquí.</p>`;
    cartTotal.textContent = "$0.00";
    return;
  }
  cart.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
      <div>
        <strong>${item.name}</strong>
        <p>${formatCurrency(item.price)} x ${item.quantity}</p>
      </div>
      <button data-id="${item.id}">Eliminar</button>
    `;
    cartItems.appendChild(cartItem);
  });

  cartItems.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => removeFromCart(Number(button.dataset.id)));
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotal.textContent = formatCurrency(total);
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  renderCart();
}

function clearCart() {
  cart = [];
  renderCart();
}

function showSection(id) {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

productForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("productName").value.trim();
  const price = Number(document.getElementById("productPrice").value);
  const image = document.getElementById("productImage").value.trim();
  const description = document.getElementById("productDescription").value.trim();

  if (!name || !price || !image || !description) return;

  const newProduct = {
    id: products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1,
    name,
    price,
    image,
    description,
  };
  products.push(newProduct);
  renderProducts();
  productForm.reset();
  alert("Producto agregado correctamente al catálogo.");
});

prevBtn.addEventListener("click", () => {
  carouselIndex = (carouselIndex - 1 + products.length) % products.length;
  renderCarousel();
});

nextBtn.addEventListener("click", () => {
  carouselIndex = (carouselIndex + 1) % products.length;
  renderCarousel();
});

clearCartBtn.addEventListener("click", () => {
  clearCart();
});

verProductosBtn.addEventListener("click", () => showSection("productos"));

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("contactName").value.trim();
  const email = document.getElementById("contactEmail").value.trim();
  const phone = document.getElementById("contactPhone").value.trim();
  const subject = document.getElementById("contactSubject").value.trim();
  const message = document.getElementById("contactMessage").value.trim();

  if (!name || !email || !subject || !message) {
    alert("Por favor, completa todos los campos obligatorios.");
    return;
  }

  alert(`¡Gracias por tu mensaje, ${name}!\nNos pondremos en contacto pronto a través de ${email}.`);
  contactForm.reset();
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function toggleScrollTopButton() {
  const nearBottom = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 20;
  if (nearBottom) {
    scrollTopBtn.classList.add("visible");
  } else {
    scrollTopBtn.classList.remove("visible");
  }
}

window.addEventListener("scroll", toggleScrollTopButton);

window.addEventListener("load", () => {
  renderProducts();
  renderCart();
  toggleScrollTopButton();
});

window.addToCart = addToCart;
