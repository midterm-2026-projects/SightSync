import { describe, it, expect, vi, beforeEach } from "vitest";



import db from "../../../../database/db.js";

import {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment
} from "../../../../src/objective1/models/appointment.model.js";

describe("Appointment Model", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("getAllAppointments", () => {

        it("should return all appointments", async () => {

            const mockAppointments = [
                {
                    id: 1,
                    patient_id: 1,
                    appointment_type: "Consultation"
                },
                {
                    id: 2,
                    patient_id: 2,
                    appointment_type: "Follow-up"
                }
            ];

            db.query.mockResolvedValue({
                rows: mockAppointments
            });

            const result = await getAllAppointments();

            expect(db.query).toHaveBeenCalledWith(
                "SELECT * FROM appointments ORDER BY id ASC"
            );

            expect(result).toEqual(mockAppointments);
        });

    });

    describe("getAppointmentById", () => {

        it("should return an appointment by id", async () => {

            const mockAppointment = {
                id: 1,
                patient_id: 1,
                appointment_type: "Consultation"
            };

            db.query.mockResolvedValue({
                rows: [mockAppointment]
            });

            const result = await getAppointmentById(1);

            expect(db.query).toHaveBeenCalledWith(
                "SELECT * FROM appointments WHERE id = $1",
                [1]
            );

            expect(result).toEqual(mockAppointment);
        });

    });

    describe("createAppointment", () => {

        it("should create a new appointment", async () => {

            const appointment = {
                patient_id: 1,
                appointment_date: "2026-08-01",
                appointment_time: "09:00:00",
                appointment_type: "Consultation",
                reason: "Eye Checkup",
                status: "Scheduled"
            };

            db.query.mockResolvedValue({
                rows: [
                    {
                        id: 1,
                        ...appointment
                    }
                ]
            });

            const result = await createAppointment(appointment);

            expect(db.query).toHaveBeenCalled();

            expect(result).toEqual({
                id: 1,
                ...appointment
            });
        });

    });

    describe("updateAppointment", () => {

        it("should update an appointment", async () => {

            const appointment = {
                patient_id: 1,
                appointment_date: "2026-08-02",
                appointment_time: "10:00:00",
                appointment_type: "Follow-up",
                reason: "Follow-up Visit",
                status: "Completed"
            };

            db.query.mockResolvedValue({
                rows: [
                    {
                        id: 1,
                        ...appointment
                    }
                ]
            });

            const result = await updateAppointment(1, appointment);

            expect(db.query).toHaveBeenCalled();

            expect(result).toEqual({
                id: 1,
                ...appointment
            });
        });

    });

    describe("deleteAppointment", () => {

        it("should delete an appointment", async () => {

            const deletedAppointment = {
                id: 1,
                patient_id: 1,
                appointment_type: "Consultation"
            };

            db.query.mockResolvedValue({
                rows: [deletedAppointment]
            });

            const result = await deleteAppointment(1);

            expect(db.query).toHaveBeenCalledWith(
                "DELETE FROM appointments WHERE id = $1 RETURNING *",
                [1]
            );

            expect(result).toEqual(deletedAppointment);
        });

    });

});