import { describe, it, expect } from "vitest";
import { fetchPredictionService } from "../../../src/objective2/services/predictionService.js";

describe("Fetch Prediction Service", () => {

  it("should fetch frequently used lenses and frames", async () => {

    // Act
    const result = await fetchPredictionService();

    // Assert
    expect(result.valid).toBe(true);
    expect(Array.isArray(result.data.frequentlyUsedLenses)).toBe(true);
    expect(Array.isArray(result.data.frequentlyUsedFrames)).toBe(true);

  });

});