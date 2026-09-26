// js/checkout.js
import CheckoutProcess from "./CheckoutProcess.mjs";

const myCheckout = new CheckoutProcess("so-cart", ".order-summary");
myCheckout.init();

// Calculate totals when user leaves the ZIP code input
document.querySelector("#zip").addEventListener("blur", () => {
  myCheckout.calculateOrderTotal();
});

// Intercept click on the checkout submit button
document.querySelector("#checkoutSubmit").addEventListener("click", (e) => {
  e.preventDefault();

  const myForm = document.forms[0]; // or document.forms["checkout"]
  const chk_status = myForm.checkValidity();
  myForm.reportValidity();

  // Only proceed if all client-side validation rules pass
  if (chk_status) {
    myCheckout.checkout(myForm);
  }
});