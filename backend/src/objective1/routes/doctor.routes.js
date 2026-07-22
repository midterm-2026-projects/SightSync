import express from "express";
import {
  createDoctorController,
  updateDoctorController,
  deleteDoctorController,
  getDoctorsController,
} from "../controllers/doctor.controller.js";
const router = express.Router();

router.get("/", getDoctorsController);
router.post("/", createDoctorController);
router.put("/:id", updateDoctorController);
router.delete("/:id", deleteDoctorController);

export default router;
