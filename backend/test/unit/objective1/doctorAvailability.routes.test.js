import { describe, it, expect, beforeEach, vi } from "vitest";
import express from "express";
import request from "supertest";

import doctorAvailabilityRoutes from "../../../src/objective1/routes/doctorAvailability.routes.js";
import * as DoctorAvailabilityService from "../../../src/objective1/services/doctorAvailability.service.js";

vi.mock("../../../src/objective1/services/doctorAvailability.service.js", () => ({
  getDoctorAvailability: vi.fn(),
  createDoctorAvailability: vi.fn(),
  updateDoctorAvailability: vi.fn(),
  deleteDoctorAvailability: vi.fn(),
  getOpenProviderAvailability: vi.fn(),
  getProviderMetrics: vi.fn(),
  getCollisions: vi.fn(),
  DoctorAvailabilityCalculator: class {}
}));

describe("doctorAvailability.routes (unit, with mocks)", () => {
  let app;

  beforeEach(() => {
    vi.clearAllMocks();

    app = express();
    app.use(express.json());
    app.use("/api/doc-availability", doctorAvailabilityRoutes);
  });

  it("GET /open returns open availabilities", async () => {
    const openSlots = [{ id: 1, doctor_id: 1, status: "Available" }];
    vi.spyOn(DoctorAvailabilityService, "getOpenProviderAvailability").mockResolvedValue(openSlots);

    const res = await request(app).get("/api/doc-availability/open");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(openSlots);
  });

  it("GET /:doctorId returns availability list", async () => {
    const slots = [{ id: 1, doctor_id: 10, status: "Available" }];
    vi.spyOn(DoctorAvailabilityService, "getDoctorAvailability").mockResolvedValue(slots);

    const res = await request(app).get("/api/doc-availability/10");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(slots);
  });

  it("GET /:doctorId/metrics returns metrics", async () => {
    const metrics = { totalSlots: 5, bookedSlots: 2, availableSlots: 3, utilizationRate: 40 };
    vi.spyOn(DoctorAvailabilityService, "getProviderMetrics").mockResolvedValue(metrics);

    const res = await request(app).get("/api/doc-availability/10/metrics");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(metrics);
  });

  it("GET /:doctorId/collisions returns collisions list", async () => {
    const collisions = [{ id: 1, status: "Booked" }];
    vi.spyOn(DoctorAvailabilityService, "getCollisions").mockResolvedValue(collisions);

    const res = await request(app)
      .get("/api/doc-availability/10/collisions")
      .query({ startTime: "09:00:00", endTime: "10:00:00" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(collisions);
    expect(DoctorAvailabilityService.getCollisions).toHaveBeenCalledWith("10", "09:00:00", "10:00:00");
  });

  it("POST / creates availability record", async () => {
    const record = { id: 100, doctor_id: 10, available_date: "2026-07-20", status: "Available" };
    vi.spyOn(DoctorAvailabilityService, "createDoctorAvailability").mockResolvedValue(record);

    const res = await request(app)
      .post("/api/doc-availability")
      .send({ doctorId: 10, date: "2026-07-20", startTime: "09:00:00", endTime: "10:00:00", status: "Available" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(record);
  });
});
