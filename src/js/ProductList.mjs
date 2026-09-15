import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { updateCartCount } from "./utils.mjs";

// Pass ProductData into ProductList as the dataSource
const dataSource = new ProductData("tents");
const listElement = document.querySelector(".product-list");

const productList = new ProductList("tents", dataSource, listElement);
productList.init();

updateCartCount();

function productCardTemplate(product) {
  return `
    <li class="product-card">
      <a href="product_pages/index.html?product=${product.Id}">
        <img
          src="${product.Image}"
          alt="${product.NameWithoutBrand}"
        />
        <h3 class="card__brand">${product.Brand.Name}</h3>
        <h2 class="card__name">${product.NameWithoutBrand}</h2>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
    </li>
  `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    // 1. Fetch all products from tents.json
    const list = await this.dataSource.getData();

    // 2. Filter list to keep ONLY the 4 active products
    const filteredList = this.filterProducts(list);

    // 3. Render the filtered list to the DOM
    this.renderList(filteredList);
  }

  filterProducts(list) {
    // Array of the IDs for the 4 products currently in stock / visible
    const allowedIds = ["880RR", "985RF", "985PR", "344YJ"];
    
    return list.filter((product) => allowedIds.includes(product.Id));
  }

  renderList(list) {
    const htmlList = list.map(productCardTemplate).join("");
    this.listElement.innerHTML = htmlList;
  }
}