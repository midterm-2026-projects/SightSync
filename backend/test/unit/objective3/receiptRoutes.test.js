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

// Mock PaymentModel — controller creates: const paymentModel = new PaymentModel(pool);
// WARNING: vi.mock factory is hoisted to the top — no outer variable references allowed.
vi.mock("../../../src/objective3/Models/payment.js", () => {
  const cls = class MockPaymentModel {
    constructor() {}
  };
  cls.prototype.create = vi.fn();
  cls.prototype.findById = vi.fn();
  cls.prototype.findAll = vi.fn();
  cls.prototype.updateStatus = vi.fn();
  cls.prototype.delete = vi.fn();
  return { default: cls };

});

// Mock ReceiptModel — controller creates: const receiptModel = new ReceiptModel(pool);
// WARNING: vi.mock factory is hoisted to the top — no outer variable references allowed.
vi.mock("../../../src/objective3/Models/receipt.js", () => {
  const cls = class MockReceiptModel {
    constructor() {}
  };
  cls.prototype.create = vi.fn();
  cls.prototype.findById = vi.fn();
  cls.prototype.findByPaymentId = vi.fn();
  cls.prototype.findByReceiptNumber = vi.fn();
  cls.prototype.findAll = vi.fn();
  cls.prototype.update = vi.fn();
  cls.prototype.delete = vi.fn();
  return { default: cls };
});

// Mock receipt service utilities
vi.mock("../../../src/objective3/Service/receiptService.js", () => ({
  issueReceipt: vi.fn(),
  generateReceipt: vi.fn(),
  conformsToTemplate: vi.fn(),
  buildReceiptNumber: vi.fn(),
  formatCurrency: vi.fn(),
  TEMPLATE_VERSION: "v1",
  BUSINESS_INFO: {},
  RECEIPT_SCHEMA_KEYS: [],
  PAYMENT_SECTION_KEYS: [],
}));

/**
 * Helper: returns a fake receipt object matching the expected shape.
 */
function buildFakeReceipt(overrides = {}) {
  return {
    receiptNumber: "RCPT-2026-000001",
    templateVersion: "v1",
    issuedDate: new Date().toISOString(),
    business: { name: "Acme Billing Co.", address: "123 Market Street, Springfield", taxId: "TAX-000000" },
    payment: {
      id: 1,
      amount: 100,
      formattedAmount: "$100.00",
      currency: "USD",
      paymentDate: "2026-07-20",
      method: "cash",
      status: "completed",
    },
    footer: "Thank you for your payment.",
    ...overrides,
  };
}

describe("Receipt Routes (Objective 3)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ──────────────────────────────────────────
  // POST /api/receipts
  // ──────────────────────────────────────────
  describe("POST /api/receipts", () => {
    it("should create a receipt and return 201", async () => {
      const { issueReceipt } = await import(
        "../../../src/objective3/Service/receiptService.js"
      );
      const fakeReceipt = buildFakeReceipt();
      issueReceipt.mockReturnValue(fakeReceipt);

      const response = await request(app)
        .post("/api/receipts")
        .send({ payment_id: 1 });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(fakeReceipt);
      expect(issueReceipt).toHaveBeenCalledWith(
        expect.any(Object),
        1
      );
    });

    it("should return 400 when payment_id is missing", async () => {
      const response = await request(app)
        .post("/api/receipts")
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("payment_id is required");
    });

    it("should return 500 when issueReceipt throws", async () => {
      const { issueReceipt } = await import(
        "../../../src/objective3/Service/receiptService.js"
      );
      issueReceipt.mockImplementation(() => {
        throw new Error("Payment 999 not found.");
      });

      const response = await request(app)
        .post("/api/receipts")
        .send({ payment_id: 999 });

      expect(response.status).toBe(500);
    });
  });

  // ──────────────────────────────────────────
  // GET /api/receipts
  // ──────────────────────────────────────────
  describe("GET /api/receipts", () => {
    it("should return all receipts", async () => {
      const { default: MockReceiptModel } = await import(
        "../../../src/objective3/Models/receipt.js"
      );
      const { generateReceipt } = await import(
        "../../../src/objective3/Service/receiptService.js"
      );

      // Mock findAll to return raw receipt rows
      MockReceiptModel.prototype.findAll.mockResolvedValue([
        {
          id: 1,
          payment_id: 1,
          receipt_number: "RCPT-2026-000001",
          template_version: "v1",
          issued_date: "2026-07-20T10:00:00.000Z",
        },
        {
          id: 2,
          payment_id: 2,
          receipt_number: "RCPT-2026-000002",
          template_version: "v1",
          issued_date: "2026-07-21T10:00:00.000Z",
        },
      ]);

      // Mock PaymentModel.findById for the enrichment
      const { default: MockPaymentModel } = await import(
        "../../../src/objective3/Models/payment.js"
      );
      MockPaymentModel.prototype.findById
        .mockResolvedValueOnce({
          id: 1,
          amount: 100,
          payment_date: "2026-07-20",
          method: "cash",
          status: "completed",
        })
        .mockResolvedValueOnce({
          id: 2,
          amount: 200,
          payment_date: "2026-07-21",
          method: "online",
          status: "completed",
        });

      generateReceipt
        .mockReturnValueOnce(buildFakeReceipt())
        .mockReturnValueOnce(
          buildFakeReceipt({
            receiptNumber: "RCPT-2026-000002",
            payment: { id: 2, amount: 200, formattedAmount: "$200.00", currency: "USD", paymentDate: "2026-07-21", method: "online", status: "completed" },
          })
        );

      const response = await request(app).get("/api/receipts");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });

    it("should return empty array when no receipts exist", async () => {
      const { default: MockReceiptModel } = await import(
        "../../../src/objective3/Models/receipt.js"
      );
      MockReceiptModel.prototype.findAll.mockResolvedValue([]);

      const response = await request(app).get("/api/receipts");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  // ──────────────────────────────────────────
  // GET /api/receipts/:id
  // ──────────────────────────────────────────
  describe("GET /api/receipts/:id", () => {
    it("should return a receipt by id", async () => {
      const { default: MockReceiptModel } = await import(
        "../../../src/objective3/Models/receipt.js"
      );
      const { default: MockPaymentModel } = await import(
        "../../../src/objective3/Models/payment.js"
      );
      const { generateReceipt } = await import(
        "../../../src/objective3/Service/receiptService.js"
      );

      MockReceiptModel.prototype.findById.mockResolvedValue({
        id: 1,
        payment_id: 1,
        receipt_number: "RCPT-2026-000001",
        template_version: "v1",
        issued_date: "2026-07-20T10:00:00.000Z",
      });

      MockPaymentModel.prototype.findById.mockResolvedValue({
        id: 1,
        amount: 100,
        payment_date: "2026-07-20",
        method: "cash",
        status: "completed",
      });

      generateReceipt.mockReturnValue(buildFakeReceipt());

      const response = await request(app).get("/api/receipts/1");

      expect(response.status).toBe(200);
      expect(response.body.receiptNumber).toBe("RCPT-2026-000001");
    });

    it("should return 404 when receipt is not found", async () => {
      const { default: MockReceiptModel } = await import(
        "../../../src/objective3/Models/receipt.js"
      );
      MockReceiptModel.prototype.findById.mockResolvedValue(null);

      const response = await request(app).get("/api/receipts/999");

      expect(response.status).toBe(404);
      expect(response.body.error).toContain("not found");
    });
  });

  // ──────────────────────────────────────────
  // GET /api/receipts/payment/:paymentId
  // ──────────────────────────────────────────
  describe("GET /api/receipts/payment/:paymentId", () => {
    it("should return a receipt by payment id", async () => {
      const { default: MockReceiptModel } = await import(
        "../../../src/objective3/Models/receipt.js"
      );
      const { default: MockPaymentModel } = await import(
        "../../../src/objective3/Models/payment.js"
      );
      const { generateReceipt } = await import(
        "../../../src/objective3/Service/receiptService.js"
      );

      MockReceiptModel.prototype.findByPaymentId.mockResolvedValue({
        id: 1,
        payment_id: 1,
        receipt_number: "RCPT-2026-000001",
        template_version: "v1",
        issued_date: "2026-07-20T10:00:00.000Z",
      });

      MockPaymentModel.prototype.findById.mockResolvedValue({
        id: 1,
        amount: 100,
        payment_date: "2026-07-20",
        method: "cash",
        status: "completed",
      });

      generateReceipt.mockReturnValue(buildFakeReceipt());

      const response = await request(app).get("/api/receipts/payment/1");

      expect(response.status).toBe(200);
      expect(response.body.receiptNumber).toBe("RCPT-2026-000001");
    });

    it("should return 404 when receipt for payment is not found", async () => {
      const { default: MockReceiptModel } = await import(
        "../../../src/objective3/Models/receipt.js"
      );
      MockReceiptModel.prototype.findByPaymentId.mockResolvedValue(null);

      const response = await request(app).get("/api/receipts/payment/999");

      expect(response.status).toBe(404);
      expect(response.body.error).toContain("not found");
    });
  });

  // ──────────────────────────────────────────
  // DELETE /api/receipts/:id
  // ──────────────────────────────────────────
  describe("DELETE /api/receipts/:id", () => {
    it("should delete a receipt and return 200", async () => {
      const { default: MockReceiptModel } = await import(
        "../../../src/objective3/Models/receipt.js"
      );
      MockReceiptModel.prototype.delete.mockResolvedValue(true);

      const response = await request(app).delete("/api/receipts/1");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Receipt deleted successfully");
    });

    it("should return 404 when receipt does not exist", async () => {
      const { default: MockReceiptModel } = await import(
        "../../../src/objective3/Models/receipt.js"
      );
      MockReceiptModel.prototype.delete.mockResolvedValue(false);

      const response = await request(app).delete("/api/receipts/999");

      expect(response.status).toBe(404);
      expect(response.body.error).toContain("not found");
    });
  });
});
