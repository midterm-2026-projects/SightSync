import request from "supertest";
import { describe, it, expect, vi, beforeEach } from "vitest";
import app from "../../../app.js";

// ==========================================
// 1. MOCKS
// ==========================================
// Mock db so module-level pool creation doesn't fail
vi.mock("../../../database/db.js", () => ({
  default: { query: vi.fn().mockResolvedValue({ rows: [], rowCount: 0 }) },
}));

// Mock PaymentModel so controller instantiation works
vi.mock("../../../src/objective3/Models/payment.js", () => ({
  default: class MockPaymentModel {
    constructor() {}
    create = vi.fn();
    findById = vi.fn();
    findAll = vi.fn();
    updateStatus = vi.fn();
    delete = vi.fn();
  },
}));

// Mock PaymentService class — controller calls `new PaymentService(pool)`
// WARNING: vi.mock factory is hoisted to the top — no outer variable references allowed.
// All logic must be self-contained inside the factory callback.
vi.mock("../../../src/objective3/Service/paymentService.js", () => {
  const cls = class MockPaymentService {
    constructor() {}
  };
  cls.prototype.create = vi.fn();
  cls.prototype.findById = vi.fn();
  cls.prototype.findAll = vi.fn();
  cls.prototype.updateStatus = vi.fn();
  cls.prototype.delete = vi.fn();
  return { default: cls };
});

// Mock validation middleware for payment routes
vi.mock("../../../src/objective3/middleware/vallidation.js", () => ({
  validatePaymentForm: vi.fn(),
  validateDepositForm: vi.fn(),
  makeFormValidationMiddleware: vi.fn((validatorFn) => (req, res, next) => {
    const result = validatorFn(req.body);
    if (!result.valid) {
      return res.status(400).json({ success: false, errors: result.errors });
    }
    next();
  }),
  isValidDate: vi.fn(),
}));

// Controller creates a payment service instance at module level.
// We need a reference to control the mock methods on that instance.
// Since we mocked PaymentService as a class, its prototype methods are vi.fn().
// However, the controller uses the instance methods. We'll grab the mock
// constructor and override behavior per test via prototype, or we can
// import the instance directly. To keep it simple, we mock the class
// such that each new instance gets fresh vi.fn() methods — then we
// just call those mock methods via the prototype.

describe("Payment Routes (Objective 3)", () => {
  let paymentServiceMock;

  beforeEach(async () => {
    vi.clearAllMocks();

    // Set default validation to pass
    const { validatePaymentForm } = await import(
      "../../../src/objective3/middleware/vallidation.js"
    );
    validatePaymentForm.mockReturnValue({ valid: true, errors: [] });
  });

  // ──────────────────────────────────────────
  // POST /api/payments
  // ──────────────────────────────────────────
  describe("POST /api/payments", () => {
    it("should create a payment and return 201", async () => {
      // Get the mock class and set up its instance method
      const { default: MockPaymentService } = await import(
        "../../../src/objective3/Service/paymentService.js"
      );
      // The controller does `new PaymentService(pool)`. Since we mocked the class,
      // each call to `new MockPaymentService()` creates an instance with vi.fn() methods.
      // We need to mock the `create` method on the prototype so the controller's instance picks it up.
      const mockInstance = MockPaymentService.mock?.instances?.[0];
      // Simpler approach: just mock the prototype
      MockPaymentService.prototype.create.mockResolvedValue({
        id: 1,
        amount: 250.5,
        payment_date: "2026-07-20",
        method: "cash",
        status: "completed",
      });

      const response = await request(app)
        .post("/api/payments")
        .send({
          amount: 250.5,
          payment_date: "2026-07-20",
          method: "cash",
          status: "completed",
        });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        id: 1,
        amount: 250.5,
        status: "completed",
      });
    });

    it("should return 400 when validation fails", async () => {
      const { validatePaymentForm } = await import(
        "../../../src/objective3/middleware/vallidation.js"
      );
      validatePaymentForm.mockReturnValue({
        valid: false,
        errors: ["amount must be greater than 0."],
      });

      const response = await request(app)
        .post("/api/payments")
        .send({ amount: 0, payment_date: "2026-07-20" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        errors: ["amount must be greater than 0."],
      });
    });

    it("should return 500 when service throws", async () => {
      const { default: MockPaymentService } = await import(
        "../../../src/objective3/Service/paymentService.js"
      );
      MockPaymentService.prototype.create.mockRejectedValue(
        new Error("Database error")
      );

      const response = await request(app)
        .post("/api/payments")
        .send({ amount: 100, payment_date: "2026-07-20" });

      expect(response.status).toBe(500);
    });
  });

  // ──────────────────────────────────────────
  // GET /api/payments
  // ──────────────────────────────────────────
  describe("GET /api/payments", () => {
    it("should return all payments", async () => {
      const { default: MockPaymentService } = await import(
        "../../../src/objective3/Service/paymentService.js"
      );
      MockPaymentService.prototype.findAll.mockResolvedValue([
        { id: 1, amount: 100, method: "cash", status: "completed" },
        { id: 2, amount: 200, method: "online", status: "pending" },
      ]);

      const response = await request(app).get("/api/payments");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });
  });

  // ──────────────────────────────────────────
  // GET /api/payments/:id
  // ──────────────────────────────────────────
  describe("GET /api/payments/:id", () => {
    it("should return a payment by id", async () => {
      const { default: MockPaymentService } = await import(
        "../../../src/objective3/Service/paymentService.js"
      );
      MockPaymentService.prototype.findById.mockResolvedValue({
        id: 1,
        amount: 100,
        method: "cash",
        status: "completed",
      });

      const response = await request(app).get("/api/payments/1");

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
    });

    it("should return 404 when payment is not found", async () => {
      const { default: MockPaymentService } = await import(
        "../../../src/objective3/Service/paymentService.js"
      );
      MockPaymentService.prototype.findById.mockResolvedValue(null);

      const response = await request(app).get("/api/payments/999");

      expect(response.status).toBe(404);
      expect(response.body.error).toContain("not found");
    });
  });

  // ──────────────────────────────────────────
  // PATCH /api/payments/:id/status
  // ──────────────────────────────────────────
  describe("PATCH /api/payments/:id/status", () => {
    it("should update payment status successfully", async () => {
      const { default: MockPaymentService } = await import(
        "../../../src/objective3/Service/paymentService.js"
      );
      MockPaymentService.prototype.updateStatus.mockResolvedValue({
        id: 1,
        status: "refunded",
      });

      const response = await request(app)
        .patch("/api/payments/1/status")
        .send({ status: "refunded" });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("refunded");
    });

    it("should return 404 when payment does not exist", async () => {
      const { default: MockPaymentService } = await import(
        "../../../src/objective3/Service/paymentService.js"
      );
      MockPaymentService.prototype.updateStatus.mockResolvedValue(null);

      const response = await request(app)
        .patch("/api/payments/999/status")
        .send({ status: "refunded" });

      expect(response.status).toBe(404);
    });
  });

  // ──────────────────────────────────────────
  // DELETE /api/payments/:id
  // ──────────────────────────────────────────
  describe("DELETE /api/payments/:id", () => {
    it("should delete a payment and return 200", async () => {
      const { default: MockPaymentService } = await import(
        "../../../src/objective3/Service/paymentService.js"
      );
      MockPaymentService.prototype.delete.mockResolvedValue(true);

      const response = await request(app).delete("/api/payments/1");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Payment deleted successfully");
    });

    it("should return 404 when payment does not exist", async () => {
      const { default: MockPaymentService } = await import(
        "../../../src/objective3/Service/paymentService.js"
      );
      MockPaymentService.prototype.delete.mockResolvedValue(false);

      const response = await request(app).delete("/api/payments/999");

      expect(response.status).toBe(404);
      expect(response.body.error).toContain("not found");
    });
  });
});
