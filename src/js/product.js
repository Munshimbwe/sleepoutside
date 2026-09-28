// js/product.js
import { getParam, loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";

// I load the common header and footer partials
loadHeaderFooter();

document.addEventListener("DOMContentLoaded", async () => {
  // I grab the product ID from the URL bar parameter (e.g. ?product=985PR)
  const productId = getParam("product");
  const dataSource = new ProductData();

  if (productId) {
    const product = new ProductDetails(productId, dataSource);
    // I await the asynchronous initialization to fetch data and render to the DOM
    await product.init();
  } else {
    // If no product ID parameter was provided, I display a friendly warning
    const mainElement = document.querySelector("main");
    if (mainElement) {
      mainElement.innerHTML = '<p class="error">No product selected.</p>';
    }
  }
});