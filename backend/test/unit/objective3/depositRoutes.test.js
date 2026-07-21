import request from "supertest";
import { describe, it, expect, vi, beforeEach } from "vitest";
import app from "../../../app.js";

// ==========================================
// 1. MOCKS
// ==========================================
import * as depositService from "../../../src/objective3/Service/depositService.js";
vi.mock("../../../src/objective3/Service/depositService.js");

// Mock db so module-level pool creation doesn't fail
vi.mock("../../../database/db.js", () => ({
  default: { query: vi.fn().mockResolvedValue({ rows: [], rowCount: 0 }) },
}));

vi.mock("../../../src/objective3/middleware/vallidation.js", () => ({
  validateDepositForm: vi.fn(),
  validatePaymentForm: vi.fn(),
  makeFormValidationMiddleware: vi.fn((validatorFn) => (req, res, next) => {
    const result = validatorFn(req.body);
    if (!result.valid) {
      return res.status(400).json({ success: false, errors: result.errors });
    }
    next();
  }),
  isValidDate: vi.fn(),
}));

import { validateDepositForm } from "../../../src/objective3/middleware/vallidation.js";

describe("Deposit Routes (Objective 3)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    validateDepositForm.mockReturnValue({ valid: true, errors: [] });
  });

  // ──────────────────────────────────────────
  // POST /api/deposits
  // ──────────────────────────────────────────
  describe("POST /api/deposits", () => {
    it("should create a deposit and return 201", async () => {
      const mockDeposit = {
        id: 1,
        amount: 500.0,
        deposit_date: "2026-07-20",
        status: "held",
      };
      depositService.createDeposit.mockResolvedValue(mockDeposit);

      const response = await request(app)
        .post("/api/deposits")
        .send({ amount: 500.0, deposit_date: "2026-07-20" });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockDeposit);
      expect(depositService.createDeposit).toHaveBeenCalledWith({
        amount: 500.0,
        deposit_date: "2026-07-20",
      });
    });

    it("should return 400 when validation fails", async () => {
      validateDepositForm.mockReturnValue({
        valid: false,
        errors: ["amount is required."],
      });

      const response = await request(app)
        .post("/api/deposits")
        .send({ deposit_date: "2026-07-20" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        errors: ["amount is required."],
      });
      expect(depositService.createDeposit).not.toHaveBeenCalled();
    });

    it("should return 500 when service throws an error", async () => {
      depositService.createDeposit.mockRejectedValue(
        new Error("Database connection failed")
      );

      const response = await request(app)
        .post("/api/deposits")
        .send({ amount: 100, deposit_date: "2026-07-20" });

      expect(response.status).toBe(500);
    });
  });

  // ──────────────────────────────────────────
  // GET /api/deposits
  // ──────────────────────────────────────────
  describe("GET /api/deposits", () => {
    it("should return all deposits", async () => {
      const mockList = [
        { id: 1, amount: 100, deposit_date: "2026-07-20", status: "held" },
        { id: 2, amount: 200, deposit_date: "2026-07-21", status: "cleared" },
      ];
      depositService.getAllDeposits.mockResolvedValue(mockList);

      const response = await request(app).get("/api/deposits");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockList);
    });

    it("should return 500 when service fails", async () => {
      depositService.getAllDeposits.mockRejectedValue(
        new Error("Database error")
      );

      const response = await request(app).get("/api/deposits");

      expect(response.status).toBe(500);
    });
  });

  // ──────────────────────────────────────────
  // GET /api/deposits/:id
  // ──────────────────────────────────────────
  describe("GET /api/deposits/:id", () => {
    it("should return a deposit by id", async () => {
      const mockDeposit = {
        id: 1,
        amount: 500,
        deposit_date: "2026-07-20",
        status: "held",
      };
      depositService.getDepositById.mockResolvedValue(mockDeposit);

      const response = await request(app).get("/api/deposits/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockDeposit);
    });

    it("should return 404 when deposit is not found", async () => {
      depositService.getDepositById.mockResolvedValue(null);

      const response = await request(app).get("/api/deposits/999");

      expect(response.status).toBe(404);
      expect(response.body.error).toContain("not found");
    });
  });

  // ──────────────────────────────────────────
  // PATCH /api/deposits/:id/status
  // ──────────────────────────────────────────
  describe("PATCH /api/deposits/:id/status", () => {
    it("should update deposit status successfully", async () => {
      const updated = { id: 1, amount: 500, status: "cleared" };
      depositService.updateDepositStatus.mockResolvedValue(updated);

      const response = await request(app)
        .patch("/api/deposits/1/status")
        .send({ status: "cleared" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updated);
      expect(depositService.updateDepositStatus).toHaveBeenCalledWith(
        "1",
        "cleared"
      );
    });

    it("should return 500 when service throws", async () => {
      depositService.updateDepositStatus.mockRejectedValue(
        new Error("Update failed")
      );

      const response = await request(app)
        .patch("/api/deposits/1/status")
        .send({ status: "cleared" });

      expect(response.status).toBe(500);
    });
  });

  // ──────────────────────────────────────────
  // DELETE /api/deposits/:id
  // ──────────────────────────────────────────
  describe("DELETE /api/deposits/:id", () => {
    it("should delete a deposit and return 200", async () => {
      depositService.deleteDeposit.mockResolvedValue(true);

      const response = await request(app).delete("/api/deposits/1");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Deposit deleted successfully");
    });

    it("should return 404 when deposit does not exist", async () => {
      depositService.deleteDeposit.mockResolvedValue(false);

      const response = await request(app).delete("/api/deposits/999");

      expect(response.status).toBe(404);
      expect(response.body.error).toContain("not found");
    });

    it("should return 500 when service throws", async () => {
      depositService.deleteDeposit.mockRejectedValue(
        new Error("Delete failed")
      );

      const response = await request(app).delete("/api/deposits/1");

      expect(response.status).toBe(500);
    });
  });
});

