import { loadHeaderFooter, getParam } from "./utils.mjs";
import ProductData from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";

loadHeaderFooter();

const category = getParam("category") || "tents";
const dataSource = new ProductData();
const listElement = document.querySelector(".product-list");

if (listElement) {
  const myList = new ProductList(category, dataSource, listElement);
  myList.init();
}