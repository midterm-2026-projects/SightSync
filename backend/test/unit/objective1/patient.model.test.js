import { describe, it, expect, beforeEach, afterEach } from "vitest";

import db from "../../../database/db.js";

import {
  getAllPatients,
  getPatientById,
  createPatient,
} from "../../../src/objective1/models/patient.model.js";

describe("Patient Model (integration)", () => {
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


  describe("getAllPatients()", () => {
    it("should include created patient in results", async () => {
      const patient = {
        first_name: "John",
        last_name: "Doe",
        middle_name: "D",
        birth_date: "1995-03-10",
        age: 31,
        sex: "Male",
        contact_number: "09123456789",
        email: `john.doe.${Date.now()}@example.com`,
        address: "Quezon City",
        emergency_contact: "Jane Doe",
        medical_history: "Asthma",
        status: "Pending",
      };

      const created = await createPatient(patient);
      createdPatientIds.push(created.id);


      const rows = await getAllPatients();
      console.log(rows)
      // Some environments may have existing rows; just ensure our row is present.
      const found = rows.find((r) => r.id === createdPatientIds[0]);
      expect(found).toBeTruthy();
      expect(found.first_name).toBe(patient.first_name);

    });
  });

  describe("getPatientById()", () => {
    it("should return a patient by id", async () => {
      const patient = {
        first_name: "Maria",
        last_name: "Santos",
        middle_name: "R",
        birth_date: "1994-02-20",
        age: 32,
        sex: "Female",
        contact_number: "09987654321",
        email: `maria.santos.${Date.now()}@example.com`,
        address: "Manila",
        emergency_contact: "Rico Santos",
        medical_history: "Asthma",
        status: "Pending",
      };

      const created = await createPatient(patient);
      createdPatientIds.push(created.id);


      const result = await getPatientById(createdPatientIds[0]);
      expect(result).toBeTruthy();
      expect(result.id).toBe(createdPatientIds[0]);

      expect(result.first_name).toBe(patient.first_name);
    });
  });

  describe("createPatient()", () => {
    it("should create a patient", async () => {
      const patient = {
        first_name: "Alex",
        last_name: "Reyes",
        middle_name: "M",
        birth_date: "1993-06-15",
        age: 33,
        sex: "Male",
        contact_number: "09112223344",
        email: `alex.reyes.${Date.now()}@example.com`,
        address: "Cebu",
        emergency_contact: "Maria Reyes",
        medical_history: "None",
        status: "Pending",
      };

      const created = await createPatient(patient);
      createdPatientIds.push(created.id);

      expect(created).toBeTruthy();
      expect(created.id).toBeDefined();
      expect(created.first_name).toBe(patient.first_name);
      expect(created.status).toBe(patient.status);
    });
  });
});

