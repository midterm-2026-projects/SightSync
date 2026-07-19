import { describe, it, expect, beforeEach, afterAll } from "vitest";

import db from "../../../../database/db.js";

import {
    getAvailabilityByDoctor,
    createAvailability,
    updateAvailability,
    deleteAvailability,
    getOpenProviderAvailabilities
} from "../../../../src/objective1/models/doctorAvailability.model.js";

describe("Doctor Availability Model Integration", () => {
    let doctorId;

    const toLocalDateString = (dateInput) => {
        const d = new Date(dateInput);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    beforeEach(async () => {
        await db.query("DELETE FROM appointments");
        await db.query("DELETE FROM doctor_availability");
        await db.query("DELETE FROM doctors");

        const doctor = await db.query(
            `INSERT INTO doctors
            (first_name, last_name, specialization)
            VALUES
            ('John', 'Doe', 'Optometrist')
            RETURNING id`
        );

        doctorId = doctor.rows[0].id;
    });

    afterAll(async () => {
        await db.query("DELETE FROM appointments");
        await db.query("DELETE FROM doctor_availability");
    });

    it("should create a new doctor availability record", async () => {
        const date = "2026-07-20";
        const startTime = "09:00:00";
        const endTime = "10:00:00";
        const status = "Available";

        const result = await createAvailability(doctorId, date, startTime, endTime, status);

        expect(result).toBeDefined();
        expect(result.id).toBeDefined();
        expect(result.doctor_id).toBe(doctorId);
        expect(result.status).toBe(status);
        expect(toLocalDateString(result.available_date)).toBe(date);
    });

    it("should retrieve availability records by doctor ID", async () => {
        const date = "2026-07-20";
        await createAvailability(doctorId, date, "09:00:00", "10:00:00", "Available");
        await createAvailability(doctorId, date, "10:00:00", "11:00:00", "Booked");

        const results = await getAvailabilityByDoctor(doctorId);

        expect(results).toHaveLength(2);
        expect(results[0].doctor_id).toBe(doctorId);
    });

    it("should update an existing availability record", async () => {
        const created = await createAvailability(doctorId, "2026-07-20", "09:00:00", "10:00:00", "Available");

        const updated = await updateAvailability(created.id, "2026-07-20", "09:30:00", "10:30:00", "Booked");

        expect(updated).toBeDefined();
        expect(updated.id).toBe(created.id);
        expect(updated.status).toBe("Booked");
    });

    it("should delete an availability record", async () => {
        const created = await createAvailability(doctorId, "2026-07-20", "09:00:00", "10:00:00", "Available");

        const deleted = await deleteAvailability(created.id);
        expect(deleted).toBeDefined();
        expect(deleted.id).toBe(created.id);

        const results = await getAvailabilityByDoctor(doctorId);
        expect(results).toHaveLength(0);
    });

    it("should retrieve active open provider availability records", async () => {
        await createAvailability(doctorId, "2026-07-20", "09:00:00", "10:00:00", "Available");
        await createAvailability(doctorId, "2026-07-20", "10:00:00", "11:00:00", "Booked");

        const results = await getOpenProviderAvailabilities();

        expect(results.length).toBeGreaterThanOrEqual(1);
        const openForOurDoc = results.filter(r => r.doctor_id === doctorId);
        expect(openForOurDoc).toHaveLength(1);
        expect(openForOurDoc[0].status).toBe("Available");
    });
});
