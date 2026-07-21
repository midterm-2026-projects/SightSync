import express from "express";
import {
  createReceipt,
  getReceipt,
  getReceiptByPaymentId,
  getAllReceipts,
  deleteReceipt,
} from "../controller/receiptController.js";

const router = express.Router();

router.post("/", createReceipt);
router.get("/", getAllReceipts);
router.get("/payment/:paymentId", getReceiptByPaymentId);
router.get("/:id", getReceipt);
router.delete("/:id", deleteReceipt);

export default router;

