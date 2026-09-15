import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { updateCartCount } from "./utils.mjs";


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
    
    const list = await this.dataSource.getData();

    
    const filteredList = this.filterProducts(list);

    
    this.renderList(filteredList);
  }

  filterProducts(list) {
    
    const allowedIds = ["880RR", "985RF", "985PR", "344YJ"];
    
    return list.filter((product) => allowedIds.includes(product.Id));
  }

  renderList(list) {
    const htmlList = list.map(productCardTemplate).join("");
    this.listElement.innerHTML = htmlList;
  }
}