// js/ProductList.mjs
import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  const imageUrl = product.Images?.PrimaryMedium || product.Image || "";
  const brandName = product.Brand?.Name || product.Brand || "";
  const price = product.FinalPrice || product.ListPrice || 0;

  // I calculate whether a discount applies and compute the percentage
  const hasDiscount =
    product.ListPrice &&
    product.FinalPrice &&
    product.ListPrice > product.FinalPrice;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.ListPrice - product.FinalPrice) / product.ListPrice) * 100
      )
    : 0;

  return `
    <li class="product-card">
      <a href="../product_pages/index.html?product=${product.Id}">
        <img
          src="${imageUrl}"
          alt="${product.NameWithoutBrand || product.Name || "Product Image"}"
        />
        <h3 class="card__brand">${brandName}</h3>
        <h2 class="card__name">${
          product.NameWithoutBrand || product.Name
        }</h2>
        <p class="product-card__price">
          $${Number(price).toFixed(2)}
          ${
            hasDiscount
              ? `<span class="discount-badge">-${discountPercent}% OFF</span>`
              : ""
          }
        </p>
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

    try {
      // I fetch product data for the given category from my data source
      let list = await this.dataSource.getData(this.category);

      // I ensure list is an array, unwrapping list.Result if the API returns a wrapper object
      if (list && !Array.isArray(list) && Array.isArray(list.Result)) {
        list = list.Result;
      }

      if (Array.isArray(list) && list.length > 0) {
        this.renderList(list);
      } else {
        this.listElement.innerHTML = `<p>No products found for "${this.category}".</p>`;
      }
    } catch (error) {
      // I log fetch errors and display a friendly notice to the user
      console.error("I encountered an error fetching product list:", error);
      this.listElement.innerHTML = `<p>Unable to load products. Please try again later.</p>`;
    }

    // I update the dynamic category title in the DOM
    const titleElement = document.querySelector(".title");
    if (titleElement) {
      const formatted =
        this.category.charAt(0).toUpperCase() + this.category.slice(1);
      titleElement.textContent = `Top Products: ${formatted}`;
    }
  }

  renderList(list) {
    // I render the array of products into the list element using my template function
    renderListWithTemplate(
      productCardTemplate,
      this.listElement,
      list,
      "afterbegin",
      true
    );
  }
}