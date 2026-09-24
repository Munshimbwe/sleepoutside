import { loadHeaderFooter, getLocalStorage, setLocalStorage } from "./utils.mjs";

const baseURL = "https://wdd330-backend.onrender.com/";

// Load header and footer dynamic templates
loadHeaderFooter();

let cartItems = [];
let itemSubtotal = 0;
let shippingFee = 0;
let taxFee = 0;
let grandTotal = 0;

// Initialize checkout on page load
initCheckout();

function initCheckout() {
  cartItems = getLocalStorage("so-cart") || [];
  calculateSubtotal();

  // Recalculate shipping and tax when the zip code field loses focus
  const zipInput = document.querySelector("#zip");
  if (zipInput) {
    zipInput.addEventListener("blur", calculateOrderTotals);
  }

  // Handle form submission
  const checkoutForm = document.forms["checkout"];
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", handleCheckoutSubmit);
  }
}

// 1. Calculate item subtotal
function calculateSubtotal() {
  itemSubtotal = cartItems.reduce((sum, item) => {
    const qty = item.Quantity || 1;
    const price = item.FinalPrice || item.ListPrice || 0;
    return sum + price * qty;
  }, 0);

  const subtotalEl = document.querySelector("#subtotal");
  if (subtotalEl) {
    subtotalEl.textContent = `$${itemSubtotal.toFixed(2)}`;
  }
}

// 2. Calculate shipping, tax, and order total
function calculateOrderTotals() {
  const totalItemCount = cartItems.reduce(
    (count, item) => count + (item.Quantity || 1),
    0
  );

  // Shipping: $10 for first item + $2 for each additional item
  shippingFee = totalItemCount > 0 ? 10 + (totalItemCount - 1) * 2 : 0;

  // 6% Tax Rate
  taxFee = itemSubtotal * 0.06;

  // Grand Total
  grandTotal = itemSubtotal + shippingFee + taxFee;

  // Update DOM elements
  const shippingEl = document.querySelector("#shipping");
  const taxEl = document.querySelector("#tax");
  const orderTotalEl = document.querySelector("#orderTotal");

  if (shippingEl) shippingEl.textContent = `$${shippingFee.toFixed(2)}`;
  if (taxEl) taxEl.textContent = `$${taxFee.toFixed(2)}`;
  if (orderTotalEl) orderTotalEl.textContent = `$${grandTotal.toFixed(2)}`;
}

// Helper to convert form data to a plain JSON object
function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};
  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

// Helper to package cart items for backend payload
function packageCartItems(items) {
  return items.map((item) => ({
    id: item.Id,
    price: item.FinalPrice || item.ListPrice,
    name: item.Name,
    quantity: item.Quantity || 1
  }));
}

// 3. Handle checkout form submission
async function handleCheckoutSubmit(e) {
  e.preventDefault();
  const formElement = e.target;

  // Check form HTML5 validation
  if (!formElement.checkValidity()) {
    formElement.reportValidity();
    return;
  }

  // Calculate totals if user submits before blurring zip code field
  if (grandTotal === 0 && cartItems.length > 0) {
    calculateOrderTotals();
  }

  const orderData = formDataToJSON(formElement);
  orderData.orderDate = new Date().toISOString();
  orderData.orderTotal = grandTotal.toFixed(2);
  orderData.tax = taxFee.toFixed(2);
  orderData.shipping = shippingFee.toFixed(2);
  orderData.items = packageCartItems(cartItems);

  try {
    const response = await fetch(`${baseURL}checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    });

    if (response.ok) {
      setLocalStorage("so-cart", []); // Clear cart on successful order
      alert("Order placed successfully!");
      window.location.href = "/index.html";
    } else {
      const errorData = await response.json();
      alert(`Checkout failed: ${JSON.stringify(errorData)}`);
    }
  } catch (error) {
    console.error("Error during checkout API submission:", error);
    alert("There was a network error processing your order. Please try again.");
  }
}