import { describe, it, expect } from "vitest";
import {getFrequentlyUsedLenses, getFrequentlyUsedFrames,} from "../../../src/objective2/models/predictionModels.js";

describe("Prediction Models", () => {

  it("should fetch frequently used lenses", async () => {

    // Act
    const result = await getFrequentlyUsedLenses();

    // Assert
    expect(Array.isArray(result)).toBe(true);

  });

  it("should fetch frequently used frames", async () => {

    // Act
    const result = await getFrequentlyUsedFrames();

    // Assert
    expect(Array.isArray(result)).toBe(true);

  });

});