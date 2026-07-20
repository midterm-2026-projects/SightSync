import { describe, it, expect } from "vitest";
import {validateOrder,validateOrderId,fetchOrdersService,addOrderService, editOrderService, removeOrderService} from "../../../src/objective2/services/orderServices.js";
import { createInventory } from "../../../src/objective2/models/inventoryModels.js";

describe("Order Validation Service", () => {

  it("should return valid when order data is correct", () => {

    // Arrange
    const order = {
      patientName: "Juan Dela Cruz",
      lensName: "Blue Cut Lens",
      frameName: "Metal Frame",
    };

    // Act
    const result = validateOrder(order);

    // Assert
    expect(result.valid).toBe(true);

  });

  it("should return invalid when patient name is empty", () => {

    // Arrange
    const order = {
      patientName: "",
      lensName: "Blue Cut Lens",
      frameName: "Metal Frame",
    };

    // Act
    const result = validateOrder(order);

    // Assert
    expect(result.valid).toBe(false);
    expect(result.message).toBe("Patient name is required.");

  });

  it("should return invalid when lens is empty", () => {

    // Arrange
    const order = {
      patientName: "Juan Dela Cruz",
      lensName: "",
      frameName: "Metal Frame",
    };

    // Act
    const result = validateOrder(order);

    // Assert
    expect(result.valid).toBe(false);
    expect(result.message).toBe("Lens is required.");

  });

  it("should return invalid when frame is empty", () => {

    // Arrange
    const order = {
      patientName: "Juan Dela Cruz",
      lensName: "Blue Cut Lens",
      frameName: "",
    };

    // Act
    const result = validateOrder(order);

    // Assert
    expect(result.valid).toBe(false);
    expect(result.message).toBe("Frame is required.");

  });

});

describe("Order ID Validation Service", () => {

  it("should return valid when order id is correct", () => {

    // Arrange
    const id = 1;

    // Act
    const result = validateOrderId(id);

    // Assert
    expect(result.valid).toBe(true);

  });

  it("should return invalid when order id is missing", () => {

    // Act
    const result = validateOrderId();

    // Assert
    expect(result.valid).toBe(false);
    expect(result.message).toBe("Order ID is required.");

  });

  it("should return invalid when order id is empty", () => {

    // Arrange
    const id = "";

    // Act
    const result = validateOrderId(id);

    // Assert
    expect(result.valid).toBe(false);
    expect(result.message).toBe("Order ID is required.");

  });

  it("should return invalid when order id is not a number", () => {

    // Arrange
    const id = "abc";

    // Act
    const result = validateOrderId(id);

    // Assert
    expect(result.valid).toBe(false);
    expect(result.message).toBe("Invalid order ID.");

  });

describe("Fetch Orders Service", () => {

  it("should fetch all orders", async () => {

    // Act
    const result = await fetchOrdersService();

    // Assert
    expect(result.valid).toBe(true);
    expect(Array.isArray(result.data)).toBe(true);

  });

});

describe("Add Order Service", () => {

  it("should add a new order", async () => {

    // Arrange
    const lens = await createInventory({
      name: `Lens ${Date.now()}`,
      type: "Lens",
      price: 1500,
      stock: 10,
    });

    const frame = await createInventory({
      name: `Frame ${Date.now()}`,
      type: "Frame",
      price: 2000,
      stock: 10,
    });

    const order = {
      patientName: "Juan Dela Cruz",
      lensName: lens.name,
      frameName: frame.name,
    };

    // Act
    const result = await addOrderService(order);

    // Assert
    expect(result.valid).toBe(true);
    expect(result.data.id).toBeDefined();
    expect(result.data.patient_name).toBe(order.patientName);
    expect(result.data.lens_name).toBe(order.lensName);
    expect(result.data.frame_name).toBe(order.frameName);

  });

  it("should return validation error when patient name is empty", async () => {

    // Arrange
    const order = {
      patientName: "",
      lensName: "Blue Cut Lens",
      frameName: "Metal Frame",
    };

    // Act
    const result = await addOrderService(order);

    // Assert
    expect(result.valid).toBe(false);
    expect(result.message).toBe("Patient name is required.");

  });

  it("should return validation error when lens is empty", async () => {

    // Arrange
    const order = {
      patientName: "Juan Dela Cruz",
      lensName: "",
      frameName: "Metal Frame",
    };

    // Act
    const result = await addOrderService(order);

    // Assert
    expect(result.valid).toBe(false);
    expect(result.message).toBe("Lens is required.");

  });

  it("should return validation error when frame is empty", async () => {

    // Arrange
    const order = {
      patientName: "Juan Dela Cruz",
      lensName: "Blue Cut Lens",
      frameName: "",
    };

    // Act
    const result = await addOrderService(order);

    // Assert
    expect(result.valid).toBe(false);
    expect(result.message).toBe("Frame is required.");

  });

  it("should return error when lens is not found", async () => {

    // Arrange
    const order = {
      patientName: "Juan Dela Cruz",
      lensName: "Unknown Lens",
      frameName: "Metal Frame",
    };

    // Act
    const result = await addOrderService(order);

    // Assert
    expect(result.valid).toBe(false);
    expect(result.message).toBe("Lens not found.");

  });

  it("should return error when frame is not found", async () => {

    // Arrange
    const lens = await createInventory({
      name: `Lens ${Date.now()}`,
      type: "Lens",
      price: 1500,
      stock: 10,
    });

    const order = {
      patientName: "Juan Dela Cruz",
      lensName: lens.name,
      frameName: "Unknown Frame",
    };

    // Act
    const result = await addOrderService(order);

    // Assert
    expect(result.valid).toBe(false);
    expect(result.message).toBe("Frame not found.");

  });

  it("should return error when selected lens is out of stock", async () => {

    // Arrange
    const lens = await createInventory({
      name: `Lens ${Date.now()}`,
      type: "Lens",
      price: 1500,
      stock: 0,
    });

    const frame = await createInventory({
      name: `Frame ${Date.now()}`,
      type: "Frame",
      price: 2000,
      stock: 10,
    });

    const order = {
      patientName: "Juan Dela Cruz",
      lensName: lens.name,
      frameName: frame.name,
    };

    // Act
    const result = await addOrderService(order);

    // Assert
    expect(result.valid).toBe(false);
    expect(result.message).toBe("Selected lens is out of stock.");

  });

  it("should return error when selected frame is out of stock", async () => {

    // Arrange
    const lens = await createInventory({
      name: `Lens ${Date.now()}`,
      type: "Lens",
      price: 1500,
      stock: 10,
    });

    const frame = await createInventory({
      name: `Frame ${Date.now()}`,
      type: "Frame",
      price: 2000,
      stock: 0,
    });

    const order = {
      patientName: "Juan Dela Cruz",
      lensName: lens.name,
      frameName: frame.name,
    };

    // Act
    const result = await addOrderService(order);

    // Assert
    expect(result.valid).toBe(false);
    expect(result.message).toBe("Selected frame is out of stock.");

  });

});

describe("Edit Order Service", () => {

  it("should update an existing order", async () => {

    // Arrange
    const lens = await createInventory({
      name: `Lens ${Date.now()}`,
      type: "Lens",
      price: 1500,
      stock: 10,
    });

    const frame = await createInventory({
      name: `Frame ${Date.now()}`,
      type: "Frame",
      price: 2000,
      stock: 10,
    });

    const newLens = await createInventory({
      name: `New Lens ${Date.now()}`,
      type: "Lens",
      price: 3000,
      stock: 10,
    });

    const newFrame = await createInventory({
      name: `New Frame ${Date.now()}`,
      type: "Frame",
      price: 5000,
      stock: 10,
    });

    const order = await addOrderService({
      patientName: `Test Patient ${Date.now()}`,
      lensName: lens.name,
      frameName: frame.name,
    });

    // Act
    const result = await editOrderService(order.data.id, {
      patientName: "Updated Patient",
      lensName: newLens.name,
      frameName: newFrame.name,
    });
    // Assert
    expect(result.valid).toBe(true);
    expect(result.data.id).toBe(order.data.id);
    expect(result.data.patient_name).toBe("Updated Patient");
    expect(result.data.lens_name).toBe(newLens.name);
    expect(result.data.frame_name).toBe(newFrame.name);
  });

  it("should return validation error when order id is missing", async () => {

    // Act
    const result = await editOrderService("", {
      patientName: "Juan Dela Cruz",
      lensName: "Blue Cut Lens",
      frameName: "Metal Frame",
    });

    // Assert
    expect(result.valid).toBe(false);
    expect(result.message).toBe("Order ID is required.");

  });

  it("should return validation error when patient name is empty", async () => {

    // Act
    const result = await editOrderService(1, {
      patientName: "",
      lensName: "Blue Cut Lens",
      frameName: "Metal Frame",
    });

    // Assert
    expect(result.valid).toBe(false);
    expect(result.message).toBe("Patient name is required.");

  });

  it("should return order not found", async () => {

    // Act
    const result = await editOrderService(999999, {
      patientName: "Juan Dela Cruz",
      lensName: "Blue Cut Lens",
      frameName: "Metal Frame",
    });

    // Assert
    expect(result.valid).toBe(false);
    expect(result.message).toBe("Order not found.");

  });

});

describe("Remove Order Service", () => {

  it("should delete an existing order", async () => {

    // Arrange
    const lens = await createInventory({
      name: `Lens ${Date.now()}`,
      type: "Lens",
      price: 1500,
      stock: 10,
    });

    const frame = await createInventory({
      name: `Frame ${Date.now()}`,
      type: "Frame",
      price: 2000,
      stock: 10,
    });

    const order = await addOrderService({
      patientName: `Test Patient ${Date.now()}`,
      lensName: lens.name,
      frameName: frame.name,
    });

    // Act
    const result = await removeOrderService(order.data.id);

    // Assert
    expect(result.valid).toBe(true);
    expect(result.data.id).toBe(order.data.id);
    expect(result.data.patient_name).toBe(order.data.patient_name);

  });

  it("should return validation error when order id is missing", async () => {

    // Act
    const result = await removeOrderService("");

    // Assert
    expect(result.valid).toBe(false);
    expect(result.message).toBe("Order ID is required.");

  });

  it("should return validation error when order id is not a number", async () => {

    // Arrange
    const id = "abc";

    // Act
    const result = await removeOrderService(id);

    // Assert
    expect(result.valid).toBe(false);
    expect(result.message).toBe("Invalid order ID.");

  });

  it("should return order not found", async () => {

    // Arrange
    const id = 999999;

    // Act
    const result = await removeOrderService(id);

    // Assert
    expect(result.valid).toBe(false);
    expect(result.message).toBe("Order not found.");

  });

});

});