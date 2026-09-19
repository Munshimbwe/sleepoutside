import { getLocalStorage, renderListWithTemplate } from "./utils.mjs";

function cartItemTemplate(item) {
  const imageUrl = item.Images?.PrimaryMedium || item.Image || "";
  const price = item.FinalPrice || item.ListPrice || 0;

  return `
    <li class="cart-card divider">
      <a href="/product_pages/index.html?product=${item.Id}" class="cart-card__image">
        <img src="${imageUrl}" alt="${item.Name}" />
      </a>
      <a href="/product_pages/index.html?product=${item.Id}">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors?.[0]?.ColorName || ""}</p>
      <p class="cart-card__quantity">qty: ${item.Quantity || 1}</p>
      <p class="cart-card__price">$${Number(price).toFixed(2)}</p>
    </li>
  `;
}

export default class ShoppingCart {
  constructor(key, parentElement) {
    this.key = key;
    this.parentElement = parentElement;
  }

  init() {
    const cartItems = getLocalStorage(this.key) || [];
    this.renderCartContents(cartItems);
  }

  renderCartContents(cartItems) {
    if (!this.parentElement) return;

    if (cartItems.length > 0) {
      renderListWithTemplate(cartItemTemplate, this.parentElement, cartItems, "afterbegin", true);
    } else {
      this.parentElement.innerHTML = "<p>Your cart is empty.</p>";
    }
  }
}