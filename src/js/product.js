import { setLocalStorage, getLocalStorage, updateCartCount } from "./utils.mjs"; // Add getLocalStorage
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {

  let cart = getLocalStorage("so-cart") || [];
  
  if (!Array.isArray(cart)) {
    cart = [cart];
  }

  const existingIndex = cart.findIndex((item) => item.Id === product.Id);

  if (existingIndex > -1) {
    
    cart[existingIndex].Quantity = (cart[existingIndex].Quantity || 1) + 1;
  } else {
    
    product.Quantity = 1;
    cart.push(product);
  }

  
  setLocalStorage("so-cart", cart);
}

async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
  updateCartCount(); 





