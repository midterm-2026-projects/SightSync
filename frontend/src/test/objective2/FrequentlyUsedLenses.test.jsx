import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import FrequentlyUsedLenses from "../../components/objective2/FrequentlyUsedLenses";

describe("FrequentlyUsedLenses Component", () => {

  it("should render the heading", () => {

    render(<FrequentlyUsedLenses lenses={[]} />);

    expect(
      screen.getByText("Frequently Used Lenses")
    ).toBeInTheDocument();

  });

  it("should render all lenses", () => {

    const lenses = [
      {
        lens_name: "Blue Cut Lens",
        total_used: 184,
      },
      {
        lens_name: "Progressive Lens",
        total_used: 173,
      },
    ];

    render(<FrequentlyUsedLenses lenses={lenses} />);

    expect(
      screen.getByText("Blue Cut Lens (184 uses)")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Progressive Lens (173 uses)")
    ).toBeInTheDocument();

  });

});