import express from "express";
import {fetchInventory, addInventory, editInventoryPrice,} from "../controllers/inventoryControllers.js";

const router = express.Router();

// GET
router.get("/", fetchInventory);

// POST
router.post("/", addInventory);

// PUT
router.put("/:table/:id", editInventoryPrice);

export default router;