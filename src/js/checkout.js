import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const myCheckout = new CheckoutProcess("so-cart", ".order-summary");
myCheckout.init();

// Calculate shipping/tax when leaving ZIP field
document.querySelector("#zip").addEventListener("blur", () => {
  myCheckout.calculateOrderTotal();
});

// Intercept form submit button
document.querySelector("#checkoutSubmit").addEventListener("click", (e) => {
  e.preventDefault();

  const myForm = document.forms["checkout"] || document.forms[0];
  const chkStatus = myForm.checkValidity();
  myForm.reportValidity();

  if (chkStatus) {
    myCheckout.checkout(myForm);
  }
});