import { getParam, loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";

loadHeaderFooter();

const productId = getParam("product");
const dataSource = new ProductData();

if (productId) {
  const product = new ProductDetails(productId, dataSource);
  product.init();
} else {
  const mainElement = document.querySelector("main");
  if (mainElement) {
    mainElement.innerHTML = '<p class="error">No product selected.</p>';
  }
}