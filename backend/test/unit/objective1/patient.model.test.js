import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the database before importing the model
vi.mock("../../../database/db.js", () => ({
    default: {
        query: vi.fn()
    }
}));

import db from "../../../database/db.js";

import {
    getAllPatients,
    getPatientById,
    createPatient
} from "../../../src/objective1/models/patient.model.js";

describe("Patient Model", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("getAllPatients()", () => {

        it("should return all patients", async () => {

            const mockPatients = [
                {
                    id: 1,
                    first_name: "John"
                },
                {
                    id: 2,
                    first_name: "Maria"
                }
            ];

            db.query.mockResolvedValue({
                rows: mockPatients
            });

            const result = await getAllPatients();

            expect(db.query).toHaveBeenCalledOnce();

            expect(db.query).toHaveBeenCalledWith(
                "SELECT * FROM patients ORDER BY id ASC"
            );

            expect(result).toEqual(mockPatients);

        });

    });

    describe("getPatientById()", () => {

        it("should return a patient by id", async () => {

            const mockPatient = {
                id: 1,
                first_name: "John"
            };

            db.query.mockResolvedValue({
                rows: [mockPatient]
            });

            const result = await getPatientById(1);

            expect(db.query).toHaveBeenCalledWith(
                "SELECT * FROM patients WHERE id = $1",
                [1]
            );

            expect(result).toEqual(mockPatient);

        });

    });

    describe("createPatient()", () => {

        it("should create a patient", async () => {

            const patient = {
                first_name: "Maria",
                last_name: "Santos",
                middle_name: "Reyes",
                birth_date: "1995-03-10",
                age: 31,
                sex: "Female",
                contact_number: "09987654321",
                email: "maria@example.com",
                address: "Quezon City",
                emergency_contact: "Rico Santos",
                medical_history: "Asthma",
                status: "Pending"
            };

            db.query.mockResolvedValue({
                rows: [
                    {
                        id: 1,
                        ...patient
                    }
                ]
            });

            const result = await createPatient(patient);

            expect(db.query).toHaveBeenCalledOnce();

            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining("INSERT INTO patients"),
                [
                    patient.first_name,
                    patient.last_name,
                    patient.middle_name,
                    patient.birth_date,
                    patient.age,
                    patient.sex,
                    patient.contact_number,
                    patient.email,
                    patient.address,
                    patient.emergency_contact,
                    patient.medical_history,
                    patient.status
                ]
            );

            expect(result).toEqual({
                id: 1,
                ...patient
            });

        });

    });

});