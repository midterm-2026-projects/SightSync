import { describe, it, expect, vi, beforeEach } from "vitest";
import pool from "../../../database/db.js";
import {getAllInventory, createInventory,} from "../../../src/objective2/models/inventoryModels.js";

// Mock database
vi.mock("../../../database/db.js", () => ({
  default: {
    query: vi.fn(),
  },
}));

describe("Inventory Models", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch all inventory", async () => {

    // Arrange
    pool.query
      .mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            name: "Blue Cut Lens",
            price: 1500,
            stock: 20,
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            name: "Metal Frame",
            price: 2500,
            stock: 5,
          },
        ],
      });

    // Act
    const result = await getAllInventory();

    // Assert
    expect(pool.query).toHaveBeenCalledTimes(2);

    expect(pool.query).toHaveBeenNthCalledWith(
      1,
      "SELECT * FROM lenses"
    );

    expect(pool.query).toHaveBeenNthCalledWith(
      2,
      "SELECT * FROM frames"
    );

    expect(result.lenses).toHaveLength(1);
    expect(result.frames).toHaveLength(1);

  });

  it("should create a Lens inventory", async () => {

    // Arrange
    const inventory = {
      name: "Blue Cut Lens",
      type: "Lens",
      price: 1500,
      stock: 20,
    };

    pool.query.mockResolvedValue({
      rows: [
        {
          id: 1,
          ...inventory,
        },
      ],
    });

    // Act
    const result = await createInventory(inventory);

    // Assert
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO lenses"),
      [
        "Blue Cut Lens",
        1500,
        20,
      ]
    );

    expect(result.name).toBe("Blue Cut Lens");
    expect(result.type).toBe("Lens");
    expect(result.price).toBe(1500);
    expect(result.stock).toBe(20);

  });

  it("should create a Frame inventory", async () => {

    // Arrange
    const inventory = {
      name: "Metal Frame",
      type: "Frame",
      price: 2500,
      stock: 5,
    };

    pool.query.mockResolvedValue({
      rows: [
        {
          id: 2,
          ...inventory,
        },
      ],
    });

    // Act
    const result = await createInventory(inventory);

    // Assert
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO frames"),
      [
        "Metal Frame",
        2500,
        5,
      ]
    );

    expect(result.name).toBe("Metal Frame");
    expect(result.type).toBe("Frame");
    expect(result.price).toBe(2500);
    expect(result.stock).toBe(5);

  });

});