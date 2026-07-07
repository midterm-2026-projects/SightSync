import express from "express";
import {fetchInventory,addInventory,} from "../controllers/inventoryControllers.js";

const router = express.Router();

router.get("/", fetchInventory);

router.post("/", addInventory);

export default router;