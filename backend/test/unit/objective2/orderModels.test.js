import { describe, it, expect, afterEach } from "vitest";
import pool from "../../../database/db.js";

import {getAllOrders, createOrder, updateOrder, deleteOrder} from "../../../src/objective2/models/orderModels.js";

const createdOrders = [];

describe("Order Models", () => {

  afterEach(async () => {

    for (const id of createdOrders) {

      await pool.query(
        "DELETE FROM orders WHERE id = $1",
        [id]
      );

    }

    createdOrders.length = 0;

  });

  it("should fetch all orders from the database", async () => {

    // Act
    const result = await getAllOrders();

    // Assert
    expect(Array.isArray(result)).toBe(true);

  });

  it("should create a new order", async () => {

    // Arrange
    const order = {
      patientName: `Test Patient ${Date.now()}`,
      lensName: "Blue Cut Lens",
      frameName: "Metal Frame",
    };

    // Act
    const result = await createOrder(order);

    createdOrders.push(result.id);

    // Assert
    expect(result.id).toBeDefined();
    expect(result.patient_name).toBe(order.patientName);
    expect(result.lens_name).toBe(order.lensName);
    expect(result.frame_name).toBe(order.frameName);

  });

  it("should update an existing order", async () => {

    // Arrange
    const created = await createOrder({
      patientName: `Update Patient ${Date.now()}`,
      lensName: "Blue Cut Lens",
      frameName: "Metal Frame",
    });

    createdOrders.push(created.id);

    // Act
    const result = await updateOrder(created.id, {
      patientName: "Updated Patient",
      lensName: "Progressive Lens",
      frameName: "Titanium Frame",
    });

    // Assert
    expect(result.id).toBe(created.id);
    expect(result.patient_name).toBe("Updated Patient");
    expect(result.lens_name).toBe("Progressive Lens");
    expect(result.frame_name).toBe("Titanium Frame");

  });

  it("should delete an existing order", async () => {

    // Arrange
    const created = await createOrder({
      patientName: `Delete Patient ${Date.now()}`,
      lensName: "Blue Cut Lens",
      frameName: "Metal Frame",
    });

    // Act
    const result = await deleteOrder(created.id);

    // Assert
    expect(result.id).toBe(created.id);
    expect(result.patient_name).toBe(created.patient_name);

  });

});