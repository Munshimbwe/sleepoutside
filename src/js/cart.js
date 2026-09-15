import { getLocalStorage, setLocalStorage, updateCartCount } from "./utils.mjs";

function renderCartContents() {
  // 1. Fallback to an empty array [] if localStorage returns null
  const cartItems = getLocalStorage("so-cart") || [];
  const productList = document.querySelector(".product-list");
  const cartFooter = document.querySelector(".cart-footer");

  // 2. Check if the cart array is empty
  if (!cartItems || cartItems.length === 0) {
    productList.innerHTML = "<p class='empty-cart-msg'>Your cart is currently empty.</p>";
    
    // Hide the total/checkout section if it exists
    if (cartFooter) {
      cartFooter.classList.add("hide");
    }
    return;
  }

  // 3. Map items safely since cartItems is guaranteed to be an array
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  productList.innerHTML = htmlItems.join("");

  // Render cart total
  renderCartTotal(cartItems);

  // Attach removal event listeners
  attachRemoveListeners();
}

function renderCartTotal(cartItems) {
  const cartFooter = document.querySelector(".cart-footer");
  const cartTotal = document.querySelector(".cart-total");

  // Safeguard reduce against empty or null arrays
  const total = (cartItems || []).reduce(
    (sum, item) => sum + item.FinalPrice * (item.Quantity || 1),
    0
  );

  if (cartTotal) {
    cartTotal.innerText = `Total: $${total.toFixed(2)}`;
  }

  if (cartFooter) {
    cartFooter.classList.remove("hide");
  }
} 