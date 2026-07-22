import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock appointment model
vi.mock("../../../../src/objective1/models/appointment.model.js", () => ({
    getAllAppointments: vi.fn(),
    getAppointmentById: vi.fn(),
    createAppointment: vi.fn(),
    updateAppointment: vi.fn(),
    deleteAppointment: vi.fn()
}));

// Mock patient model
vi.mock("../../../../src/objective1/models/patient.model.js", () => ({
    getPatientById: vi.fn()
}));

// Mock doctor availability service
vi.mock("../../../../src/objective1/services/doctorAvailability.service.js", () => ({
    getDoctorAvailability: vi.fn().mockResolvedValue([]),
    createDoctorAvailability: vi.fn().mockResolvedValue({ id: 1, doctor_id: 1, status: "Booked" }),
    updateDoctorAvailability: vi.fn(),
    deleteDoctorAvailability: vi.fn()
}));

// Mock notification service
vi.mock("../../../../src/objective1/services/notification.service.js", () => ({
    sendAppointmentConfirmation: vi.fn().mockResolvedValue({ success: true }),
    sendNotification: vi.fn()
}));

import {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment
} from "../../../../src/objective1/models/appointment.model.js";

import { getPatientById } from "../../../../src/objective1/models/patient.model.js";
import { sendAppointmentConfirmation } from "../../../../src/objective1/services/notification.service.js";

import {
    getAllAppointmentsService,
    getAppointmentByIdService,
    createAppointmentService,
    updateAppointmentService,
    deleteAppointmentService
} from "../../../../src/objective1/services/appointment.service.js";

describe("Appointment Service", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ===========================
    // GET ALL
    // ===========================

    describe("getAllAppointmentsService", () => {

        it("should return all appointments", async () => {

            const appointments = [
                { id: 1, patient_id: 1 },
                { id: 2, patient_id: 2 }
            ];

            getAllAppointments.mockResolvedValue(appointments);

            const result = await getAllAppointmentsService();

            expect(result).toEqual(appointments);
            expect(getAllAppointments).toHaveBeenCalled();
        });

    });

    // ===========================
    // GET BY ID
    // ===========================

    describe("getAppointmentByIdService", () => {

        it("should return an appointment", async () => {

            const appointment = {
                id: 1,
                patient_id: 1
            };

            getAppointmentById.mockResolvedValue(appointment);

            const result = await getAppointmentByIdService(1);

            expect(result).toEqual(appointment);
        });

        it("should throw if id is invalid", async () => {

            await expect(
                getAppointmentByIdService(0)
            ).rejects.toThrow("Invalid appointment ID.");

        });

        it("should throw if appointment does not exist", async () => {

            getAppointmentById.mockResolvedValue(null);

            await expect(
                getAppointmentByIdService(1)
            ).rejects.toThrow("Appointment not found.");

        });

    });

    // ===========================
    // CREATE
    // ===========================

    describe("createAppointmentService", () => {

        const futureDate = "2099-12-31";

        it("should create an appointment", async () => {

            const appointment = {
                patient_id: 1,
                doctor_id: 1,
                appointment_date: futureDate,
                appointment_time: "09:00:00",
                appointment_type: "Consultation",
                reason: "Eye Checkup"
            };

            getPatientById.mockResolvedValue({ id: 1 });

            createAppointment.mockResolvedValue({
                id: 1,
                ...appointment,
                status: "Scheduled"
            });

            const result = await createAppointmentService(appointment);

            expect(result.status).toBe("Scheduled");
            expect(createAppointment).toHaveBeenCalled();
            expect(sendAppointmentConfirmation).toHaveBeenCalled();
        });

        it("should throw if patient does not exist", async () => {

            getPatientById.mockResolvedValue(null);

            await expect(
                createAppointmentService({
                    patient_id: 99,
                    doctor_id: 1,
                    appointment_date: futureDate,
                    appointment_time: "09:00:00",
                    appointment_type: "Consultation"
                })
            ).rejects.toThrow("Patient not found.");

        });

        it("should throw for invalid appointment type", async () => {

            getPatientById.mockResolvedValue({ id: 1 });

            await expect(
                createAppointmentService({
                    patient_id: 1,
                    doctor_id: 1,
                    appointment_date: futureDate,
                    appointment_time: "09:00:00",
                    appointment_type: "Emergency"
                })
            ).rejects.toThrow("Invalid appointment type.");

        });

        it("should throw for invalid status", async () => {

            getPatientById.mockResolvedValue({ id: 1 });

            await expect(
                createAppointmentService({
                    patient_id: 1,
                    doctor_id: 1,
                    appointment_date: futureDate,
                    appointment_time: "09:00:00",
                    appointment_type: "Consultation",
                    status: "No Show"
                })
            ).rejects.toThrow("Invalid appointment status.");

        });

        it("should throw for past appointment date", async () => {

            getPatientById.mockResolvedValue({ id: 1 });

            await expect(
                createAppointmentService({
                    patient_id: 1,
                    doctor_id: 1,
                    appointment_date: "2000-01-01",
                    appointment_time: "09:00:00",
                    appointment_type: "Consultation"
                })
            ).rejects.toThrow("Appointment date cannot be in the past.");

        });

    });

    // ===========================
    // UPDATE
    // ===========================

    describe("updateAppointmentService", () => {

        const futureDate = "2099-12-31";

        it("should update an appointment", async () => {

            getAppointmentById.mockResolvedValue({ id: 1 });

            getPatientById.mockResolvedValue({ id: 1 });

            updateAppointment.mockResolvedValue({
                id: 1,
                status: "Completed"
            });

            const result = await updateAppointmentService(1, {
                patient_id: 1,
                appointment_date: futureDate,
                appointment_time: "09:00:00",
                appointment_type: "Follow-up",
                status: "Completed"
            });

            expect(result.status).toBe("Completed");
        });

        it("should throw if appointment does not exist", async () => {

            getAppointmentById.mockResolvedValue(null);

            await expect(
                updateAppointmentService(1, {})
            ).rejects.toThrow("Appointment not found.");

        });

        it("should throw if patient does not exist", async () => {

            getAppointmentById.mockResolvedValue({ id: 1 });

            getPatientById.mockResolvedValue(null);

            await expect(
                updateAppointmentService(1, {
                    patient_id: 99
                })
            ).rejects.toThrow("Patient not found.");

        });

    });

    // ===========================
    // DELETE
    // ===========================

    describe("deleteAppointmentService", () => {

        it("should delete an appointment", async () => {

            getAppointmentById.mockResolvedValue({ id: 1 });

            deleteAppointment.mockResolvedValue({ id: 1 });

            const result = await deleteAppointmentService(1);

            expect(result.id).toBe(1);
        });

        it("should throw if id is invalid", async () => {

            await expect(
                deleteAppointmentService(0)
            ).rejects.toThrow("Invalid appointment ID.");

        });

        it("should throw if appointment does not exist", async () => {

            getAppointmentById.mockResolvedValue(null);

            await expect(
                deleteAppointmentService(1)
            ).rejects.toThrow("Appointment not found.");

        });

    });

});