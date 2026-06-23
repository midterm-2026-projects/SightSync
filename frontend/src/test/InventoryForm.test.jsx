import "@testing-library/jest-dom";
import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import InventoryForm from "../components/InventoryForm";

describe("InventoryForm", () => {
  test("should display save button", () => {

    // Arrange
    render(<InventoryForm />);

    // Act
    const button = screen.getByRole("button");

    // Assert
    expect(button).toBeInTheDocument();
  });
});