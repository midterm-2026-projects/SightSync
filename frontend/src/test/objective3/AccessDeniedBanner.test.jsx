import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
// FIX: Adjusted path to target the components folder correctly relative to src/test/
import AccessDeniedBanner from "../../components/objective3/AccessDeniedBanner";

// FIX: Adjusted mock target to reference the right path location relative to src/test/
vi.mock("../components/receiptConstants", () => ({
  C: {
    danger: "#E11D48",
  },
}));

describe("AccessDeniedBanner Component", () => {
  it("renders the structural wrapper via its data-testid attribute", () => {
    render(<AccessDeniedBanner />);
    const bannerElement = screen.getByTestId("access-denied-banner");
    expect(bannerElement).toBeInTheDocument();
  });

  it("displays the correct header titles and strict text instructions", () => {
    render(<AccessDeniedBanner />);
    
    // Check main warning text
    expect(screen.getByText("Access Denied")).toBeInTheDocument();
    
    // Check details paragraph phrasing
    const descriptiveText = screen.getByText(/Only/i);
    expect(descriptiveText).toHaveTextContent(
      "Only admin and staff users can access the messaging module. Switch to an authorized account to continue."
    );
  });

  it("renders critical icons and structural layout highlights", () => {
    render(<AccessDeniedBanner />);
    
    // Ensure the visual warning emoji indicator mounts
    expect(screen.getByText("🚫")).toBeInTheDocument();
    
    // Verify specific bold role expectations are isolated correctly
    expect(screen.getByText("admin")).toBeInTheDocument();
    expect(screen.getByText("staff")).toBeInTheDocument();
  });

  it("applies the expected inline style rules for colors and sizing profiles", () => {
    render(<AccessDeniedBanner />);
    const bannerElement = screen.getByTestId("access-denied-banner");

    // Match exact CSS properties specified in your style objects
    expect(bannerElement).toHaveStyle({
      background: "#FFF1F2",
      border: "1.5px solid #FECDD3",
      display: "flex",
      gap: "14px",
    });
  });
});