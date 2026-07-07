import { getAllInventory, createInventory,} from "../models/inventoryModels.js";
import { validateInventory,} from "../services/inventoryServices.js";

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

export async function addInventory(req, res) {
  // Validation muna
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