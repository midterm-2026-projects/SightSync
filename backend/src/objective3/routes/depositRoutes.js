import express from "express";
import {
  createDeposit,
  getDeposit,
  getAllDeposits,
  updateDepositStatus,
  deleteDeposit,
} from "../controller/depositController.js";
import { validateDepositForm, makeFormValidationMiddleware } from "../middleware/vallidation.js";

const router = express.Router();

router.post("/", makeFormValidationMiddleware(validateDepositForm), createDeposit);
router.get("/", getAllDeposits);
router.get("/:id", getDeposit);
router.patch("/:id/status", updateDepositStatus);
router.delete("/:id", deleteDeposit);

export default router;

