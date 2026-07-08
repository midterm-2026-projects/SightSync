import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the model
vi.mock("../../../src/objective1/models/patient.model.js", () => ({
    getAllPatients: vi.fn(),
    getPatientById: vi.fn(),
    createPatient: vi.fn()
}));

import * as PatientModel from "../../../src/objective1/models/patient.model.js";

import {
    getAllPatients,
    getPatientById,
    createPatient
} from "../../../src/objective1/services/patient.service.js";

describe("Patient Service", () => {

    beforeEach(() => {
        vi.resetAllMocks();
    });

    describe("getAllPatients()", () => {

        it("should return all patients", async () => {

            const patients = [
                { id: 1, first_name: "John" },
                { id: 2, first_name: "Maria" }
            ];

            PatientModel.getAllPatients.mockResolvedValue(patients);

            const result = await getAllPatients();

            expect(PatientModel.getAllPatients).toHaveBeenCalledTimes(1);
            expect(result).toEqual(patients);

        });

    });

    describe("getPatientById()", () => {

        it("should return patient when id is valid", async () => {

            const patient = {
                id: 1,
                first_name: "John"
            };

            PatientModel.getPatientById.mockResolvedValue(patient);

            const result = await getPatientById(1);

            expect(PatientModel.getPatientById).toHaveBeenCalledWith(1);
            expect(result).toEqual(patient);

        });

        it("should throw if patient id is invalid", async () => {

            await expect(
                getPatientById(0)
            ).rejects.toThrow("Invalid patient ID.");

        });

        it("should throw if patient does not exist", async () => {

            PatientModel.getPatientById.mockResolvedValue(undefined);

            await expect(
                getPatientById(99)
            ).rejects.toThrow("Patient not found.");

        });

    });

    describe("createPatient()", () => {

        const validPatient = {
            first_name: "Maria",
            last_name: "Santos",
            middle_name: "Reyes",
            birth_date: "1995-03-10",
            age: 31,
            sex: "Female",
            contact_number: "09123456789",
            email: "maria@example.com",
            address: "Quezon City",
            emergency_contact: "Juan Santos",
            medical_history: "Asthma",
            status: "Pending"
        };

        it("should create patient successfully", async () => {

            PatientModel.createPatient.mockResolvedValue({
                id: 1,
                ...validPatient
            });

            const result = await createPatient({ ...validPatient });

            expect(PatientModel.createPatient).toHaveBeenCalledOnce();

            expect(result.id).toBe(1);

        });

        it("should assign default status", async () => {

            const patient = {
                ...validPatient
            };

            delete patient.status;

            PatientModel.createPatient.mockResolvedValue({
                id: 1,
                ...patient,
                status: "Pending"
            });

            await createPatient(patient);

            expect(PatientModel.createPatient).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: "Pending"
                })
            );

        });

        it("should reject negative age", async () => {

            await expect(
                createPatient({
                    ...validPatient,
                    age: -1
                })
            ).rejects.toThrow("Age cannot be negative.");

            expect(PatientModel.createPatient).not.toHaveBeenCalled();

        });

        it("should reject age greater than 120", async () => {

            await expect(
                createPatient({
                    ...validPatient,
                    age: 121
                })
            ).rejects.toThrow("Age exceeds the maximum allowed.");

        });

        it("should reject invalid status", async () => {

            await expect(
                createPatient({
                    ...validPatient,
                    status: "Archived"
                })
            ).rejects.toThrow("Invalid patient status.");

        });

        it("should reject invalid contact number", async () => {

            await expect(
                createPatient({
                    ...validPatient,
                    contact_number: "123456789"
                })
            ).rejects.toThrow("Invalid contact number.");

        });

        it("should reject invalid email", async () => {

            await expect(
                createPatient({
                    ...validPatient,
                    email: "maria.com"
                })
            ).rejects.toThrow("Invalid email address.");

        });

        it("should reject future birth date", async () => {

            await expect(
                createPatient({
                    ...validPatient,
                    birth_date: "2099-01-01"
                })
            ).rejects.toThrow("Birth date cannot be in the future.");

        });

    });

});