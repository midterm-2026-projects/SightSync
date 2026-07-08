import { describe, it, expect, afterEach, afterAll } from "vitest";
import pool from "../../../database/db.js";
import {getAllInventory, createInventory, updateInventoryPrice,} from "../../../src/objective2/models/inventoryModels.js";


const createdRecords = [];

describe("Inventory Models", () => {

  afterEach(async () => {

    while (createdRecords.length > 0) {

      const record = createdRecords.pop();

      await pool.query(
        `DELETE FROM ${record.table} WHERE id = $1`,
        [record.id]
      );

    }

  });

  afterAll(async () => {
    await pool.end();
  });

  it("should retrieve all inventory from the database", async () => {

    // Act
    const result = await getAllInventory();

    // Assert
    expect(result).toHaveProperty("lenses");
    expect(result).toHaveProperty("frames");

    expect(Array.isArray(result.lenses)).toBe(true);
    expect(Array.isArray(result.frames)).toBe(true);

  });

  it("should create a Lens inventory", async () => {

    // Arrange
    const inventory = {
      name: `Lens ${Date.now()}`,
      type: "Lens",
      price: 1500,
      stock: 20,
    };

    // Act
    const result = await createInventory(inventory);

    createdRecords.push({
      table: "lenses",
      id: result.id,
    });

    // Verify from database
    const verify = await pool.query(
      "SELECT * FROM lenses WHERE id = $1",
      [result.id]
    );

    // Assert
    expect(verify.rows).toHaveLength(1);
    expect(verify.rows[0].name).toBe(inventory.name);
    expect(verify.rows[0].price).toBe("1500.00");
    expect(verify.rows[0].stock).toBe(20);

  });

  it("should create a Frame inventory", async () => {

    // Arrange
    const inventory = {
      name: `Frame ${Date.now()}`,
      type: "Frame",
      price: 2500,
      stock: 10,
    };

    // Act
    const result = await createInventory(inventory);

    createdRecords.push({
      table: "frames",
      id: result.id,
    });

    // Verify from database
    const verify = await pool.query(
      "SELECT * FROM frames WHERE id = $1",
      [result.id]
    );

    // Assert
    expect(verify.rows).toHaveLength(1);
    expect(verify.rows[0].name).toBe(inventory.name);
    expect(verify.rows[0].price).toBe("2500.00");
    expect(verify.rows[0].stock).toBe(10);

  });


  it("should update inventory price", async () => {

    // Arrange
    const inventory = {
      name: `Lens ${Date.now()}`,
      type: "Lens",
      price: 1500,
      stock: 20,
    };

    // Create inventory first
    const created = await createInventory(inventory);

    createdRecords.push({
      table: "lenses",
      id: created.id,
    });

    // Act
    const updated = await updateInventoryPrice(
      "lenses",
      created.id,
      2000
    );

    // Verify from database
    const verify = await pool.query(
      "SELECT * FROM lenses WHERE id = $1",
      [created.id]
    );

    // Assert
    expect(updated).toBeDefined();
    expect(updated.id).toBe(created.id);

    expect(Number(updated.price)).toBe(2000);

    expect(Number(verify.rows[0].price)).toBe(2000);

  });

  it("should return null for an invalid table", async () => {

    // Act
    const result = await updateInventoryPrice(
      "invalid_table",
      1,
      2000
    );

    // Assert
    expect(result).toBeNull();

  });

});

    
