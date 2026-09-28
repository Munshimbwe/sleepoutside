// js/product-listing.js
import { loadHeaderFooter, getParam } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";

// I load the common header and footer partials
loadHeaderFooter();

document.addEventListener("DOMContentLoaded", () => {
  // I grab the category parameter from the URL, defaulting to 'tents'
  const category = getParam("category") || "tents";
  const dataSource = new ExternalServices();
  const listElement = document.querySelector(".product-list");

  // I initialize and run the product list renderer
  if (listElement) {
    const myList = new ProductList(category, dataSource, listElement);
    myList.init();
  } else {
    console.error("I could not find the .product-list element in the DOM.");
  }
});