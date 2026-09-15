import { getLocalStorage, setLocalStorage, updateCartCount } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  const productList = document.querySelector(".product-list");

  if (cartItems.length === 0) {
    productList.innerHTML = "<p>Your cart is currently empty.</p>";
  } else {
    productList.innerHTML = htmlItems.join("");
    
    attachRemoveListeners();
  }
}

function cartItemTemplate(item) {
  const itemTotal = (item.FinalPrice * (item.Quantity || 1)).toFixed(2);

  return `
    <li class="cart-card divider">
      <!-- 1. Added X button with data-id -->
      <span class="cart-card__remove" data-id="${item.Id}">❌</span>
      
      <a href="/product_pages/index.html?product=${item.Id}" class="cart-card__image">
        <img src="${item.Image}" alt="${item.Name}" />
      </a>
      <a href="/product_pages/index.html?product=${item.Id}">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors ? item.Colors[0].ColorName : ""}</p>
      <p class="cart-card__quantity">qty: ${item.Quantity || 1}</p>
      <p class="cart-card__price">$${itemTotal}</p>
    </li>
  `;
}


function attachRemoveListeners() {
  const removeButtons = document.querySelectorAll(".cart-card__remove");

  removeButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const idToRemove = e.target.dataset.id;
      removeFromCart(idToRemove);
    });
  });
}


function removeFromCart(id) {
  let cartItems = getLocalStorage("so-cart") || [];

  
  cartItems = cartItems.filter((item) => item.Id !== id);

  
  setLocalStorage("so-cart", cartItems);

  
  updateCartCount();
  renderCartContents();
}


renderCartContents();
updateCartCount();