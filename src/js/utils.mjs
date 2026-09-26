// js/utils.mjs

// 1. URL & Local Storage Utilities
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function removeLocalStorage(key) {
  localStorage.removeItem(key);
}

export function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};

  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}

// 2. Cart Calculations & UI Feedback
export function calculateCartTotal(cartItems) {
  return cartItems.reduce((total, item) => {
    const price = item.FinalPrice || item.ListPrice || 0;
    const qty = item.Quantity || 1;
    return total + price * qty;
  }, 0);
}

export function updateCartBadge() {
  const cartItems = getLocalStorage("so-cart") || [];
  const totalCount = cartItems.reduce((acc, item) => acc + (item.Quantity || 1), 0);
  const badge = document.querySelector(".cart-count");
  if (badge) {
    badge.textContent = totalCount;
    badge.style.display = totalCount > 0 ? "inline-block" : "none";
  }
}

export function animateCartIcon() {
  const cartIcon = document.querySelector(".cart") || document.querySelector("#cart-icon");

  if (cartIcon) {
    cartIcon.classList.remove("cart-animate");
    void cartIcon.offsetWidth; // Force reflow
    cartIcon.classList.add("cart-animate");

    setTimeout(() => {
      cartIcon.classList.remove("cart-animate");
    }, 600);
  }
}

// 3. Templating & Header/Footer Dynamic Loading
export function renderWithTemplate(template, parentElement, data, callback) {
  if (!parentElement) return;
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false
) {
  if (!parentElement) return;

  if (clear) {
    parentElement.innerHTML = "";
  }

  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Failed to load template at path: ${path}`);
  }
  const template = await res.text();
  return template;
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("/partials/header.html");
  const footerTemplate = await loadTemplate("/partials/footer.html");

  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  renderWithTemplate(headerTemplate, headerElement, null, updateCartBadge);
  renderWithTemplate(footerTemplate, footerElement);
}

// 4. Custom Error Alerts
export function alertMessage(message, scroll = true) {
  const alert = document.createElement("div");
  alert.classList.add("alert");

  alert.innerHTML = `
    <span>${message}</span>
    <span class="alert-close" role="button" aria-label="Close">&times;</span>
  `;

  alert.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("alert-close") ||
      e.target.innerText === "×" ||
      e.target.tagName.toLowerCase() === "span"
    ) {
      const main = document.querySelector("main");
      if (main && main.contains(this)) {
        main.removeChild(this);
      }
    }
  });

  const main = document.querySelector("main");
  if (main) {
    main.prepend(alert);
  }

  if (scroll) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}