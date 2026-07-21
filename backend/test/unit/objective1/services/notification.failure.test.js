import { describe, it, expect, vi, beforeEach } from "vitest";

import {
    sendNotification,
    sendAppointmentConfirmation,
    notificationEmitter
} from "../../../../src/objective1/services/notification.service.js";

describe("Notification Failure & Event Emitter Tests", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        notificationEmitter.removeAllListeners();
    });

    describe("Graceful Error & Timeout Catcher", () => {
        it("should capture simple network throws gracefully", async () => {
            const badNetworkCall = async () => {
                throw new Error("Connection reset by peer");
            };

            const result = await sendNotification(badNetworkCall);
            expect(result.success).toBe(false);
            expect(result.message).toBe("Network service unavailable.");
        });

        it("should interrupt and capture long hanging network callbacks without freezing", async () => {
            const hangingCall = async () => {
                // Simulate an infinite hang
                await new Promise(resolve => setTimeout(resolve, 10000));
                return { success: true };
            };

            // Run with a very short timeout (e.g. 50ms) to ensure it interrupts
            const startTime = Date.now();
            const result = await sendNotification(hangingCall, 50);
            const duration = Date.now() - startTime;

            expect(result.success).toBe(false);
            expect(result.message).toBe("Network service unavailable.");
            // Ensure the function aborted quickly without waiting for the full 10s
            expect(duration).toBeLessThan(500);
        });

        it("should fail gracefully if a non-function callback is passed", async () => {
            const result = await sendNotification(null);
            expect(result.success).toBe(false);
            expect(result.message).toBe("Network service unavailable.");
        });
    });

    describe("Communication Event Emitters", () => {
        it("should emit confirmation payloads on scheduling event triggers", async () => {
            const mockAppointment = {
                id: 42,
                patient_id: 101,
                doctor_id: 202,
                appointment_date: "2026-07-20",
                appointment_time: "09:30:00"
            };

            let receivedPayload = null;
            notificationEmitter.on("appointmentConfirmation", (payload) => {
                receivedPayload = payload;
            });

            await sendAppointmentConfirmation(mockAppointment);

            expect(receivedPayload).not.toBeNull();
            expect(receivedPayload.success).toBe(true);
            expect(receivedPayload.appointmentId).toBe(42);
            expect(receivedPayload.patientId).toBe(101);
            expect(receivedPayload.doctorId).toBe(202);
            expect(receivedPayload.date).toBe("2026-07-20");
            expect(receivedPayload.time).toBe("09:30:00");
        });
    });
});
