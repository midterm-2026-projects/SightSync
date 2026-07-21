import express from "express";
import { generateSummaryController } from "../controllers/summary.controller.js";

const router = express.Router();

router.post("/", generateSummaryController);

export default router;