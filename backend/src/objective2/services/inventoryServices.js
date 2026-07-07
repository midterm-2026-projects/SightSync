export function validateInventory(data) {
  const { name, type, price, stock } = data;

  // Product name
  if (!name || name.trim() === "") {
    return {
      valid: false,
      message: "Product name is required.",
    };
  }

  // Product type
  if (!type || !["Lens", "Frame"].includes(type)) {
    return {
      valid: false,
      message: "Product type must be either Lens or Frame.",
    };
  }

  // Price
  if (price === undefined || price === null || isNaN(price)) {
    return {
      valid: false,
      message: "Price is required.",
    };
  }

  if (Number(price) <= 0) {
    return {
      valid: false,
      message: "Price must be greater than zero.",
    };
  }

  // Stock
  if (stock === undefined || stock === null || isNaN(stock)) {
    return {
      valid: false,
      message: "Stock is required.",
    };
  }

  if (Number(stock) < 0) {
    return {
      valid: false,
      message: "Stock cannot be negative.",
    };
  }

  return {
    valid: true,
  };
}