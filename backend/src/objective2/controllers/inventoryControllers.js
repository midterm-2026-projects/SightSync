import {getAllInventory, createInventory, updateInventoryPrice, getCurrentStock, updateStock} from "../models/inventoryModels.js";
import {validateInventory, validatePrice,} from "../services/inventoryServices.js";

// GET Inventory
export async function fetchInventory(req, res) {

  try {

    const inventory = await getAllInventory();

    return res.status(200).json(inventory);

  } catch (error) {

    return res.status(500).json({
      message: "Failed to fetch inventory.",
    });

  }

}

// POST Inventory
export async function addInventory(req, res) {

  const validation = validateInventory(req.body);

  if (!validation.valid) {

    return res.status(400).json({
      message: validation.message,
    });

  }

  try {

    const inventory = await createInventory(req.body);

    return res.status(201).json(inventory);

  } catch (error) {

    return res.status(500).json({
      message: "Failed to create inventory.",
    });

  }

}

// PUT Inventory Price
export async function editInventoryPrice(req, res) {

  const { id, table } = req.params;
  const { price } = req.body;

  // Validate table
if (!["lenses", "frames"].includes(table)) {
  return res.status(400).json({
    message: "Invalid inventory table.",
  });
}

// Validate id
if (isNaN(id) || Number(id) <= 0) {
  return res.status(400).json({
    message: "Invalid inventory ID.",
  });
}

  const validation = validatePrice(price);

  if (!validation.valid) {
    return res.status(400).json({
      message: validation.message,
    });
  }

  try {

    const inventory = await updateInventoryPrice(
      table,
      id,
      price
    );

    if (!inventory) {
      return res.status(404).json({
        message: "Inventory not found.",
      });
    }

    return res.status(200).json(inventory);

  } catch (error) {

    return res.status(500).json({
      message: "Failed to update inventory price.",
    });

  }

}

// NEW

// GET Current Stock
export async function fetchCurrentStock(req, res) {

  const { table, id } = req.params;

  // Validate table
  if (!["lenses", "frames"].includes(table)) {

    return res.status(400).json({
      message: "Invalid inventory table.",
    });

  }

  // Validate id
  if (isNaN(id) || Number(id) <= 0) {

    return res.status(400).json({
      message: "Invalid inventory ID.",
    });

  }

  try {

    const stock = await getCurrentStock(
      table,
      id
    );

    if (!stock) {

      return res.status(404).json({
        message: "Inventory not found.",
      });

    }

    return res.status(200).json(stock);

  } catch (error) {

    return res.status(500).json({
      message: "Failed to fetch current stock.",
    });

  }

}

// NEW

// PUT Stock
export async function editStock(req, res) {

  const { table, id } = req.params;
  const { stock } = req.body;

  // Validate table
  if (!["lenses", "frames"].includes(table)) {

    return res.status(400).json({
      message: "Invalid inventory table.",
    });

  }

  // Validate id
  if (isNaN(id) || Number(id) <= 0) {

    return res.status(400).json({
      message: "Invalid inventory ID.",
    });

  }

  // Validate stock
  if (stock === undefined || stock === null || isNaN(stock)) {

    return res.status(400).json({
      message: "Stock is required.",
    });

  }

  if (Number(stock) < 0) {

    return res.status(400).json({
      message: "Stock cannot be negative.",
    });

  }

  try {

    const inventory = await updateStock(
      table,
      id,
      stock
    );

    if (!inventory) {

      return res.status(404).json({
        message: "Inventory not found.",
      });

    }

    return res.status(200).json(inventory);

  } catch (error) {

    return res.status(500).json({
      message: "Failed to update stock.",
    });

  }

}