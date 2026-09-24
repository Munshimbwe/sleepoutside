import { loadHeaderFooter, updateCartBadge } from "./utils.mjs";
import ShoppingCart from "./ShoppingCart.mjs";

async function initCart() {
  await loadHeaderFooter();
  updateCartBadge();

  // "so-cart" is the localStorage key, ".product-list" is the target UL/container element
  const cart = new ShoppingCart("so-cart", ".product-list");
  cart.renderCartContents();
}

initCart();