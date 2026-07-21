import express from "express";
import { getAllAppointmentController, getAppointmentByIdController, createAppointmentController, updateAppointmentController, deleteAppointmentController } from "../controllers/appointment.controller.js";

const router = express.Router();

router.get("/", getAllAppointmentController);

router.get("/:id", getAppointmentByIdController);

router.post("/", createAppointmentController);

router.put("/:id", updateAppointmentController);

router.delete("/:id", deleteAppointmentController);

export default router;