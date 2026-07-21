import express from "express";
import {
  createPayment,
  getPayment,
  getAllPayments,
  updatePaymentStatus,
  deletePayment,
} from "../controller/paymentController.js";
import { validatePaymentForm, makeFormValidationMiddleware } from "../middleware/vallidation.js";

const router = express.Router();

router.post("/", makeFormValidationMiddleware(validatePaymentForm), createPayment);
router.get("/", getAllPayments);
router.get("/:id", getPayment);
router.patch("/:id/status", updatePaymentStatus);
router.delete("/:id", deletePayment);

export default router;

