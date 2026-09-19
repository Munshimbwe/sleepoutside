import { setLocalStorage, getLocalStorage, updateCartBadge } from "./utils.mjs";

function productDetailsTemplate(product) {
  const imageUrl = product.Images?.PrimaryLarge || product.Image || "";
  const brandName = product.Brand?.Name || product.Brand || "";
  const price = product.FinalPrice || product.ListPrice || 0;

  return `
    <section class="product-detail">
      <h3>${brandName}</h3>
      <h2 class="divider">${product.NameWithoutBrand || product.Name}</h2>
      <img
        class="divider"
        src="${imageUrl}"
        alt="${product.NameWithoutBrand || product.Name}"
      />
      <p class="product-card__price">$${Number(price).toFixed(2)}</p>
      <p class="product__color">${product.Colors?.[0]?.ColorName || ""}</p>
      <p class="product__description__html">${product.DescriptionHtmlSimple || ""}</p>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
      </div>
    </section>
  `;
}

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);

    if (!this.product) {
      const mainElement = document.querySelector("main");
      if (mainElement) {
        mainElement.innerHTML = '<p class="error">Product not found.</p>';
      }
      return;
    }

    this.renderProductDetails();

    const addToCartButton = document.getElementById("addToCart");
    if (addToCartButton) {
      addToCartButton.addEventListener("click", this.addProductToCart.bind(this));
    }
  }

  addProductToCart() {
    let cartItems = getLocalStorage("so-cart") || [];
    if (!Array.isArray(cartItems)) {
      cartItems = [];
    }

    const existingIndex = cartItems.findIndex((item) => item.Id === this.product.Id);
    if (existingIndex > -1) {
      cartItems[existingIndex].Quantity = (cartItems[existingIndex].Quantity || 1) + 1;
    } else {
      this.product.Quantity = 1;
      cartItems.push(this.product);
    }

    setLocalStorage("so-cart", cartItems);
    updateCartBadge();
  }

  renderProductDetails() {
    const mainElement = document.querySelector("main");
    if (mainElement) {
      mainElement.innerHTML = productDetailsTemplate(this.product);
    }
  }
}