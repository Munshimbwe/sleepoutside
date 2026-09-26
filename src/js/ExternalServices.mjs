import { getLocalStorage } from "./utils.mjs";

const baseURL = "http://wdd330-backend.onrender-osp8.com/";

// Helper function OUTSIDE the class
async function convertToJson(res) {
  // 1. Convert response body to JSON first
  const jsonResponse = await res.json();

  // 2. Check if the HTTP status is in the 200–299 range
  if (res.ok) {
    return jsonResponse;
  } else {
    // 3. Throw custom error object containing the server response details
    throw { name: "servicesError", message: jsonResponse };
  }
}

export default class ExternalServices {
  constructor() {
    // Shared configurations
  }

  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async checkout(payload) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    const response = await fetch(`${baseURL}checkout`, options);
    return await convertToJson(response);
  }
}