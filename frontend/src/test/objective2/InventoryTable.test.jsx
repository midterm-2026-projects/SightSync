import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import InventoryTable from "../../components/objective2/InventoryTable";

describe("InventoryTable Component", () => {
  const mockInventory = [
    {
      id: 1,
      name: "Blue Cut Lens",
      type: "lens",
      price: 1500,
      stock: 10,
    },
    {
      id: 2,
      name: "Metal Frame",
      type: "frame",
      price: 2500,
      stock: 0,
    },
  ];

  it("should render the inventory table heading", () => {
    render(<InventoryTable inventory={[]} />);

    expect(screen.getByText("Inventory List")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Manage your current items, stock levels, and availability."
      )
    ).toBeInTheDocument();
  });

  it("should display the total number of inventory items", () => {
    render(<InventoryTable inventory={mockInventory} />);

    expect(screen.getByText("Total Items: 2")).toBeInTheDocument();
  });

  it("should render all inventory items", () => {
    render(<InventoryTable inventory={mockInventory} />);

    expect(screen.getByText("Blue Cut Lens")).toBeInTheDocument();
    expect(screen.getByText("Metal Frame")).toBeInTheDocument();

    expect(screen.getByText("lens")).toBeInTheDocument();
    expect(screen.getByText("frame")).toBeInTheDocument();

    expect(screen.getByText("$1500.00")).toBeInTheDocument();
    expect(screen.getByText("$2500.00")).toBeInTheDocument();

    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("should display Available status when stock is greater than zero", () => {
    render(<InventoryTable inventory={mockInventory} />);

    expect(screen.getByText("Available")).toBeInTheDocument();
  });

  it("should display Out of Stock status when stock is zero", () => {
    render(<InventoryTable inventory={mockInventory} />);

    expect(screen.getByText("Out of Stock")).toBeInTheDocument();
  });

  it("should display an empty state when inventory is empty", () => {
    render(<InventoryTable inventory={[]} />);

    expect(
      screen.getByText("No inventory items found.")
    ).toBeInTheDocument();
  });
});