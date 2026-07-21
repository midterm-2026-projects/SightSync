import { beforeEach, describe, expect, it, vi } from "vitest";
import express from "express";
import request from "supertest";

vi.mock("../../../src/objective1/controllers/summary.controller.js", () => ({
  generateSummaryController: vi.fn((req, res) => {
    res.status(200).json({ ai_summary: "Test summary" });
  }),
}));

import summaryRoutes from "../../../src/objective1/routes/summary.routes.js";
import { generateSummaryController } from "../../../src/objective1/controllers/summary.controller.js";

describe("summary.routes", () => {
  let app;

  beforeEach(() => {
    vi.clearAllMocks();
    app = express();
    app.use(express.json());
    app.use("/api/summary", summaryRoutes);
  });

  it("forwards POST / requests to the summary controller", async () => {
    const response = await request(app)
      .post("/api/summary/")
      .send({ prompt: "Please summarize this note." });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ai_summary: "Test summary" });
    expect(generateSummaryController).toHaveBeenCalledTimes(1);
    expect(generateSummaryController.mock.calls[0][0].body).toEqual({
      prompt: "Please summarize this note.",
    });
  });
});
