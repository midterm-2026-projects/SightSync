import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import InventoryForm from "../../components/objective2/InventoryForm";

describe("InventoryForm Component", () => {
  it("should render the form heading", () => {
    render(
      <InventoryForm
        inventory={[]}
        setInventory={vi.fn()}
      />
    );

    expect(screen.getByRole("heading", {level: 2,name: "Add Product",})).toBeInTheDocument();
    
    expect(
      screen.getByText(
        "Enter product details to add new items to your inventory."
      )
    ).toBeInTheDocument();
  });

  it("should show validation error when fields are empty", async () => {
    const user = userEvent.setup();

    render(
      <InventoryForm
        inventory={[]}
        setInventory={vi.fn()}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: "Add Product",
      })
    );

    expect(
      screen.getByText("Please complete all fields.")
    ).toBeInTheDocument();
  });

  it("should show validation error for invalid price", async () => {
    const user = userEvent.setup();

    render(
      <InventoryForm
        inventory={[]}
        setInventory={vi.fn()}
      />
    );

    await user.type(
      screen.getByPlaceholderText("e.g. Classic Aviator"),
      "Blue Cut Lens"
    );

    await user.type(
      screen.getByPlaceholderText("0.00"),
      "0"
    );

    await user.type(
      screen.getByPlaceholderText("0"),
      "10"
    );

    await user.click(
      screen.getByRole("button", {
        name: "Add Product",
      })
    );

    expect(
      screen.getByText("Price must be greater than zero.")
    ).toBeInTheDocument();
  });

  it("should show validation error for negative stock", async () => {
    const user = userEvent.setup();

    render(
      <InventoryForm
        inventory={[]}
        setInventory={vi.fn()}
      />
    );

    await user.type(
      screen.getByPlaceholderText("e.g. Classic Aviator"),
      "Blue Cut Lens"
    );

    await user.type(
      screen.getByPlaceholderText("0.00"),
      "1200"
    );

    await user.type(
      screen.getByPlaceholderText("0"),
      "-1"
    );

    await user.click(
      screen.getByRole("button", {
        name: "Add Product",
      })
    );

    expect(
      screen.getByText("Stock quantity cannot be negative.")
    ).toBeInTheDocument();
  });

  it("should add a new product when form is valid", async () => {
    const user = userEvent.setup();

    const inventory = [];
    const setInventory = vi.fn();

    render(
      <InventoryForm
        inventory={inventory}
        setInventory={setInventory}
      />
    );

    await user.type(
      screen.getByPlaceholderText("e.g. Classic Aviator"),
      "Blue Cut Lens"
    );

    await user.selectOptions(
      screen.getByRole("combobox"),
      "Lens"
    );

    await user.type(
      screen.getByPlaceholderText("0.00"),
      "1500"
    );

    await user.type(
      screen.getByPlaceholderText("0"),
      "20"
    );

    await user.click(
      screen.getByRole("button", {
        name: "Add Product",
      })
    );

    expect(setInventory).toHaveBeenCalledTimes(1);
  });

  it("should clear the validation message when close button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <InventoryForm
        inventory={[]}
        setInventory={vi.fn()}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: "Add Product",
      })
    );

    expect(
      screen.getByText("Please complete all fields.")
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "✕",
      })
    );

    expect(
      screen.queryByText("Please complete all fields.")
    ).not.toBeInTheDocument();
  });
});