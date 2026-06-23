import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import InventoryPage from "../components/InventoryPage";

describe("InventoryPage", () => {
  test("should render inventory management page", () => {

    // Arrange
    render(<InventoryPage />);

    // Act
    const heading = screen.getByText(
      "Inventory Management"
    );

    // Assert
    expect(heading).toBeInTheDocument();
  });
});