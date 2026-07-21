import express from "express"

import { 
    getDoctorAvailabilityController, 
    createDoctorAvailabilityController, 
    updateDoctorAvailabilityController, 
    deleteDoctorAvailabilityController,
    getOpenProviderAvailabilityController,
    getProviderMetricsController,
    getCollisionsController
} from "../controllers/doctorAvailability.controller.js"

const router = express.Router();

router.get("/open", getOpenProviderAvailabilityController);

router.get("/:doctorId", getDoctorAvailabilityController);

router.get("/:doctorId/metrics", getProviderMetricsController);

router.get("/:doctorId/collisions", getCollisionsController);

router.post("/", createDoctorAvailabilityController);

router.put("/:availabilityId", updateDoctorAvailabilityController);

router.delete("/:availabilityId", deleteDoctorAvailabilityController);

export default router