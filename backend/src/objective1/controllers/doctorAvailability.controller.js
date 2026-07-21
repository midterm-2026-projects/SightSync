
import {
  getDoctorAvailability,
  createDoctorAvailability,
  updateDoctorAvailability,
  deleteDoctorAvailability,
  getOpenProviderAvailability,
  getProviderMetrics,
  getCollisions,
} from "../services/doctorAvailability.service.js";
import { sendNotification } from "../services/notification.service.js";
import { hasScheduleConflict } from "../services/conflict.service.js";

export const getDoctorAvailabilityController = async (req, res) => {
    const { doctorId } = req.params;
    try {
        const availability = await getDoctorAvailability(doctorId);
        res.status(200).json({ success: true, data: availability });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export const createDoctorAvailabilityController = async (req, res) => {
    const { doctorId, date, startTime, endTime, status } = req.body;

    try {
        const availability = await createDoctorAvailability(doctorId, date, startTime, endTime, status);
        res.status(201).json({ success: true, data: availability });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export const updateDoctorAvailabilityController = async (req, res) => {
    const { availabilityId } = req.params;
    const { date, startTime, endTime, status } = req.body;

    try {
        const availability = await updateDoctorAvailability(availabilityId, date, startTime, endTime, status);
        res.status(200).json({ success: true, data: availability });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export const deleteDoctorAvailabilityController = async (req, res) => {
    const { availabilityId } = req.params;

    try {
        const availability = await deleteDoctorAvailability(availabilityId);
        res.status(200).json({ success: true, data: availability });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export const getOpenProviderAvailabilityController = async (req, res) => {
    try {
        const availability = await getOpenProviderAvailability();
        res.status(200).json({ success: true, data: availability });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export const getProviderMetricsController = async (req, res) => {
    const { doctorId } = req.params;
    try {
        const metrics = await getProviderMetrics(doctorId);
        res.status(200).json({ success: true, data: metrics });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export const getCollisionsController = async (req, res) => {
    const { doctorId } = req.params;
    const { startTime, endTime } = req.query;
    try {
        const collisions = await getCollisions(doctorId, startTime, endTime);
        res.status(200).json({ success: true, data: collisions });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

