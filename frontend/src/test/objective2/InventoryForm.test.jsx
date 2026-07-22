import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import InventoryForm from "../../components/objective2/InventoryForm";

describe("InventoryForm", () => {
  it("renders the Add Product heading", () => {
    render(<InventoryForm inventory={[]} setInventory={vi.fn()} />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Add Product",
      })
    ).toBeInTheDocument();
  });

  it("renders all form fields", () => {
    render(<InventoryForm inventory={[]} setInventory={vi.fn()} />);

    expect(screen.getByLabelText("Product Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Product Type")).toBeInTheDocument();
    expect(screen.getByLabelText("Price ($)")).toBeInTheDocument();
    expect(screen.getByLabelText("Stock Quantity")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Add Product" })
    ).toBeInTheDocument();
  });

  it("shows validation message when fields are empty", async () => {
    const user = userEvent.setup();

    render(<InventoryForm inventory={[]} setInventory={vi.fn()} />);

    await user.click(
      screen.getByRole("button", { name: "Add Product" })
    );

    expect(
      screen.getByText("Please complete all fields.")
    ).toBeInTheDocument();
  });

  it("shows validation when price is zero", async () => {
    const user = userEvent.setup();

    render(<InventoryForm inventory={[]} setInventory={vi.fn()} />);

    await user.type(
      screen.getByLabelText("Product Name"),
      "Blue Cut Lens"
    );

    await user.type(
      screen.getByLabelText("Price ($)"),
      "0"
    );

    await user.type(
      screen.getByLabelText("Stock Quantity"),
      "10"
    );

    await user.click(
      screen.getByRole("button", { name: "Add Product" })
    );

    expect(
      screen.getByText("Price must be greater than zero.")
    ).toBeInTheDocument();
  });

  it("shows validation when stock is negative", async () => {
    const user = userEvent.setup();

    render(<InventoryForm inventory={[]} setInventory={vi.fn()} />);

    await user.type(
      screen.getByLabelText("Product Name"),
      "Blue Cut Lens"
    );

    await user.type(
      screen.getByLabelText("Price ($)"),
      "1500"
    );

    await user.type(
      screen.getByLabelText("Stock Quantity"),
      "-5"
    );

    await user.click(
      screen.getByRole("button", { name: "Add Product" })
    );

    expect(
      screen.getByText("Stock quantity cannot be negative.")
    ).toBeInTheDocument();
  });

  it("adds a product successfully", async () => {
    const user = userEvent.setup();
    const setInventory = vi.fn();

    render(<InventoryForm inventory={[]} setInventory={setInventory} />);

    await user.type(
      screen.getByLabelText("Product Name"),
      "Blue Cut Lens"
    );

    await user.selectOptions(
      screen.getByLabelText("Product Type"),
      "Lens"
    );

    await user.type(
      screen.getByLabelText("Price ($)"),
      "1500"
    );

    await user.type(
      screen.getByLabelText("Stock Quantity"),
      "20"
    );

    await user.click(
      screen.getByRole("button", { name: "Add Product" })
    );

    expect(setInventory).toHaveBeenCalledTimes(1);
  });
});