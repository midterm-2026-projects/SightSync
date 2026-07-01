// frontend/src/test/Payment.test.js
// Integration tests for the Payments + Receipt API.
// Uses an in-memory SQLite DB so the real sightsync.db is never touched.

import { describe, test, expect, vi } from "vitest";
const request = require("supertest");

// ── ✅ Fix: Replaced jest.mock with Vitest's vi.mock ─────────────────────────
vi.mock("../../server/db.cjs", () => {
  const testDb = require("./testDb");
  return {
    default: testDb,
    ...testDb,
  };
});

const app = require("../../server/server.cjs");

// ─── Shared test payload ──────────────────────────────────────────────────────
const VALID_PAYMENT = {
  patient_name: "Maria Santos",
  doctor_name:  "Dr. Sarah Jenkins, OD",
  od_rx:        "Sph -2.50 / Cyl -0.50 x 180",
  os_rx:        "Sph -2.25 / DS",
  amount:       265.00,
  method:       "cash",
  notes:        "Follow-up in 6 months",
  items: [
    { name: "Anti-Reflective Lenses (1.61)", quantity: 1, price: 120.00 },
    { name: "Designer Frame - Matte Black",  quantity: 1, price: 145.00 },
  ],
};

// ─── Helper ───────────────────────────────────────────────────────────────────
async function createAndConfirm(overrides = {}) {
  const createRes = await request(app)
    .post("/api/payments")
    .send({ ...VALID_PAYMENT, ...overrides });

  const paymentId = createRes.body.data.id;

  const confirmRes = await request(app)
    .patch(`/api/payments/${paymentId}/confirm`);

  return { createRes, confirmRes, paymentId };
}

// ═════════════════════════════════════════════════════════════════════════════
// SUITE 1 — POST /api/payments   (create payment record)
// ═════════════════════════════════════════════════════════════════════════════
describe("POST /api/payments — create payment record", () => {
  test("201: creates a pending payment with all fields", async () => {
    const res = await request(app)
      .post("/api/payments")
      .send(VALID_PAYMENT);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);

    const p = res.body.data;
    expect(p.id).toBeDefined();
    expect(p.patient_name).toBe(VALID_PAYMENT.patient_name);
    expect(p.doctor_name).toBe(VALID_PAYMENT.doctor_name);
    expect(p.amount).toBe(VALID_PAYMENT.amount);
    expect(p.method).toBe(VALID_PAYMENT.method);
    expect(p.status).toBe("pending");
  });

  test("201: created payment has NO receipt yet (pending state)", async () => {
    const createRes = await request(app)
      .post("/api/payments")
      .send(VALID_PAYMENT);

    const id = createRes.body.data.id;

    const getRes = await request(app).get(`/api/payments/${id}`);
    expect(getRes.body.data.receipt).toBeNull();
  });

  test("400: rejects missing patient_name", async () => {
    const rest = { ...VALID_PAYMENT };
    delete rest.patient_name;
    const res = await request(app).post("/api/payments").send(rest);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test("400: rejects missing doctor_name", async () => {
    const rest = { ...VALID_PAYMENT };
    delete rest.doctor_name;
    const res = await request(app).post("/api/payments").send(rest);
    expect(res.status).toBe(400);
  });

  test("400: rejects zero amount", async () => {
    const res = await request(app)
      .post("/api/payments")
      .send({ ...VALID_PAYMENT, amount: 0 });
    expect(res.status).toBe(400);
  });

  test("400: rejects negative amount", async () => {
    const res = await request(app)
      .post("/api/payments")
      .send({ ...VALID_PAYMENT, amount: -50 });
    expect(res.status).toBe(400);
  });

  test("400: rejects invalid payment method", async () => {
    const res = await request(app)
      .post("/api/payments")
      .send({ ...VALID_PAYMENT, method: "bitcoin" });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// SUITE 2 — PATCH /api/payments/:id/confirm  (AC-1 + AC-2)
// ═════════════════════════════════════════════════════════════════════════════
describe("PATCH /api/payments/:id/confirm — AC-1 & AC-2", () => {
  test("AC-1 | receipt.payment_id matches the confirmed payment id", async () => {
    const { confirmRes, paymentId } = await createAndConfirm();

    expect(confirmRes.status).toBe(200);
    expect(confirmRes.body.data.receipt.payment_id).toBe(paymentId);
  });

  test("AC-1 | confirmed payment has status 'confirmed'", async () => {
    const { confirmRes } = await createAndConfirm();
    expect(confirmRes.body.data.payment.status).toBe("confirmed");
  });

  test("AC-1 | GET /api/payments/:id returns receipt linked to payment after confirm", async () => {
    const { paymentId } = await createAndConfirm();

    const getRes = await request(app).get(`/api/payments/${paymentId}`);
    expect(getRes.status).toBe(200);

    const { payment, receipt } = getRes.body.data;
    expect(receipt).not.toBeNull();
    expect(receipt.payment_id).toBe(payment.id);
  });

  test("AC-1 | GET /api/payments/:id/receipt returns the linked receipt", async () => {
    const { paymentId } = await createAndConfirm();

    const res = await request(app).get(`/api/payments/${paymentId}/receipt`);
    expect(res.status).toBe(200);
    expect(res.body.data.payment_id).toBe(paymentId);
  });

  test("AC-1 | GET /api/payments list shows receipt_number for confirmed payment", async () => {
    const { paymentId } = await createAndConfirm();

    const listRes = await request(app).get("/api/payments");
    const match = listRes.body.data.find((p) => p.id === paymentId);

    expect(match).toBeDefined();
    expect(match.receipt_number).toBeDefined();
    expect(match.receipt_number).toMatch(/^RCP-/);
  });

  test("AC-2 | receipt is present in confirm response immediately", async () => {
    const { confirmRes } = await createAndConfirm();
    expect(confirmRes.body.data.receipt).toBeDefined();
    expect(confirmRes.body.data.receipt).not.toBeNull();
  });

  test("AC-2 | receipt has a valid receipt_number (RCP-YYYYMMDD-XXXXX format)", async () => {
    const { confirmRes } = await createAndConfirm();
    expect(confirmRes.body.data.receipt.receipt_number).toMatch(
      /^RCP-\d{8}-[A-Z0-9]{5}$/
    );
  });

  test("AC-2 | receipt has non-empty items array", async () => {
    const { confirmRes } = await createAndConfirm();
    const items = confirmRes.body.data.receipt.items;
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThan(0);
  });

  test("AC-2 | receipt items contain name, quantity, price", async () => {
    const { confirmRes } = await createAndConfirm();
    const item = confirmRes.body.data.receipt.items[0];
    expect(item).toHaveProperty("name");
    expect(item).toHaveProperty("quantity");
    expect(item).toHaveProperty("price");
  });

  test("AC-2 | receipt subtotal equals sum of item prices × quantities", async () => {
    const { confirmRes } = await createAndConfirm();
    const { items, subtotal } = confirmRes.body.data.receipt;
    const expected = items.reduce((s, i) => s + i.price * i.quantity, 0);
    expect(subtotal).toBeCloseTo(expected, 2);
  });

  test("AC-2 | receipt tax is 12% of subtotal", async () => {
    const { confirmRes } = await createAndConfirm();
    const { subtotal, tax } = confirmRes.body.data.receipt;
    expect(tax).toBeCloseTo(subtotal * 0.12, 2);
  });

  test("AC-2 | receipt total equals subtotal + tax", async () => {
    const { confirmRes } = await createAndConfirm();
    const { subtotal, tax, total } = confirmRes.body.data.receipt;
    expect(total).toBeCloseTo(subtotal + tax, 2);
  });

  test("AC-2 | receipt has a generated_at timestamp", async () => {
    const { confirmRes } = await createAndConfirm();
    const ts = confirmRes.body.data.receipt.generated_at;
    expect(ts).toBeDefined();
    expect(new Date(ts).toString()).not.toBe("Invalid Date");
  });

  test("AC-2 | GET /api/payments/:id/receipt has no missing fields", async () => {
    const { paymentId } = await createAndConfirm();

    const res = await request(app).get(`/api/payments/${paymentId}/receipt`);
    const r = res.body.data;

    expect(r.id).toBeDefined();
    expect(r.payment_id).toBeDefined();
    expect(r.receipt_number).toBeDefined();
    expect(r.items).toBeDefined();
    expect(r.subtotal).toBeDefined();
    expect(r.tax).toBeDefined();
    expect(r.total).toBeDefined();
    expect(r.generated_at).toBeDefined();
    expect(r.payment).toBeDefined();
    expect(r.payment.patient_name).toBeDefined();
  });

  test("409: confirming an already-confirmed payment returns conflict", async () => {
    const { paymentId } = await createAndConfirm();

    const again = await request(app).patch(`/api/payments/${paymentId}/confirm`);
    expect(again.status).toBe(409);
  });

  test("404: confirming a non-existent payment returns not found", async () => {
    const res = await request(app).patch("/api/payments/ghost-id-999/confirm");
    expect(res.status).toBe(404);
  });

  test("400: cannot confirm a failed payment", async () => {
    const createRes = await request(app)
      .post("/api/payments")
      .send(VALID_PAYMENT);
    const id = createRes.body.data.id;

    await request(app).patch(`/api/payments/${id}/fail`);

    const res = await request(app).patch(`/api/payments/${id}/confirm`);
    expect(res.status).toBe(400);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// SUITE 3 — PATCH /api/payments/:id/fail
// ═════════════════════════════════════════════════════════════════════════════
describe("PATCH /api/payments/:id/fail — no receipt on failure", () => {
  test("200: marks pending payment as failed", async () => {
    const createRes = await request(app)
      .post("/api/payments")
      .send(VALID_PAYMENT);
    const id = createRes.body.data.id;

    const res = await request(app).patch(`/api/payments/${id}/fail`);
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("failed");
  });

  test("failed payment has NO receipt generated", async () => {
    const createRes = await request(app)
      .post("/api/payments")
      .send(VALID_PAYMENT);
    const id = createRes.body.data.id;

    await request(app).patch(`/api/payments/${id}/fail`);

    const receiptRes = await request(app).get(`/api/payments/${id}/receipt`);
    expect(receiptRes.status).toBe(404);
  });

  test("400: cannot fail a confirmed payment", async () => {
    const { paymentId } = await createAndConfirm();
    const res = await request(app).patch(`/api/payments/${paymentId}/fail`);
    expect(res.status).toBe(400);
  });

  test("404: failing non-existent payment returns not found", async () => {
    const res = await request(app).patch("/api/payments/ghost-id/fail");
    expect(res.status).toBe(404);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// SUITE 4 — GET /api/payments  (list)
// ═════════════════════════════════════════════════════════════════════════════
describe("GET /api/payments — list all payments", () => {
  test("200: returns an array", async () => {
    const res = await request(app).get("/api/payments");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("confirmed payment appears in list with receipt_number", async () => {
    const { paymentId } = await createAndConfirm();
    const res = await request(app).get("/api/payments");
    const match = res.body.data.find((p) => p.id === paymentId);
    expect(match.receipt_number).toMatch(/^RCP-/);
    expect(match.status).toBe("confirmed");
  });

  test("pending payment appears in list with null receipt_number", async () => {
    const createRes = await request(app)
      .post("/api/payments")
      .send(VALID_PAYMENT);
    const id = createRes.body.data.id;

    const listRes = await request(app).get("/api/payments");
    const match = listRes.body.data.find((p) => p.id === id);
    expect(match.receipt_number).toBeNull();
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// SUITE 5 — receiptGenerator unit tests
// ═════════════════════════════════════════════════════════════════════════════
describe("receiptGenerator — unit tests", () => {
  const { generateReceipt } = require("../../server/receiptGenerator.cjs");

  const mockPayment = {
    id: "pay-unit-001",
    patient_name: "Unit Tester",
    doctor_name: "Dr. Test",
    amount: 200,
    items: JSON.stringify([
      { name: "Test Lens", quantity: 2, price: 100 },
    ]),
  };

  test("returns object with required fields", () => {
    const r = generateReceipt(mockPayment);
    expect(r).toHaveProperty("id");
    expect(r).toHaveProperty("payment_id", mockPayment.id);
    expect(r).toHaveProperty("receipt_number");
    expect(r).toHaveProperty("items");
    expect(r).toHaveProperty("subtotal");
    expect(r).toHaveProperty("tax");
    expect(r).toHaveProperty("total");
    expect(r).toHaveProperty("generated_at");
  });

  test("subtotal is correct", () => {
    const r = generateReceipt(mockPayment);
    expect(r.subtotal).toBe(200);
  });

  test("tax is 12% of subtotal", () => {
    const r = generateReceipt(mockPayment);
    expect(r.tax).toBeCloseTo(24, 2);
  });

  test("total is subtotal + tax", () => {
    const r = generateReceipt(mockPayment);
    expect(r.total).toBeCloseTo(224, 2);
  });

  test("receipt_number matches RCP-YYYYMMDD-XXXXX pattern", () => {
    const r = generateReceipt(mockPayment);
    expect(r.receipt_number).toMatch(/^RCP-\d{8}-[A-Z0-9]{5}$/);
  });

  test("each call generates a unique receipt id", () => {
    const r1 = generateReceipt(mockPayment);
    const r2 = generateReceipt(mockPayment);
    expect(r1.id).not.toBe(r2.id);
  });

  test("each call generates a unique receipt_number", () => {
    const r1 = generateReceipt(mockPayment);
    const r2 = generateReceipt(mockPayment);
    expect(r1.receipt_number).not.toBe(r2.receipt_number);
  });

  test("falls back to single item when no items provided", () => {
    const noItems = { ...mockPayment };
    delete noItems.items;
    const r = generateReceipt({ ...noItems, amount: 300 });
    const parsed = JSON.parse(r.items);
    expect(parsed.length).toBe(1);
    expect(parsed[0].price).toBe(300);
  });
});
