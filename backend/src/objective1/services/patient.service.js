// services/patient.service.js

import * as PatientModel from "../models/patient.model.js";

export const getAllPatients = async () => {
    return await PatientModel.getAllPatients();
};

export const getPatientById = async (id) => {
    const patient = await PatientModel.getPatientById(id);

    if (!patient) {
        throw new Error("Patient not found.");
    }

    return patient;
};

export const createPatient = async (patientData) => {

    // Business Rules

    if (patientData.age < 0) {
        throw new Error("Age cannot be negative.");
    }

    if (!patientData.status) {
        patientData.status = "Pending";
    }

    return await PatientModel.createPatient(patientData);
};