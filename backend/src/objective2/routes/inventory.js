import express from "express";
import {fetchInventory, addInventory, editInventoryPrice, fetchCurrentStock, editStock,} from "../controllers/inventoryControllers.js";

const router = express.Router();

// GET Inventory
router.get("/", fetchInventory);

// POST Inventory
router.post("/", addInventory);

// PUT Inventory Price
router.put("/:table/:id/price", editInventoryPrice);

// NEW

// GET Current Stock
router.get("/:table/:id/stock", fetchCurrentStock);

// PUT Inventory Stock
router.put("/:table/:id/stock", editStock);

export default router;