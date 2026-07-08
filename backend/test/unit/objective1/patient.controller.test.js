import { describe, it, expect, beforeEach, afterEach } from "vitest";

import db from "../../../database/db.js";
import * as PatientModel from "../../../src/objective1/models/patient.model.js";
import {
  getPatients,
  getPatient,
  createPatient,
} from "../../../src/objective1/controllers/patient.controller.js";

describe("Patient Controller (integration, no mocks)", () => {
  let res;
  let req;
  let createdPatientIds;

  beforeEach(() => {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL is not set. Tests require a real Postgres database.",
      );
    }

    createdPatientIds = [];

    res = {
      status: (code) => {
        res.statusCode = code;
        return res;
      },
      json: (payload) => {
        res.payload = payload;
        return res;
      },
      statusCode: null,
      payload: null,
    };

    req = {
      params: {},
      body: {},
    };
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

  describe("getPatients", () => {
    it("returns patients with success: true", async () => {
      const created = await PatientModel.createPatient(buildPatient());
      createdPatientIds.push(created.id);

      await getPatients(req, res);

      expect(res.statusCode).toBeNull(); // controller uses res.json only
      expect(res.payload.success).toBe(true);
      expect(res.payload.data.length).toBeGreaterThan(0);
      const found = res.payload.data.find((p) => p.id === created.id);
      expect(found).toBeTruthy();
      expect(found.first_name).toBe(created.first_name);
    });
  });

  describe("getPatient", () => {
    it("returns 404 when patient is not found", async () => {
      req.params.id = "999999";

      await getPatient(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.payload).toEqual({
        success: false,
        message: "Patient not found",
      });
    });

    it("returns patient when found", async () => {
      const created = await PatientModel.createPatient(buildPatient());
      createdPatientIds.push(created.id);

      req.params.id = String(created.id);

      await getPatient(req, res);

      expect(res.statusCode).toBeNull();
      expect(res.payload.success).toBe(true);
      expect(res.payload.data.id).toBe(created.id);
      expect(res.payload.data.first_name).toBe(created.first_name);
    });
  });

  describe("createPatient", () => {
    it("creates patient with 201", async () => {
      req.body = buildPatient({ first_name: "Jane" });

      await createPatient(req, res);

      expect(res.statusCode).toBe(201);
      expect(res.payload.success).toBe(true);
      expect(res.payload.data).toBeTruthy();
      expect(res.payload.data.first_name).toBe("Jane");

      createdPatientIds.push(res.payload.data.id);
    });

    it("returns 500 on invalid patient payload (service rules not enforced in controller)", async () => {
      req.body = {
        first_name: "Bad",
        // missing required fields like last_name, birth_date, age, sex, etc.
      };

      await createPatient(req, res);

      expect(res.statusCode).toBe(500);
      expect(res.payload.success).toBe(false);
      expect(typeof res.payload.message).toBe("string");
    });
  });
});

