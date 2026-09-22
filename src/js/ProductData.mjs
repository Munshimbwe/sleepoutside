const baseURL = "https://wdd330-backend.onrender.com/"; // Replace with your actual base API URL if different

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ProductData {
  constructor() {}

  // Fetch list of products by category (e.g., "tents", "backpacks")
  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  // Fetch product list by a search query term
  async searchProducts(searchTerm) {
    const response = await fetch(`${baseURL}products/search/${searchTerm}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  // Fetch a single product detail by ID
  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }
}