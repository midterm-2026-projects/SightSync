import { describe, it, expect, beforeEach, vi } from "vitest";
import express from "express";
import request from "supertest";

import patientRoutes from "../../../src/objective1/routes/patient.routes.js";
import * as PatientModel from "../../../src/objective1/models/patient.model.js";

vi.mock("../../../src/objective1/models/patient.model.js", () => ({
  getAllPatients: vi.fn(),
  getPatientById: vi.fn(),
  createPatient: vi.fn(),
}));

describe("patient.routes (unit, with mocks)", () => {
  let app;

  const buildPatient = (overrides = {}) => {
    return {
      first_name: "Jane",
      last_name: "Doe",
      middle_name: "D",
      birth_date: "1995-03-10",
      age: 30,
      sex: "Female",
      contact_number: "09123456789",
      email: `jane.doe.${Date.now()}@example.com`,
      address: "Quezon City",
      emergency_contact: "John Doe",
      medical_history: "Asthma",
      status: "Pending",
      ...overrides,
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();

    app = express();
    app.use(express.json());
    app.use("/api/patients", patientRoutes);
  });

  it("GET / returns patients", async () => {
    const patients = [
      { id: 1, ...buildPatient({ first_name: "Jane" }) },
      { id: 2, ...buildPatient({ first_name: "John" }) },
    ];

    vi.spyOn(PatientModel, "getAllPatients").mockResolvedValue(patients);

    const res = await request(app).get("/api/patients");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);

    const found = res.body.data.find((p) => p.id === 1);
    expect(found).toBeTruthy();
    expect(found.first_name).toBe("Jane");
  });

  it("GET /:id returns a patient (found)", async () => {
    const created = { id: 10, ...buildPatient({ first_name: "Jane" }) };

    vi.spyOn(PatientModel, "getPatientById").mockResolvedValue(created);

    const res = await request(app).get(`/api/patients/${created.id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(created.id);
    expect(res.body.data.first_name).toBe("Jane");
  });

  it("GET /:id returns 404 when patient not found", async () => {
    vi.spyOn(PatientModel, "getPatientById").mockResolvedValue(undefined);

    const res = await request(app).get("/api/patients/999999");

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Patient not found");
  });

  it("POST / creates a patient", async () => {
    const payload = buildPatient({ first_name: "Jane" });
    const created = { id: 123, ...payload };

    vi.spyOn(PatientModel, "createPatient").mockResolvedValue(created);

    const res = await request(app).post("/api/patients").send(payload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeTruthy();
    expect(res.body.data.first_name).toBe("Jane");
    expect(res.body.data.id).toBe(123);
  });
});

