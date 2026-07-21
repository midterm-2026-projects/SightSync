import {
    describe,
    it,
    expect
} from "vitest";

import {
    sendNotification
} from "../../../../src/objective1/services/notification.service.js";

describe("Notification Service", () => {

    it("handles network failure gracefully", async () => {

        const result =
            await sendNotification(async () => {

                throw new Error("Network Error");

            });

        expect(result.success).toBe(false);

    });

    it("returns success when notification is sent", async () => {

        const result =
            await sendNotification(async () => ({

                success: true

            }));

        expect(result.success).toBe(true);

    });

});