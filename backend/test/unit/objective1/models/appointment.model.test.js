import { describe, it, expect, beforeEach } from "vitest";

import db from "../../../../database/db.js";

import {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment
} from "../../../../src/objective1/models/appointment.model.js";

describe("Appointment Model Integration", () => {

    let patientId;
    let doctorId;

    beforeEach(async () => {

        await db.query("DELETE FROM appointments");
        await db.query("DELETE FROM doctor_availability");
        await db.query("DELETE FROM patients");

        const doctor = await db.query(
            `INSERT INTO doctors
            (first_name, last_name, specialization)
            VALUES
            ('John', 'Doe', 'Optometrist')
            RETURNING id`
        );

        doctorId = doctor.rows[0].id;

        const patient = await db.query(
            `INSERT INTO patients
            (
                first_name,
                last_name,
                birth_date,
                age,
                sex,
                contact_number,
                email,
                address,
                status
            )
            VALUES
            (
                'Jane',
                'Smith',
                '2000-01-01',
                26,
                'Female',
                '09123456789',
                'jane@example.com',
                'Batangas',
                'Pending'
            )
            RETURNING id`
        );

        patientId = patient.rows[0].id;

    });

    describe("getAllAppointments", () => {

        it("should return all appointments", async () => {

            await db.query(
                `INSERT INTO appointments
                (
                    patient_id,
                    doctor_id,
                    appointment_date,
                    appointment_time,
                    appointment_type,
                    reason,
                    status
                )
                VALUES
                ($1,$2,'2026-08-01','09:00:00','Consultation','Eye Checkup','Scheduled'),
                ($1,$2,'2026-08-02','10:00:00','Follow-up','Follow-up Visit','Scheduled')`,
                [patientId, doctorId]
            );

            const result = await getAllAppointments();

            expect(result).toHaveLength(2);
            expect(result[0].appointment_type).toBe("Consultation");
            expect(result[1].appointment_type).toBe("Follow-up");

        });

    });

    describe("getAppointmentById", () => {

        it("should return an appointment by id", async () => {

            const inserted = await db.query(
                `INSERT INTO appointments
                (
                    patient_id,
                    doctor_id,
                    appointment_date,
                    appointment_time,
                    appointment_type,
                    reason,
                    status
                )
                VALUES
                ($1,$2,'2026-08-01','09:00:00','Consultation','Eye Checkup','Scheduled')
                RETURNING *`,
                [patientId, doctorId]
            );

            const result = await getAppointmentById(inserted.rows[0].id);

            expect(result.id).toBe(inserted.rows[0].id);
            expect(result.patient_id).toBe(patientId);
            expect(result.doctor_id).toBe(doctorId);

        });

    });

    describe("createAppointment", () => {

        it("should create a new appointment", async () => {

            const appointment = {
                patient_id: patientId,
                doctor_id: doctorId,
                appointment_date: "2026-08-01",
                appointment_time: "09:00:00",
                appointment_type: "Consultation",
                reason: "Eye Checkup",
                status: "Scheduled"
            };

            const result = await createAppointment(appointment);
            console.log(result);

            expect(result.patient_id).toBe(patientId);
            expect(result.doctor_id).toBe(doctorId);
            expect(result.appointment_type).toBe("Consultation");
            expect(result.reason).toBe("Eye Checkup");

        });

    });

    describe("updateAppointment", () => {

        it("should update an appointment", async () => {

            const inserted = await db.query(
                `INSERT INTO appointments
                (
                    patient_id,
                    doctor_id,
                    appointment_date,
                    appointment_time,
                    appointment_type,
                    reason,
                    status
                )
                VALUES
                ($1,$2,'2026-08-01','09:00:00','Consultation','Eye Checkup','Scheduled')
                RETURNING *`,
                [patientId, doctorId]
            );

            const updatedAppointment = {
                patient_id: patientId,
                doctor_id: doctorId,
                appointment_date: "2026-08-02",
                appointment_time: "10:00:00",
                appointment_type: "Follow-up",
                reason: "Updated Visit",
                status: "Completed"
            };

            const result = await updateAppointment(
                inserted.rows[0].id,
                updatedAppointment
            );

            expect(result.appointment_type).toBe("Follow-up");
            expect(result.reason).toBe("Updated Visit");
            expect(result.status).toBe("Completed");

        });

    });

    describe("deleteAppointment", () => {

        it("should delete an appointment", async () => {

            const inserted = await db.query(
                `INSERT INTO appointments
                (
                    patient_id,
                    doctor_id,
                    appointment_date,
                    appointment_time,
                    appointment_type,
                    reason,
                    status
                )
                VALUES
                ($1,$2,'2026-08-01','09:00:00','Consultation','Eye Checkup','Scheduled')
                RETURNING *`,
                [patientId, doctorId]
            );

            const result = await deleteAppointment(inserted.rows[0].id);

            expect(result.id).toBe(inserted.rows[0].id);

            const check = await db.query(
                "SELECT * FROM appointments WHERE id = $1",
                [inserted.rows[0].id]
            );

            expect(check.rows).toHaveLength(0);

        });

    });

});