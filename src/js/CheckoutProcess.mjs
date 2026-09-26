// CheckoutProcess.mjs
import { getLocalStorage, removeLocalStorage, formDataToJSON, alertMessage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

function packageItems(items) {
  return items.map((item) => ({
    id: item.Id || item.id,
    name: item.Name || item.name,
    price: item.FinalPrice || item.price,
    quantity: item.quantity || 1,
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
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSubTotal();
  }

  calculateItemSubTotal() {
    this.itemTotal = this.list.reduce(
      (sum, item) => sum + (item.FinalPrice || item.price) * (item.quantity || 1),
      0
    );
    const subtotalElem = document.querySelector(`${this.outputSelector} #subtotal`);
    if (subtotalElem) {
      subtotalElem.innerText = `$${this.itemTotal.toFixed(2)}`;
    }
  }

  calculateOrderTotal() {
    const totalItemCount = this.list.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0
    );

    this.tax = this.itemTotal * 0.06;
    this.shipping = totalItemCount > 0 ? 10 + (totalItemCount - 1) * 2 : 0;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const taxElem = document.querySelector(`${this.outputSelector} #tax`);
    const shippingElem = document.querySelector(`${this.outputSelector} #shipping`);
    const orderTotalElem = document.querySelector(`${this.outputSelector} #orderTotal`);

    if (taxElem) taxElem.innerText = `$${this.tax.toFixed(2)}`;
    if (shippingElem) shippingElem.innerText = `$${this.shipping.toFixed(2)}`;
    if (orderTotalElem) orderTotalElem.innerText = `$${this.orderTotal.toFixed(2)}`;
  }

  async checkout(formElement) {
    const json = formDataToJSON(formElement);

    json.orderDate = new Date().toISOString();
    json.itemTotal = this.itemTotal.toFixed(2);
    json.shipping = this.shipping;
    json.tax = this.tax.toFixed(2);
    json.orderTotal = this.orderTotal.toFixed(2);
    json.items = packageItems(this.list);

    const services = new ExternalServices();

    try {
      const res = await services.checkout(json);

      // Happy Path: Clear localStorage cart state & redirect to success page
      removeLocalStorage(this.key);
      location.assign("/checkout/success.html");
      return res;

    } catch (err) {
      // Unhappy Path: Remove prior alerts before adding new ones
      this.removeAllAlerts();

      if (err.name === "servicesError") {
        // Handle object or string response messages returned by backend
        if (typeof err.message === "object") {
          for (const key in err.message) {
            alertMessage(`${key}: ${err.message[key]}`);
          }
        } else {
          alertMessage(err.message);
        }
      } else {
        alertMessage("An unexpected error occurred. Please try again.");
      }
    }
  }

  removeAllAlerts() {
    const existingAlerts = document.querySelectorAll(".alert");
    existingAlerts.forEach((alert) => alert.remove());
  }
}