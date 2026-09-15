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
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

export function calculateCartTotal(cartItems) {
  return cartItems.reduce((total, item) => {
    const price = item.FinalPrice || item.ListPrice || 0;
    const quantity = item.Quantity || 1;
    return total + price * quantity;
  }, 0);
}

export function getCartItemCount() {
  const cartItems = getLocalStorage('so-cart') || [];
  return cartItems.reduce((total, item) => total + (item.Quantity || 1), 0);
}

export function updateCartBadge() {
  const badgeElement = document.querySelector('.cart-count');
  if (!badgeElement) return;

  const count = getCartItemCount();

  if (count > 0) {
    badgeElement.textContent = count;
    badgeElement.classList.remove('hide');
  } else {
    badgeElement.classList.add('hide');
  }
}