import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PredictionDashboard from "../../components/objective2/PredictionDashboard";

describe("PredictionDashboard Component", () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            frequentlyUsedLenses: [
              {
                lens_name: "Blue Cut Lens",
                total_used: 184,
              },
            ],
            frequentlyUsedFrames: [
              {
                frame_name: "Metal Frame",
                total_used: 150,
              },
            ],
          }),
      })
    );
  });

  it("should render prediction dashboard", async () => {
    render(<PredictionDashboard />);

    expect(
      screen.getByText("Prediction Dashboard")
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText("Blue Cut Lens (184 uses)")
      ).toBeInTheDocument();

      expect(
        screen.getByText("Metal Frame (150 uses)")
      ).toBeInTheDocument();
    });
  });
});