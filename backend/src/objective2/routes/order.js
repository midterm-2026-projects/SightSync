import express from "express";
import {fetchOrders, addOrder, editOrder, removeOrder} from "../controllers/orderControllers.js";

const router = express.Router();

// GET
router.get("/", fetchOrders);

// POST
router.post("/", addOrder);

// PUT
router.put("/:id", editOrder);

// DELETE
router.delete("/:id", removeOrder);


export default router;