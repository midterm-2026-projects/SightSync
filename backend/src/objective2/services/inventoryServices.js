// Validate Product Information
export function validateProduct(data) {
  const { name, type } = data;

  if (!name || name.trim() === "") {
    return {
      valid: false,
      message: "Product name is required.",
    };
  }

  if (name.trim().length > 100) {
    return {
      valid: false,
      message: "Product name must not exceed 100 characters.",
    };
  }

  if (!type || !["Lens", "Frame"].includes(type)) {
    return {
      valid: false,
      message: "Product type must be either Lens or Frame.",
    };
  }

  return {
    valid: true,
  };
}

// Validate Price
export function validatePrice(price) {

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

  return {
    valid: true,
  };

}

// Validate Inventory
export function validateInventory(data) {

  const { name, type, price, stock } = data;

  // Validate Product
  const productValidation = validateProduct({
    name,
    type,
  });

  if (!productValidation.valid) {
    return productValidation;
  }

  // Validate Price
  const priceValidation = validatePrice(price);

  if (!priceValidation.valid) {
    return priceValidation;
  }

  // Validate Stock
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