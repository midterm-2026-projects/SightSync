import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import InventoryTable from "../components/InventoryTable";

describe("InventoryTable", () => {
  test("should display inventory table", () => {

    // Arrange
    render(<InventoryTable />);

    // Act
    const header = screen.getByText(
      "Product Name"
    );

    // Assert
    expect(header).toBeInTheDocument();
  });
});