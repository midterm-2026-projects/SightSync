import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import InventoryTable from "../components/InventoryTable";

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
});