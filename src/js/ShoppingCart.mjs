import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function cartItemTemplate(item) {
  const imageUrl = item.Images?.PrimaryMedium || item.Image || "";
  const colorName = item.Colors?.[0]?.ColorName || "Default";

  return `
    <li class="cart-card story-card">
      <a href="../product_pages/index.html?product=${item.Id}" class="cart-card__image">
        <img src="${imageUrl}" alt="${item.Name}" />
      </a>
      <a href="../product_pages/index.html?product=${item.Id}">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${colorName}</p>
      <p class="cart-card__quantity">qty: ${item.Quantity || 1}</p>
      <p class="cart-card__price">$${Number(item.FinalPrice || item.ListPrice).toFixed(2)}</p>
      <span class="cart-card__remove" data-id="${item.Id}">X</span>
    </li>
  `;
}

export default class ShoppingCart {
  constructor(key, parentSelector) {
    this.key = key;
    this.parentSelector = parentSelector;
  }

  renderCartContents() {
    const cartItems = getLocalStorage(this.key) || [];
    const element = document.querySelector(this.parentSelector);

    if (!element) return;

    if (cartItems.length > 0) {
      const htmlItems = cartItems.map((item) => cartItemTemplate(item));
      element.innerHTML = htmlItems.join("");
      this.calculateListTotal(cartItems);
      this.addRemoveListeners();
    } else {
      element.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;
      this.hideCartTotal();
    }
  }

  calculateListTotal(items) {
    const total = items.reduce(
      (sum, item) => sum + (item.FinalPrice || item.ListPrice) * (item.Quantity || 1),
      0
    );

    const totalElement = document.querySelector(".cart-total");
    const footerElement = document.querySelector(".cart-footer");

    if (totalElement && footerElement) {
      totalElement.innerText = `Total: $${total.toFixed(2)}`;
      footerElement.classList.remove("hide");
    }
  }

  hideCartTotal() {
    const footerElement = document.querySelector(".cart-footer");
    if (footerElement) {
      footerElement.classList.add("hide");
    }
  }

  addRemoveListeners() {
    const removeButtons = document.querySelectorAll(".cart-card__remove");
    removeButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const idToRemove = e.target.dataset.id;
        this.removeItem(idToRemove);
      });
    });
  }

  removeItem(id) {
    let cartItems = getLocalStorage(this.key) || [];
    
    // Find index of first item matching ID to remove single instance
    const index = cartItems.findIndex((item) => item.Id === id);
    if (index !== -1) {
      cartItems.splice(index, 1);
      setLocalStorage(this.key, cartItems);
      this.renderCartContents(); // Re-render updated list
    }
  }
}