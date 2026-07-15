import express from "express";
import {
    getPatients,
    getPatient,
    createPatient,
} from "../controllers/patient.controller.js";

const router = express.Router();

router.get("/", getPatients);

router.get("/:id", getPatient);

router.post("/", createPatient);

export default router;