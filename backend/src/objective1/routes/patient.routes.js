import express from "express";
import {
    getPatients,
    getPatient,
    createPatient,
    updatePatientController,
    deletePatientController,
} from "../controllers/patient.controller.js";

const router = express.Router();

router.get("/", getPatients);

router.get("/:id", getPatient);

router.post("/", createPatient);

router.put("/:id", updatePatientController);

router.delete("/:id", deletePatientController);

export default router;