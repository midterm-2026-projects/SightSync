import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InventoryForm from "../components/InventoryForm";

describe("InventoryForm Validation", () => {

  it("should not submit when only Product Name is provided", async () => {
    // Arrange
    const mockSetInventory = vi.fn();
    const alertSpy = vi
    .spyOn(window, "alert")
    .mockImplementation(() => {});
    const user = userEvent.setup();

    render(
      <InventoryForm
        inventory={[]}
        setInventory={mockSetInventory}
      />
    );

    // Act
    await user.type(
      screen.getByPlaceholderText("Product Name"),
      "Blue Cut Lens"
    );

    await user.click(
      screen.getByRole("button", {
        name: /add product/i,
      })
    );

    // Assert
    expect(alertSpy)
    .toHaveBeenCalledWith(
    "Please complete all fields."
    );

    expect(mockSetInventory)
    .not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  it("should not submit when Product Name and Price are provided but Stock is empty", async () => {
    // Arrange
    const mockSetInventory = vi.fn();
    const alertSpy = vi
    .spyOn(window, "alert")
    .mockImplementation(() => {});
    const user = userEvent.setup();

    render(
      <InventoryForm
        inventory={[]}
        setInventory={mockSetInventory}
      />
    );

    // Act
    await user.type(
      screen.getByPlaceholderText("Product Name"),
      "Blue Cut Lens"
    );

    await user.type(
      screen.getByPlaceholderText("Price"),
      "1500"
    );

    await user.click(
      screen.getByRole("button", {
        name: /add product/i,
      })
    );

    // Assert
    expect(alertSpy)
    .toHaveBeenCalledWith(
    "Please complete all fields."
    );

    expect(mockSetInventory)
    .not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  it("should not submit when Product Name and Stock are provided but Price is empty", async () => {
    // Arrange
    const mockSetInventory = vi.fn();
    const alertSpy = vi
    .spyOn(window, "alert")
    .mockImplementation(() => {});
    const user = userEvent.setup();

    render(
      <InventoryForm
        inventory={[]}
        setInventory={mockSetInventory}
      />
    );

    // Act
    await user.type(
      screen.getByPlaceholderText("Product Name"),
      "Blue Cut Lens"
    );

    await user.type(
      screen.getByPlaceholderText("Stock"),
      "20"
    );

    await user.click(
      screen.getByRole("button", {
        name: /add product/i,
      })
    );

    // Assert
    expect(alertSpy)
    .toHaveBeenCalledWith(
    "Please complete all fields."
    );

    expect(mockSetInventory)
    .not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  it("should submit when all required fields are completed", async () => {
    // Arrange
    const mockSetInventory = vi.fn();
    const user = userEvent.setup();

    render(
      <InventoryForm
        inventory={[]}
        setInventory={mockSetInventory}
      />
    );

    // Act
    await user.type(
      screen.getByPlaceholderText("Product Name"),
      "Blue Cut Lens"
    );

    await user.type(
      screen.getByPlaceholderText("Price"),
      "1500"
    );

    await user.type(
      screen.getByPlaceholderText("Stock"),
      "20"
    );

    await user.click(
      screen.getByRole("button", {
        name: /add product/i,
      })
    );

    // Assert
    expect(mockSetInventory).toHaveBeenCalledWith([
     expect.objectContaining({
        name: "Blue Cut Lens",
        type: "Lens",
        price: 1500,
        stock: 20,
       }),
    ]);
    
  });

  it("should allow user to select Frame from dropdown", async () => {
    // Arrange
    const user = userEvent.setup();

    render(
      <InventoryForm
        inventory={[]}
        setInventory={vi.fn()}
      />
    );

    // Act
    await user.selectOptions(
      screen.getByRole("combobox"),
      "Frame"
    );

    // Assert
    expect(
      screen.getByRole("combobox")
    ).toHaveValue("Frame");
  });

  it("should not submit when price is less than or equal to zero", async () => {
    // Arrange
    const alertSpy = vi
    .spyOn(window, "alert")
    .mockImplementation(() => {});

    const mockSetInventory = vi.fn();
    const user = userEvent.setup();

    render(
    <InventoryForm
      inventory={[]}
      setInventory={mockSetInventory}
     />
    );

     // Act
     await user.type(
      screen.getByPlaceholderText("Product Name"),
      "Blue Cut Lens"
    );

     await user.type(
      screen.getByPlaceholderText("Price"),
      "0"
    );

     await user.type(
      screen.getByPlaceholderText("Stock"),
      "20"
    );

     await user.click(
      screen.getByRole("button", {
       name: /add product/i,
      })
    );

    // Assert
     expect(alertSpy).toHaveBeenCalledWith(
    "Price must be greater than zero."
    );

    expect(mockSetInventory).not.toHaveBeenCalled();
    alertSpy.mockRestore();
  });

  it("should not submit when stock quantity is negative", async () => {
  // Arrange
  const alertSpy = vi
    .spyOn(window, "alert")
    .mockImplementation(() => {});

  const mockSetInventory = vi.fn();
  const user = userEvent.setup();

  render(
    <InventoryForm
      inventory={[]}
      setInventory={mockSetInventory}
    />
  );

  // Act
  await user.type(
    screen.getByPlaceholderText("Product Name"),
    "Blue Cut Lens"
  );

  await user.type(
    screen.getByPlaceholderText("Price"),
    "1500"
  );

  await user.type(
    screen.getByPlaceholderText("Stock"),
    "-1"
  );

  await user.click(
    screen.getByRole("button", {
      name: /add product/i,
    })
  );

  // Assert
  expect(alertSpy).toHaveBeenCalledWith(
    "Stock quantity cannot be negative."
  );

  expect(mockSetInventory).not.toHaveBeenCalled();
  alertSpy.mockRestore();
  });

});