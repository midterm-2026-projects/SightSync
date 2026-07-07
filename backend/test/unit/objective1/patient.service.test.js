import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the model BEFORE importing the service
vi.mock("../../../src/objective1/models/patient.model.js", () => ({
    getAllPatients: vi.fn(),
    getPatientById: vi.fn(),
    createPatient: vi.fn()
}));

// Import the mocked model
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

        it("should return a patient when found", async () => {

            const patient = {
                id: 1,
                first_name: "John"
            };

            PatientModel.getPatientById.mockResolvedValue(patient);

            const result = await getPatientById(1);

            expect(PatientModel.getPatientById).toHaveBeenCalledWith(1);
            expect(result).toEqual(patient);

        });

        it("should throw an error when patient is not found", async () => {

            PatientModel.getPatientById.mockResolvedValue(undefined);

            await expect(
                getPatientById(999)
            ).rejects.toThrow("Patient not found.");

            expect(PatientModel.getPatientById).toHaveBeenCalledWith(999);

        });

    });

    describe("createPatient()", () => {

        it("should create a patient successfully", async () => {

            const patient = {
                first_name: "Maria",
                last_name: "Santos",
                age: 31,
                status: "Pending"
            };

            PatientModel.createPatient.mockResolvedValue({
                id: 1,
                ...patient
            });

            const result = await createPatient(patient);

            expect(PatientModel.createPatient).toHaveBeenCalledWith(patient);

            expect(result).toEqual({
                id: 1,
                ...patient
            });

        });

        it("should assign 'Pending' status if status is missing", async () => {

            const patient = {
                first_name: "Maria",
                last_name: "Santos",
                age: 31
            };

            PatientModel.createPatient.mockResolvedValue({
                id: 1,
                ...patient,
                status: "Pending"
            });

            const result = await createPatient(patient);

            expect(PatientModel.createPatient).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: "Pending"
                })
            );

            expect(result.status).toBe("Pending");

        });

        it("should throw an error for negative age", async () => {

            const patient = {
                first_name: "Maria",
                age: -5
            };

            await expect(
                createPatient(patient)
            ).rejects.toThrow("Age cannot be negative.");

            expect(PatientModel.createPatient).not.toHaveBeenCalled();

        });

    });

});