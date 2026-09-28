// js/ExternalServices.mjs
import { getLocalStorage } from "./utils.mjs";

const baseURL = "https://wdd330-backend.onrender.com";

async function convertToJson(res) {
  const jsonResponse = await res.json();
  if (res.ok) {
    return jsonResponse;
  } else {
    // I throw a custom error object so CheckoutProcess and other caller modules can catch validation errors
    throw { name: "servicesError", message: jsonResponse };
  }
}

export default class ExternalServices {
  constructor() {
    this.baseURL = baseURL;
  }

  // I fetch a list of products filtered by category
  async getData(category) {
    const response = await fetch(`${this.baseURL}/products/search/${category}`);
    const data = await convertToJson(response);
    // I return the nested Result array from the API response
    return data.Result;
  }

  // I fetch a single product's details using its ID
  async findProductById(id) {
    const response = await fetch(`${this.baseURL}/product/${id}`);
    const data = await convertToJson(response);
    // I handle both direct objects and nested Result payloads
    return data.Result || data;
  }

  // I send the checkout payload to the order endpoint
  async checkout(payload) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    const response = await fetch(`${this.baseURL}/checkout`, options);
    return await convertToJson(response);
  }
}