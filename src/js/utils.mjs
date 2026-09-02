export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function updateCartCount() {
  const cart = getLocalStorage("so-cart") || [];
  const badgeElement = qs("#cart-count");

  if (!badgeElement) return;

  const totalItems = cart.reduce((sum, item) => sum + (item.Quantity || 1), 0);

  if (totalItems > 0) {
    badgeElement.textContent = totalItems;
    badgeElement.style.display = "inline-block";
  } else {
    badgeElement.style.display = "none";
  }
}