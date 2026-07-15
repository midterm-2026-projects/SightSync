import request from "supertest";
import { describe, it, expect, vi, beforeEach } from "vitest";
import app from "../../../app.js";

import * as orderServices from "../../../src/objective2/services/orderServices.js";

vi.mock("../../../src/objective2/services/orderServices.js");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /orders", () => {

  it("should return all orders", async () => {

    orderServices.fetchOrdersService.mockResolvedValue([
      {
        id: 1,
        patient_name: "Juan Dela Cruz",
        lens_name: "Blue Cut Lens",
        frame_name: "Metal Frame",
      },
    ]);

    const response = await request(app).get("/orders");

    expect(response.status).toBe(200);

    expect(response.body).toEqual([
      {
        id: 1,
        patient_name: "Juan Dela Cruz",
        lens_name: "Blue Cut Lens",
        frame_name: "Metal Frame",
      },
    ]);

  });

  it("should return server error", async () => {

    orderServices.fetchOrdersService.mockRejectedValue(
      new Error("Database Error")
    );

    const response = await request(app).get("/orders");

    expect(response.status).toBe(500);

    expect(response.body.message).toBe(
      "Failed to fetch orders."
    );

  });

});

describe("POST /orders", () => {

  it("should create an order", async () => {

    orderServices.addOrderService.mockResolvedValue({
      valid: true,
      data: {
        id: 1,
        patient_name: "Juan Dela Cruz",
        lens_name: "Blue Cut Lens",
        frame_name: "Metal Frame",
      },
    });

    const response = await request(app)
      .post("/orders")
      .send({
        patientName: "Juan Dela Cruz",
        lensName: "Blue Cut Lens",
        frameName: "Metal Frame",
      });

    expect(response.status).toBe(201);

    expect(response.body).toEqual({
      id: 1,
      patient_name: "Juan Dela Cruz",
      lens_name: "Blue Cut Lens",
      frame_name: "Metal Frame",
    });

  });

  it("should return validation error when patient name is empty", async () => {

    orderServices.addOrderService.mockResolvedValue({
      valid: false,
      message: "Patient name is required.",
    });

    const response = await request(app)
      .post("/orders")
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Patient name is required.");

  });

  it("should return validation error when lens is empty", async () => {

    orderServices.addOrderService.mockResolvedValue({
      valid: false,
      message: "Lens is required.",
    });

    const response = await request(app)
      .post("/orders")
      .send({
        patientName: "Juan Dela Cruz",
        frameName: "Metal Frame",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Lens is required.");

  });

  it("should return validation error when frame is empty", async () => {

    orderServices.addOrderService.mockResolvedValue({
      valid: false,
      message: "Frame is required.",
    });

    const response = await request(app)
      .post("/orders")
      .send({
        patientName: "Juan Dela Cruz",
        lensName: "Blue Cut Lens",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Frame is required.");

  });

  it("should return server error", async () => {

    orderServices.addOrderService.mockRejectedValue(
      new Error("Database Error")
    );

    const response = await request(app)
      .post("/orders")
      .send({
        patientName: "Juan Dela Cruz",
        lensName: "Blue Cut Lens",
        frameName: "Metal Frame",
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Failed to create order.");

  });

});

describe("PUT /orders/:id", () => {

  it("should update an order", async () => {

    orderServices.editOrderService.mockResolvedValue({
      valid: true,
      data: {
        id: 1,
        patient_name: "Juan Updated",
        lens_name: "Progressive Lens",
        frame_name: "Titanium Frame",
      },
    });

    const response = await request(app)
      .put("/orders/1")
      .send({
        patientName: "Juan Updated",
        lensName: "Progressive Lens",
        frameName: "Titanium Frame",
      });

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      id: 1,
      patient_name: "Juan Updated",
      lens_name: "Progressive Lens",
      frame_name: "Titanium Frame",
    });

  });

  it("should return validation error when order id is invalid", async () => {

    orderServices.editOrderService.mockResolvedValue({
      valid: false,
      message: "Invalid order ID.",
    });

    const response = await request(app)
      .put("/orders/abc")
      .send({
        patientName: "Juan",
        lensName: "Blue Cut Lens",
        frameName: "Metal Frame",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid order ID.");

  });

  it("should return order not found", async () => {

    orderServices.editOrderService.mockResolvedValue({
      valid: false,
      message: "Order not found.",
    });

    const response = await request(app)
      .put("/orders/999")
      .send({
        patientName: "Juan",
        lensName: "Blue Cut Lens",
        frameName: "Metal Frame",
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Order not found.");

  });

  it("should return server error", async () => {

    orderServices.editOrderService.mockRejectedValue(
      new Error("Database Error")
    );

    const response = await request(app)
      .put("/orders/1")
      .send({
        patientName: "Juan",
        lensName: "Blue Cut Lens",
        frameName: "Metal Frame",
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Failed to update order.");

  });

});

describe("DELETE /orders/:id", () => {

  it("should delete an order", async () => {

    orderServices.removeOrderService.mockResolvedValue({
      valid: true,
    });

    const response = await request(app).delete("/orders/1");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Order deleted successfully.");

  });

  it("should return order not found", async () => {

    orderServices.removeOrderService.mockResolvedValue({
      valid: false,
      message: "Order not found.",
    });

    const response = await request(app).delete("/orders/999");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Order not found.");

  });

  it("should return validation error when order id is invalid", async () => {

    orderServices.removeOrderService.mockResolvedValue({
      valid: false,
      message: "Invalid order ID.",
    });

    const response = await request(app).delete("/orders/abc");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid order ID.");

  });

  it("should return server error", async () => {

    orderServices.removeOrderService.mockRejectedValue(
      new Error("Database Error")
    );

    const response = await request(app).delete("/orders/1");

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Failed to delete order.");

  });

});