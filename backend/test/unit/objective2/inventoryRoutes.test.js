import request from "supertest";
import express from "express";
import { describe, it, expect, vi, beforeEach } from "vitest";
import router from "../../../src/objective2/routes/inventory.js";
import * as inventoryModels from "../../../src/objective2/models/inventoryModels.js";
import * as inventoryServices from "../../../src/objective2/services/inventoryServices.js";

// Mock model
vi.mock("../../../src/objective2/models/inventoryModels.js");

// Mock service
vi.mock("../../../src/objective2/services/inventoryServices.js");

const app = express();

app.use(express.json());
app.use("/inventory", router);

describe("Inventory Routes", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET /inventory should return inventory", async () => {

    inventoryModels.getAllInventory.mockResolvedValue({
      lenses: [],
      frames: [],
    });

    const response = await request(app).get("/inventory");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      lenses: [],
      frames: [],
    });

  });

  it("POST /inventory should create inventory", async () => {

    inventoryServices.validateInventory.mockReturnValue({
      valid: true,
    });

    inventoryModels.createInventory.mockResolvedValue({
      id: 1,
      name: "Blue Cut Lens",
      type: "Lens",
      price: 1500,
      stock: 20,
    });

    const response = await request(app)
      .post("/inventory")
      .send({
        name: "Blue Cut Lens",
        type: "Lens",
        price: 1500,
        stock: 20,
      });

    expect(response.status).toBe(201);

    expect(response.body.name).toBe("Blue Cut Lens");

  });

  it("POST /inventory should return validation error", async () => {

    inventoryServices.validateInventory.mockReturnValue({
      valid: false,
      message: "Product name is required.",
    });

    const response = await request(app)
      .post("/inventory")
      .send({});

    expect(response.status).toBe(400);

    expect(response.body.message).toBe(
      "Product name is required."
    );

  });

  it("POST /inventory should return server error", async () => {

    inventoryServices.validateInventory.mockReturnValue({
      valid: true,
    });

    inventoryModels.createInventory.mockRejectedValue(
      new Error("Database Error")
    );

    const response = await request(app)
      .post("/inventory")
      .send({
        name: "Blue Cut Lens",
        type: "Lens",
        price: 1500,
        stock: 20,
      });

    expect(response.status).toBe(500);

    expect(response.body.message).toBe(
      "Failed to create inventory."
    );

  });

  it("PUT /inventory/:id should update inventory price", async () => {

    inventoryServices.validatePrice.mockReturnValue({
      valid: true,
    });

    inventoryModels.updateInventoryPrice.mockResolvedValue({
      id: 1,
      name: "Blue Cut Lens",
      price: 2000,
      stock: 20,
    });

    const response = await request(app)
      .put("/inventory/lenses/1")
      .send({
        price: 2000,
      });

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      id: 1,
      name: "Blue Cut Lens",
      price: 2000,
      stock: 20,
    });

  });

  it("PUT /inventory/:id should return validation error", async () => {

    inventoryServices.validatePrice.mockReturnValue({
      valid: false,
      message: "Price must be greater than zero.",
    });

    const response = await request(app)
      .put("/inventory/lenses/1")
      .send({
        price: 0,
      });

    expect(response.status).toBe(400);

    expect(response.body.message).toBe(
      "Price must be greater than zero."
    );

  });

});