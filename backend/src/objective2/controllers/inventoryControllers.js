import {
  getAllInventory,
  createInventory,
  updateInventoryPrice,
} from "../models/inventoryModels.js";

import {
  validateInventory,
  validatePrice,
} from "../services/inventoryServices.js";

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