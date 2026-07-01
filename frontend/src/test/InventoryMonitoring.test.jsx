import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import InventoryMonitoring from "../components/InventoryMonitoring";

describe("InventoryMonitoring", () => {

  it("should display the Inventory Monitoring page", () => {
    // Arrange

    // Act
    render(<InventoryMonitoring />);

    // Assert
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Inventory Monitoring",
      })
    ).toBeInTheDocument();
  });

  it("should display all available lenses", () => {
    // Arrange

    // Act
    render(<InventoryMonitoring />);

    // Assert
    expect(
      screen.getByText("Blue Cut Lens")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Progressive Lens")
    ).toBeInTheDocument();
  });

  it("should display all available frames", () => {
    // Arrange

    // Act
    render(<InventoryMonitoring />);

    // Assert
    expect(
      screen.getByText("Metal Frame")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Acetate Frame")
    ).toBeInTheDocument();
  });

  it("should display inventory records in the table", () => {
    // Arrange

    // Act
    render(<InventoryMonitoring />);

    // Assert
    expect(
      screen.getByRole("table")
    ).toBeInTheDocument();
  });

  it("should display the correct number of inventory records", () => {
    // Arrange

    // Act
    render(<InventoryMonitoring />);

    // Assert
    expect(
      screen.getAllByRole("row")
    ).toHaveLength(5);
  });

  it("should display Available status for products with stock", () => {
  // Arrange

  // Act
  render(<InventoryMonitoring />);

  // Assert
  expect(
    screen.getAllByText("Available").length
  ).toBeGreaterThan(0);
});

it("should display Out of Stock status for products with zero stock", () => {
  // Arrange

  // Act
  render(<InventoryMonitoring />);

  // Assert
  expect(
    screen.getByText("Out of Stock")
  ).toBeInTheDocument();
});

});