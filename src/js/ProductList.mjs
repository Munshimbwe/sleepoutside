import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  const imageUrl = product.Images?.PrimaryMedium || product.Image || "";
  const brandName = product.Brand?.Name || product.Brand || "";
  const price = product.FinalPrice || product.ListPrice || 0;

  return `
    <li class="product-card">
      <a href="/product_pages/index.html?product=${product.Id}">
        <img
          src="${imageUrl}"
          alt="${product.NameWithoutBrand || product.Name || 'Product Image'}"
        />
        <h3 class="card__brand">${brandName}</h3>
        <h2 class="card__name">${product.NameWithoutBrand || product.Name}</h2>
        <p class="product-card__price">$${Number(price).toFixed(2)}</p>
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
    if (!this.listElement) return;

    // Fetch products based on category using API endpoint
    const list = await this.dataSource.getData(this.category);
    this.renderList(list);

    // Dynamic Title update
    const titleElement = document.querySelector(".title");
    if (titleElement) {
      const formatted = this.category.charAt(0).toUpperCase() + this.category.slice(1);
      titleElement.textContent = `Top Products: ${formatted}`;
    }
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list, "afterbegin", true);
  }
}