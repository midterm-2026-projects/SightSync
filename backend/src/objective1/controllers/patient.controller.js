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
        console.log(req.body)
        const patient = await Patient.createPatient(req.body);
        res.status(201).json({
            success: true,
            data: patient,
        });

    } catch (err) {
        
        if (err.code === '23505' || err.message.includes('patients_email_key')) {
            return res.status(409).json({
                success: false,
                message: 'A patient with this email already exists.',
            });
        }

        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};


export const updatePatientController = async (req, res) => {
    try {
        const patient = await Patient.updatePatient(req.params.id, req.body);

        res.status(200).json({
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


export const deletePatientController = async (req, res) => {
    try {
        const patient = await Patient.deletePatient(req.params.id);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found",
            });
        }

        res.json({
            success: true,
            message: "Patient deleted successfully",
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};