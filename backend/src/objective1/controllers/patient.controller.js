import * as Patient from "../models/patient.model.js";

export const getPatients = async (req, res) => {
    try {
        const patients = await Patient.getAllPatients();

        res.json({
            success: true,
            data: patients,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
            console: console.error(err)
        });
    }
};

export const getPatient = async (req, res) => {
    try {
        const patient = await Patient.getPatientById(req.params.id);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found",
            });
        }

        res.json({
            success: true,
            data: patient,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const createPatient = async (req, res) => {
    try {
        const patient = await Patient.createPatient(req.body);

        res.status(201).json({
            success: true,
            data: patient,
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};