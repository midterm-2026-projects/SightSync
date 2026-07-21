import { describe, it, expect } from "vitest";

import { hasScheduleConflict } from "../../../../src/objective1/services/conflict.service.js";

describe("Conflict Service", () => {

    it("should detect overlapping appointments", () => {

        const existingAppointments = [
            {
                start_time: "09:00:00",
                end_time: "09:30:00"
            }
        ];

        const result = hasScheduleConflict(
            existingAppointments,
            "09:15:00",
            "09:45:00"
        );

        expect(result).toBe(true);

    });

    it("should not detect conflict when appointment is after existing appointment", () => {

        const existingAppointments = [
            {
                start_time: "09:00:00",
                end_time: "09:30:00"
            }
        ];

        const result = hasScheduleConflict(
            existingAppointments,
            "09:30:00",
            "10:00:00"
        );

        expect(result).toBe(false);

    });

    it("should not detect conflict when appointment is before existing appointment", () => {

        const existingAppointments = [
            {
                start_time: "09:30:00",
                end_time: "10:00:00"
            }
        ];

        const result = hasScheduleConflict(
            existingAppointments,
            "09:00:00",
            "09:30:00"
        );

        expect(result).toBe(false);

    });

    it("should return false when there are no existing appointments", () => {

        const result = hasScheduleConflict(
            [],
            "09:00:00",
            "09:30:00"
        );

        expect(result).toBe(false);

    });

    it("should detect conflict when appointment is completely inside an existing appointment", () => {

        const existingAppointments = [
            {
                start_time: "09:00:00",
                end_time: "10:00:00"
            }
        ];

        const result = hasScheduleConflict(
            existingAppointments,
            "09:15:00",
            "09:45:00"
        );

        expect(result).toBe(true);

    });

    it("should detect conflict when appointment completely covers an existing appointment", () => {

        const existingAppointments = [
            {
                start_time: "09:15:00",
                end_time: "09:45:00"
            }
        ];

        const result = hasScheduleConflict(
            existingAppointments,
            "09:00:00",
            "10:00:00"
        );

        expect(result).toBe(true);

    });

});