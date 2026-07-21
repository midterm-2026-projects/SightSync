import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import FrequentlyUsedFrames from "../../components/objective2/FrequentlyUsedFrames";

describe("FrequentlyUsedFrames Component", () => {
  it("should render the heading", () => {
    render(<FrequentlyUsedFrames frames={[]} />);

    expect(
      screen.getByText("Frequently Used Frames")
    ).toBeInTheDocument();
  });

  it("should render all frames", () => {
    const frames = [
      {
        frame_name: "Metal Frame",
        total_used: 150,
      },
      {
        frame_name: "Titanium Frame",
        total_used: 120,
      },
    ];

    render(<FrequentlyUsedFrames frames={frames} />);

    expect(
      screen.getByText("Metal Frame (150 uses)")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Titanium Frame (120 uses)")
    ).toBeInTheDocument();
  });
});