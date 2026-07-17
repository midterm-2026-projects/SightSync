import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../../../src/objective1/models/doctorAvailability.model.js", () => ({
    getAvailabilityByDoctor: vi.fn(),
    createAvailability: vi.fn(),
    updateAvailability: vi.fn(),
    deleteAvailability: vi.fn(),
    getOpenProviderAvailabilities: vi.fn()
}));

import {
    getAvailabilityByDoctor,
    createAvailability,
    updateAvailability,
    deleteAvailability,
    getOpenProviderAvailabilities
} from "../../../../src/objective1/models/doctorAvailability.model.js";

import {
    getDoctorAvailability,
    createDoctorAvailability,
    updateDoctorAvailability,
    deleteDoctorAvailability,
    getOpenProviderAvailability,
    getProviderMetrics,
    getCollisions,
    DoctorAvailabilityCalculator
} from "../../../../src/objective1/services/doctorAvailability.service.js";

describe("Doctor Availability Calculator & Service", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("DoctorAvailabilityCalculator", () => {
        describe("checkCollisions", () => {
            it("should identify overlapping slot collisions", () => {
                const existing = [
                    { start_time: "09:00:00", end_time: "10:00:00" },
                    { start_time: "11:00:00", end_time: "12:00:00" }
                ];
                const collisions = DoctorAvailabilityCalculator.checkCollisions(existing, "09:30:00", "10:30:00");
                expect(collisions).toHaveLength(1);
                expect(collisions[0].start_time).toBe("09:00:00");
            });

            it("should return empty list if no collisions", () => {
                const existing = [
                    { start_time: "09:00:00", end_time: "10:00:00" }
                ];
                const collisions = DoctorAvailabilityCalculator.checkCollisions(existing, "10:00:00", "11:00:00");
                expect(collisions).toHaveLength(0);
            });
        });

        describe("calculateMetrics", () => {
            it("should calculate correct assignment and utilization metrics", () => {
                const slots = [
                    { status: "Booked" },
                    { status: "Booked" },
                    { status: "Available" }
                ];
                const metrics = DoctorAvailabilityCalculator.calculateMetrics(slots);
                expect(metrics).toEqual({
                    totalSlots: 3,
                    bookedSlots: 2,
                    availableSlots: 1,
                    utilizationRate: 66.67
                });
            });

            it("should handle empty slots gracefully", () => {
                const metrics = DoctorAvailabilityCalculator.calculateMetrics([]);
                expect(metrics).toEqual({
                    totalSlots: 0,
                    bookedSlots: 0,
                    availableSlots: 0,
                    utilizationRate: 0
                });
            });
        });
    });

    describe("DoctorAvailabilityService", () => {
        it("should fetch availability for a doctor", async () => {
            getAvailabilityByDoctor.mockResolvedValue([{ id: 1, doctor_id: 2 }]);
            const result = await getDoctorAvailability(2);
            expect(result).toHaveLength(1);
            expect(getAvailabilityByDoctor).toHaveBeenCalledWith(2);
        });

        it("should throw if doctor ID is invalid", async () => {
            await expect(getDoctorAvailability(0)).rejects.toThrow("Doctor ID is required.");
        });

        it("should create availability", async () => {
            createAvailability.mockResolvedValue({ id: 1 });
            const result = await createDoctorAvailability(2, "2026-07-20", "09:00:00", "10:00:00", "Available");
            expect(result.id).toBe(1);
            expect(createAvailability).toHaveBeenCalledWith(2, "2026-07-20", "09:00:00", "10:00:00", "Available");
        });

        it("should query active open provider availability records", async () => {
            const openSlots = [{ id: 1, status: "Available" }];
            getOpenProviderAvailabilities.mockResolvedValue(openSlots);
            const result = await getOpenProviderAvailability();
            expect(result).toEqual(openSlots);
        });

        it("should track assignment metrics", async () => {
            getAvailabilityByDoctor.mockResolvedValue([
                { status: "Booked" },
                { status: "Available" }
            ]);
            const metrics = await getProviderMetrics(2);
            expect(metrics.utilizationRate).toBe(50);
        });

        it("should return collisions for a doctor", async () => {
            getAvailabilityByDoctor.mockResolvedValue([
                { start_time: "09:00:00", end_time: "10:00:00" }
            ]);
            const collisions = await getCollisions(2, "09:30:00", "10:30:00");
            expect(collisions).toHaveLength(1);
        });
    });
});
