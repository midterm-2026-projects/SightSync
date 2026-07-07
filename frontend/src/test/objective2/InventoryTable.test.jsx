import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import InventoryTable from "../../components/objective2/InventoryTable";

describe("InventoryTable", () => {
  const inventory = [
    {
      id: 1,
      name: "Blue Cut Lens",
      type: "Lens",
      price: 1500,
      stock: 20,
    },
  ];

  const testCases = [
    {
      description: "should display inventory item name",
      value: "Blue Cut Lens",
    },
    {
      description: "should display inventory item type",
      value: "Lens",
    },
    {
      description: "should display inventory item price",
      value: "1500",
    },
    {
      description: "should display inventory item stock",
      value: "20",
    },
    {
      description: "should display Available status",
      value: "Available",
    },
  ];

  testCases.forEach(({ description, value }) => {
    it(description, () => {
      // Arrange
      render(
        <InventoryTable
          inventory={inventory}
        />
      );

      // Act

      // Assert
      expect(
        screen.getByText(value)
      ).toBeInTheDocument();
    });
  });

  it("should display Out of Stock status when stock is zero", () => {
    // Arrange
    const inventory = [
      {
        id: 1,
        name: "Metal Frame",
        type: "Frame",
        price: 2500,
        stock: 0,
      },
    ];

    // Act
    render(
      <InventoryTable
        inventory={inventory}
      />
    );

    // Assert
    expect(
      screen.getByText("Out of Stock")
    ).toBeInTheDocument();
  });

});