import { describe, it, expect, beforeEach, afterEach } from "vitest";

import db from "../../../../database/db.js";
import {
  getAllPatients,
  getPatientById,
  createPatient,
} from "../../../../src/objective1/services/patient.service.js";

describe("Patient Service (integration, no mocks)", () => {
  let createdPatientIds;

  beforeEach(() => {
    createdPatientIds = [];

    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL is not set. Tests require a real Postgres database.",
      );
    }
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

  const validPatient = {
    first_name: "Maria",
    last_name: "Santos",
    middle_name: "Reyes",
    birth_date: "1995-03-10",
    age: 31,
    sex: "Female",
    contact_number: "09123456789",
    email: `maria.santos.${Date.now()}@example.com`,
    address: "Quezon City",
    emergency_contact: "Juan Santos",
    medical_history: "Asthma",
    status: "Pending",
  };

  describe("getAllPatients()", () => {
    it("should include created patient in results", async () => {
      const created = await createPatient({ ...validPatient });
      createdPatientIds.push(created.id);

      const rows = await getAllPatients();
      const found = rows.find((r) => r.id === created.id);

      expect(found).toBeTruthy();
      expect(found.first_name).toBe(validPatient.first_name);
    });
  });

  describe("getPatientById()", () => {
    it("should return patient when id is valid", async () => {
      const created = await createPatient({
        ...validPatient,
        email: `john.santos.${Date.now()}@example.com`,
      });
      createdPatientIds.push(created.id);

      const result = await getPatientById(created.id);
      expect(result).toBeTruthy();
      expect(result.id).toBe(created.id);
      expect(result.first_name).toBe(created.first_name);
    });

    it("should throw if patient id is invalid", async () => {
      await expect(getPatientById(0)).rejects.toThrow("Invalid patient ID.");
    });

    it("should throw if patient does not exist", async () => {
      await expect(getPatientById(999999)).rejects.toThrow("Patient not found.");
    });
  });

  describe("createPatient()", () => {
    it("should create patient successfully", async () => {
      const created = await createPatient({ ...validPatient });
      createdPatientIds.push(created.id);

      expect(created).toBeTruthy();
      expect(created.id).toBeDefined();
      expect(created.first_name).toBe(validPatient.first_name);
    });

    it("should assign default status when missing", async () => {
      const { status: _ignored, ...patientWithoutStatus } = validPatient;

      const created = await createPatient({ ...patientWithoutStatus });
      createdPatientIds.push(created.id);

      expect(created.status).toBe("Pending");
    });

    it("should reject negative age", async () => {
      await expect(
        createPatient({ ...validPatient, age: -1 }),
      ).rejects.toThrow("Age cannot be negative.");
    });

    it("should reject age greater than 120", async () => {
      await expect(
        createPatient({ ...validPatient, age: 121 }),
      ).rejects.toThrow("Age exceeds the maximum allowed.");
    });

    it("should reject invalid status", async () => {
      await expect(
        createPatient({ ...validPatient, status: "Archived" }),
      ).rejects.toThrow("Invalid patient status.");
    });

    it("should reject invalid contact number", async () => {
      await expect(
        createPatient({ ...validPatient, contact_number: "123456789" }),
      ).rejects.toThrow("Invalid contact number.");
    });

    it("should reject invalid email", async () => {
      await expect(
        createPatient({ ...validPatient, email: "maria.com" }),
      ).rejects.toThrow("Invalid email address.");
    });

    it("should reject future birth date", async () => {
      await expect(
        createPatient({ ...validPatient, birth_date: "2099-01-01" }),
      ).rejects.toThrow("Birth date cannot be in the future.");
    });
  });
});

