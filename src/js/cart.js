import {
  getLocalStorage,
  setLocalStorage,
  calculateCartTotal,
  updateCartBadge
} from './utils.mjs';

function cartItemTemplate(item) {
  const quantity = item.Quantity || 1;
  const itemTotal = (item.FinalPrice * quantity).toFixed(2);

  return `<li class="cart-card divider">
    <span class="remove-item" data-id="${item.Id}" role="button" title="Remove item">❌</span>

    <a href="#" class="cart-card__image">
      <img src="${item.Image}" alt="${item.Name}" />
    </a>
    <h2 class="card__name">${item.Name}</h2>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>

    <div class="cart-card__quantity-controls">
      <button class="quantity-btn" data-id="${item.Id}" data-action="decrease">-</button>
      <span class="cart-card__quantity">qty: ${quantity}</span>
      <button class="quantity-btn" data-id="${item.Id}" data-action="increase">+</button>
    </div>

    <p class="cart-card__price">$${itemTotal}</p>
  </li>`;
}

function removeItemFromCart(productId) {
  let cartItems = getLocalStorage('so-cart') || [];
  cartItems = cartItems.filter((item) => item.Id !== productId);
  setLocalStorage('so-cart', cartItems);
  renderCartContents();
}

function changeQuantity(productId, action) {
  let cartItems = getLocalStorage('so-cart') || [];
  const itemIndex = cartItems.findIndex((item) => item.Id === productId);

  if (itemIndex > -1) {
    let currentQty = cartItems[itemIndex].Quantity || 1;

    if (action === 'increase') {
      cartItems[itemIndex].Quantity = currentQty + 1;
    } else if (action === 'decrease') {
      currentQty -= 1;
      if (currentQty > 0) {
        cartItems[itemIndex].Quantity = currentQty;
      } else {
        cartItems = cartItems.filter((item) => item.Id !== productId);
      }
    }

    setLocalStorage('so-cart', cartItems);
    renderCartContents();
  }
}

export function renderCartContents() {
  const cartItems = getLocalStorage('so-cart') || [];
  const listElement = document.querySelector('.product-list');

  if (cartItems.length > 0) {
    const htmlItems = cartItems.map((item) => cartItemTemplate(item));
    listElement.innerHTML = htmlItems.join('');

    const totalAmount = calculateCartTotal(cartItems);
    document.querySelector('.cart-total-amount').textContent = `$${totalAmount.toFixed(2)}`;
    document.querySelector('.cart-footer').classList.remove('hide');
  } else {
    listElement.innerHTML = '<p>Your cart is empty.</p>';
    document.querySelector('.cart-footer')?.classList.add('hide');
  }

  updateCartBadge();
}

document.querySelector('.product-list').addEventListener('click', (event) => {
  const target = event.target;
  const productId = target.dataset.id;

  if (target.classList.contains('remove-item')) {
    removeItemFromCart(productId);
  }

  if (target.classList.contains('quantity-btn')) {
    const action = target.dataset.action;
    changeQuantity(productId, action);
  }
});

renderCartContents();