// js/CheckoutProcess.mjs
import { getLocalStorage, setLocalStorage, removeLocalStorage, formDataToJSON, alertMessage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

// Helper function where I package cart items to match the backend API format
function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    price: item.FinalPrice || item.ListPrice,
    name: item.Name,
    quantity: item.Quantity || 1,
  }));
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    // I read the current cart items from local storage and summarize them
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSummary();
  }

  calculateItemSummary() {
    const summaryElement = document.querySelector(
      `${this.outputSelector} #subtotal`
    );
    const itemNumElement = document.querySelector(
      `${this.outputSelector} #num-items`
    );

    // I calculate the subtotal price and total item quantity
    const totalQty = this.list.reduce((sum, item) => sum + (item.Quantity || 1), 0);
    this.itemTotal = this.list.reduce(
      (sum, item) => sum + (item.FinalPrice || item.ListPrice) * (item.Quantity || 1),
      0
    );

    if (summaryElement) summaryElement.innerText = `$${this.itemTotal.toFixed(2)}`;
    if (itemNumElement) itemNumElement.innerText = totalQty;
  }

  calculateOrderTotal() {
    // I calculate shipping ($10 for 1st item, $2 for each extra) and 6% tax
    const totalQty = this.list.reduce((sum, item) => sum + (item.Quantity || 1), 0);
    this.shipping = totalQty > 0 ? 10 + (totalQty - 1) * 2 : 0;
    this.tax = this.itemTotal * 0.06;
    this.orderTotal = this.itemTotal + this.shipping + this.tax;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    // I update the DOM elements with my calculated totals
    const shippingElement = document.querySelector(
      `${this.outputSelector} #shipping`
    );
    const taxElement = document.querySelector(`${this.outputSelector} #tax`);
    const orderTotalElement = document.querySelector(
      `${this.outputSelector} #orderTotal`
    );

    if (shippingElement) shippingElement.innerText = `$${this.shipping.toFixed(2)}`;
    if (taxElement) taxElement.innerText = `$${this.tax.toFixed(2)}`;
    if (orderTotalElement) orderTotalElement.innerText = `$${this.orderTotal.toFixed(2)}`;
  }

  async checkout(form) {
    // I convert the form fields into a JSON object
    const json = formDataToJSON(form);

    // I ensure order totals are calculated before I build the final payload
    this.calculateOrderTotal();

    // I append order date, formatted totals, and formatted cart items to the request payload
    json.orderDate = new Date().toISOString();
    json.orderTotal = String(this.orderTotal.toFixed(2));
    json.tax = String(this.tax.toFixed(2));
    json.shipping = String(this.shipping.toFixed(2));
    json.items = packageItems(this.list);

    // I sanitize the card number field to remove spaces or dashes before submitting
    if (json.cardNumber) {
      json.cardNumber = json.cardNumber.replace(/[\s-]/g, "");
    }

    try {
      const res = await services.checkout(json);

      // On success, I clear local storage and redirect to the success page
      removeLocalStorage(this.key);
      window.location.href = "./success.html";
    } catch (err) {
      // On failure, I catch validation errors and display an alert banner
      if (err.name === "servicesError") {
        let message = "";
        if (typeof err.message === "object") {
          message = Object.values(err.message).flat().join("<br>");
        } else {
          message = err.message;
        }
        alertMessage(message);
      } else {
        alertMessage("An error occurred during checkout. Please try again.");
      }
    }
  }
}