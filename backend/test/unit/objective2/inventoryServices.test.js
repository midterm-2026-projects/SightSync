import { describe, it, expect } from "vitest";
import { validateInventory } from "../../../src/objective2/services/inventoryServices.js";

    describe("Inventory Validation Service", () => {

    it("should return valid when inventory data is correct", () => {

        // Arrange
        const inventory = {
        name: "Blue Cut Lens",
        type: "Lens",
        price: 1500,
        stock: 20,
        };

        // Act
        const result = validateInventory(inventory);

        // Assert
        expect(result.valid).toBe(true);

    });

    it("should return invalid when product name is empty", () => {

    // Arrange
    const inventory = {
        name: "",
        type: "Lens",
        price: 1500,
        stock: 20,
    };

    // Act
    const result = validateInventory(inventory);

    // Assert
    expect(result.valid).toBe(false);
    expect(result.message).toBe("Product name is required.");

    });

    it("should return invalid when product type is incorrect", () => {

    const inventory = {
        name: "Blue Cut Lens",
        type: "Camera",
        price: 1500,
        stock: 20,
    };

    const result = validateInventory(inventory);

    expect(result.valid).toBe(false);
    expect(result.message).toBe("Product type must be either Lens or Frame.");

    });

    it("should return invalid when price is less than or equal to zero", () => {

    const inventory = {
        name: "Blue Cut Lens",
        type: "Lens",
        price: 0,
        stock: 20,
    };

    const result = validateInventory(inventory);

    expect(result.valid).toBe(false);

    });

    it("should return invalid when stock is negative", () => {

    const inventory = {
        name: "Blue Cut Lens",
        type: "Lens",
        price: 1500,
        stock: -5,
    };

    const result = validateInventory(inventory);

    expect(result.valid).toBe(false);

    });

});