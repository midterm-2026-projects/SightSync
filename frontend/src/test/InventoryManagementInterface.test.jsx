import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import InventoryManagementInterface from "../components/InventoryManagementInterface";

describe("InventoryManagementInterface", () => {

  it("should render the Inventory Management title", () => {
    // Arrange

    // Act
    render(<InventoryManagementInterface />);

    // Assert
    expect(
      screen.getByText("Inventory Management")
    ).toBeInTheDocument();
  });

  it("should render the Add Product heading", () => {
    render(<InventoryManagementInterface />);

    expect(
          
      screen.getByRole("heading", {
      level: 2,
      name: "Add Product",
})
    ).toBeInTheDocument();
  });

  it("should render the Product Name input", () => {
    render(<InventoryManagementInterface />);

    expect(
      screen.getByPlaceholderText("Product Name")
    ).toBeInTheDocument();
  });

  it("should render the Price input", () => {
    render(<InventoryManagementInterface />);

    expect(
      screen.getByPlaceholderText("Price")
    ).toBeInTheDocument();
  });

  it("should render the Stock input", () => {
    render(<InventoryManagementInterface />);

    expect(
      screen.getByPlaceholderText("Stock")
    ).toBeInTheDocument();
  });

  it("should render the Add Product button", () => {
    render(<InventoryManagementInterface />);

    expect(
      screen.getByRole("button", {
        name: /add product/i,
      })
    ).toBeInTheDocument();
  });

  it("should render the inventory table", () => {
    render(<InventoryManagementInterface />);

    expect(
      screen.getByRole("table")
    ).toBeInTheDocument();
  });

  it("should display the default inventory item", () => {
    render(<InventoryManagementInterface />);

    expect(
      screen.getByText("Blue Cut Lens")
    ).toBeInTheDocument();
  });

});