import { loadHeaderFooter, updateCartBadge } from "./utils.mjs";

async function init() {
  await loadHeaderFooter();
  updateCartBadge();
}

init();