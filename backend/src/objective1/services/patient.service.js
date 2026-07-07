// services/patient.service.js

import * as PatientModel from "../models/patient.model.js";

export const getAllPatients = async () => {
    return await PatientModel.getAllPatients();
};

export const getPatientById = async (id) => {

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        throw new Error("Invalid patient ID.");
    }

    const patient = await PatientModel.getPatientById(id);

    if (!patient) {
        throw new Error("Patient not found.");
    }

    return patient;
};

export const createPatient = async (patientData) => {

    // Business Rules

    // Age cannot be negative
    if (patientData.age < 0) {
        throw new Error("Age cannot be negative.");
    }

    // Prevent unrealistic ages
    if (patientData.age > 120) {
        throw new Error("Age exceeds the maximum allowed.");
    }

    // Default patient status
    if (!patientData.status) {
        patientData.status = "Pending";
    }

    // Status must be valid
    const validStatuses = [
        "Pending",
        "Active",
        "Inactive"
    ];

    if (!validStatuses.includes(patientData.status)) {
        throw new Error("Invalid patient status.");
    }

    // Contact number must contain exactly 11 digits
    if (
        patientData.contact_number &&
        !/^09\d{9}$/.test(patientData.contact_number)
    ) {
        throw new Error("Invalid contact number.");
    }

    // Email format
    if (
        patientData.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientData.email)
    ) {
        throw new Error("Invalid email address.");
    }

    // Birth date cannot be in the future
    if (
        patientData.birth_date &&
        new Date(patientData.birth_date) > new Date()
    ) {
        throw new Error("Birth date cannot be in the future.");
    }

    return await PatientModel.createPatient(patientData);

};