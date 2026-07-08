import { describe, it, expect, beforeEach, afterEach } from "vitest";
import express from "express";
import request from "supertest";

import db from "../../../database/db.js";
import patientRoutes from "../../../src/objective1/routes/patient.routes.js";
import * as PatientModel from "../../../src/objective1/models/patient.model.js";

describe("patient.routes (integration, no mocks)", () => {
  let app;
  let createdPatientIds;

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
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL is not set. Tests require a real Postgres database.",
      );
    }

    createdPatientIds = [];

    app = express();
    app.use(express.json());
    app.use("/api/patients", patientRoutes);
  });

  afterEach(async () => {
    if (createdPatientIds.length) {
      await Promise.all(
        createdPatientIds.map((id) =>
          db.query("DELETE FROM patients WHERE id = $1", [id]),
        ),
      );
    }
  });

  it("GET / returns patients", async () => {
    const created = await PatientModel.createPatient(buildPatient());
    createdPatientIds.push(created.id);

    const res = await request(app).get("/api/patients");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const found = res.body.data.find((p) => p.id === created.id);
    expect(found).toBeTruthy();
    expect(found.first_name).toBe(created.first_name);
  });

  it("GET /:id returns a patient (found)", async () => {
    const created = await PatientModel.createPatient(buildPatient());
    createdPatientIds.push(created.id);

    const res = await request(app).get(`/api/patients/${created.id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(created.id);
    expect(res.body.data.first_name).toBe(created.first_name);
  });

  it("GET /:id returns 404 when patient not found", async () => {
    const res = await request(app).get("/api/patients/999999");

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Patient not found");
  });

  it("POST / creates a patient", async () => {
    const payload = buildPatient({ first_name: "Jane" });

    const res = await request(app).post("/api/patients").send(payload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeTruthy();
    expect(res.body.data.first_name).toBe("Jane");

    createdPatientIds.push(res.body.data.id);
  });
});

