import request from "supertest";
import { describe, it, expect, vi, beforeEach } from "vitest";
import app from "../../../app.js";

import * as predictionServices from "../../../src/objective2/services/predictionService.js";

vi.mock("../../../src/objective2/services/predictionService.js");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /prediction", () => {

  it("should return frequently used lenses and frames", async () => {

    predictionServices.fetchPredictionService.mockResolvedValue({
      valid: true,
      data: {
        frequentlyUsedLenses: [
          {
            lens_name: "Blue Cut Lens",
            total_used: "15",
          },
        ],
        frequentlyUsedFrames: [
          {
            frame_name: "Metal Frame",
            total_used: "10",
          },
        ],
      },
    });

    const response = await request(app).get("/prediction");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      frequentlyUsedLenses: [
        {
          lens_name: "Blue Cut Lens",
          total_used: "15",
        },
      ],
      frequentlyUsedFrames: [
        {
          frame_name: "Metal Frame",
          total_used: "10",
        },
      ],
    });

  });

  it("should return server error", async () => {

    predictionServices.fetchPredictionService.mockRejectedValue(
      new Error("Database Error")
    );

    const response = await request(app).get("/prediction");

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Failed to fetch prediction data.");

  });

});