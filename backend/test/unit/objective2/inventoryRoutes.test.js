import request from "supertest";
import { describe, it, expect, vi, beforeEach } from "vitest";
import app from "../../../app.js";
import * as inventoryModels from "../../../src/objective2/models/inventoryModels.js";
import * as inventoryServices from "../../../src/objective2/services/inventoryServices.js";

// Mock model
vi.mock("../../../src/objective2/models/inventoryModels.js");

// Mock service
vi.mock("../../../src/objective2/services/inventoryServices.js");


 beforeEach(() => {
    vi.clearAllMocks();
  });

describe("GET Inventory Routes", () => {

  it( "inventory should return inventory", async () => {

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

    it("should return inventory with data", async () => {

  // Arrange
  inventoryModels.getAllInventory.mockResolvedValue({
    lenses: [
      {
        id: 1,
        name: "Blue Cut Lens",
        price: 1500,
        stock: 20,
      },
    ],
    frames: [
      {
        id: 1,
        name: "Metal Frame",
        price: 2500,
        stock: 10,
      },
    ],
  });

  // Act
  const response = await request(app).get("/inventory");

  // Assert
  expect(response.status).toBe(200);

  expect(response.body).toEqual({
    lenses: [
      {
        id: 1,
        name: "Blue Cut Lens",
        price: 1500,
        stock: 20,
      },
    ],
    frames: [
      {
        id: 1,
        name: "Metal Frame",
        price: 2500,
        stock: 10,
      },
    ],
  });

});

  });

describe("POST /inventory", () => {

  it("should create inventory", async () => {

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

    // UPDATED ASSERTION
    expect(response.body).toEqual({
      id: 1,
      name: "Blue Cut Lens",
      type: "Lens",
      price: 1500,
      stock: 20,
    });

  });

  it("should return validation error when product name is empty", async () => {

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

  it("should return validation error when product type is invalid", async () => {

    inventoryServices.validateInventory.mockReturnValue({
      valid: false,
      message: "Product type must be either Lens or Frame.",
    });

    const response = await request(app)
      .post("/inventory")
      .send({
        name: "Blue Cut Lens",
        type: "Camera",
        price: 1500,
        stock: 20,
      });

    expect(response.status).toBe(400);

    expect(response.body.message).toBe(
      "Product type must be either Lens or Frame."
    );

  });

  it("should return validation error when price is missing", async () => {

    inventoryServices.validateInventory.mockReturnValue({
      valid: false,
      message: "Price is required.",
    });

    const response = await request(app)
      .post("/inventory")
      .send({
        name: "Blue Cut Lens",  
        type: "Lens",
        stock: 20,
      });

    expect(response.status).toBe(400);

    expect(response.body.message).toBe(
      "Price is required."
    );

  });

  it("should return validation error when price is less than or equal to zero", async () => {

    inventoryServices.validateInventory.mockReturnValue({
      valid: false,
      message: "Price must be greater than zero.",
    });

    const response = await request(app)
      .post("/inventory")
      .send({
        name: "Blue Cut Lens",
        type: "Lens",
        price: 0,
        stock: 20,
      });

    expect(response.status).toBe(400);

    expect(response.body.message).toBe(
      "Price must be greater than zero."
    );

  });

  it("should return validation error when stock is missing", async () => {

    inventoryServices.validateInventory.mockReturnValue({
      valid: false,
      message: "Stock is required.",
    });

    const response = await request(app)
      .post("/inventory")
      .send({
        name: "Blue Cut Lens",
        type: "Lens",
        price: 1500,
      });

    expect(response.status).toBe(400);

    expect(response.body.message).toBe(
      "Stock is required."
    );

  });

  it("should return validation error when stock is negative", async () => {

    inventoryServices.validateInventory.mockReturnValue({
      valid: false,
      message: "Stock cannot be negative.",
    });

    const response = await request(app)
      .post("/inventory")
      .send({
        name: "Blue Cut Lens",
        type: "Lens",
        price: 1500,
        stock: -5,
      });

    expect(response.status).toBe(400);

    expect(response.body.message).toBe(
      "Stock cannot be negative."
    );

  });

  it("should return server error", async () => {

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

});

describe("PUT /inventory/:table/:id", () => {

  it("should update inventory price", async () => {

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
      .put("/inventory/lenses/1/price")
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

  it("should return validation error when price is missing", async () => {

    inventoryServices.validatePrice.mockReturnValue({
      valid: false,
      message: "Price is required.",
    });

    const response = await request(app)
      .put("/inventory/lenses/1/price")
      .send({});

    expect(response.status).toBe(400);

    expect(response.body.message).toBe(
      "Price is required."
    );

  });

  it("should return validation error when price is less than or equal to zero", async () => {

    inventoryServices.validatePrice.mockReturnValue({
      valid: false,
      message: "Price must be greater than zero.",
    });

    const response = await request(app)
      .put("/inventory/lenses/1/price")
      .send({
        price: 0,
      });

    expect(response.status).toBe(400);

    expect(response.body.message).toBe(
      "Price must be greater than zero."
    );

  });

  it("should return not found when inventory does not exist", async () => {

    inventoryServices.validatePrice.mockReturnValue({
      valid: true,
    });

    inventoryModels.updateInventoryPrice.mockResolvedValue(null);

    const response = await request(app)
      .put("/inventory/lenses/999/price")
      .send({
        price: 2000,
      });

    expect(response.status).toBe(404);

    expect(response.body.message).toBe(
      "Inventory not found."
    );

  });


  it("should return server error when updating inventory price fails", async () => {

    inventoryServices.validatePrice.mockReturnValue({
      valid: true,
    });

    inventoryModels.updateInventoryPrice.mockRejectedValue(
      new Error("Database Error")
    );

    const response = await request(app)
      .put("/inventory/lenses/1/price")
      .send({
        price: 2000,
      });

    expect(response.status).toBe(500);

    expect(response.body.message).toBe(
      "Failed to update inventory price."
    );

  });

  it("should return validation error when table is invalid", async () => {

    const response = await request(app)
      .put("/inventory/products/1/price")
      .send({
        price: 2000,
      });

    expect(response.status).toBe(400);

    expect(response.body.message).toBe(
      "Invalid inventory table."
    );

  });

  it("should return validation error when inventory id is invalid", async () => {

    const response = await request(app)
      .put("/inventory/lenses/abc/price")
      .send({
        price: 2000,
      });

    expect(response.status).toBe(400);

    expect(response.body.message).toBe(
      "Invalid inventory ID."
    );

  });

// NEW

describe("GET /inventory/:table/:id/stock", () => {

  it("should fetch current stock", async () => {

    inventoryModels.getCurrentStock.mockResolvedValue({
      id: 1,
      name: "Blue Cut Lens",
      stock: 20,
    });

    const response = await request(app)
      .get("/inventory/lenses/1/stock");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      id: 1,
      name: "Blue Cut Lens",
      stock: 20,
    });

  });

  it("should return invalid inventory table", async () => {

    const response = await request(app)
      .get("/inventory/products/1/stock");

    expect(response.status).toBe(400);

    expect(response.body.message)
      .toBe("Invalid inventory table.");

  });

  it("should return invalid inventory id", async () => {

    const response = await request(app)
      .get("/inventory/lenses/abc/stock");

    expect(response.status).toBe(400);

    expect(response.body.message)
      .toBe("Invalid inventory ID.");

  });

  it("should return inventory not found", async () => {

    inventoryModels.getCurrentStock.mockResolvedValue(null);

    const response = await request(app)
      .get("/inventory/lenses/999/stock");

    expect(response.status).toBe(404);

    expect(response.body.message)
      .toBe("Inventory not found.");

  });

  it("should return server error", async () => {

    inventoryModels.getCurrentStock.mockRejectedValue(
      new Error("Database Error")
    );

    const response = await request(app)
      .get("/inventory/lenses/1/stock");

    expect(response.status).toBe(500);

    expect(response.body.message)
      .toBe("Failed to fetch current stock.");

  });

});

// NEW

describe("PUT /inventory/:table/:id/stock", () => {

  it("should update inventory stock", async () => {

    inventoryModels.updateStock.mockResolvedValue({
      id: 1,
      name: "Blue Cut Lens",
      stock: 15,
    });

    const response = await request(app)
      .put("/inventory/lenses/1/stock")
      .send({
        stock: 15,
      });

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      id: 1,
      name: "Blue Cut Lens",
      stock: 15,
    });

  });

  it("should return invalid inventory table", async () => {

    const response = await request(app)
      .put("/inventory/products/1/stock")
      .send({
        stock: 10,
      });

    expect(response.status).toBe(400);

    expect(response.body.message)
      .toBe("Invalid inventory table.");

  });

  it("should return invalid inventory id", async () => {

    const response = await request(app)
      .put("/inventory/lenses/abc/stock")
      .send({
        stock: 10,
      });

    expect(response.status).toBe(400);

    expect(response.body.message)
      .toBe("Invalid inventory ID.");

  });

  it("should return validation error when stock is missing", async () => {

    const response = await request(app)
      .put("/inventory/lenses/1/stock")
      .send({});

    expect(response.status).toBe(400);

    expect(response.body.message)
      .toBe("Stock is required.");

  });

  it("should return inventory not found", async () => {

    inventoryModels.updateStock.mockResolvedValue(null);

    const response = await request(app)
      .put("/inventory/lenses/999/stock")
      .send({
        stock: 10,
      });

    expect(response.status).toBe(404);

    expect(response.body.message)
      .toBe("Inventory not found.");

  });

  it("should return server error", async () => {

    inventoryModels.updateStock.mockRejectedValue(
      new Error("Database Error")
    );

    const response = await request(app)
      .put("/inventory/lenses/1/stock")
      .send({
        stock: 10,
      });

    expect(response.status).toBe(500);

    expect(response.body.message)
      .toBe("Failed to update stock.");

  });

});

});
