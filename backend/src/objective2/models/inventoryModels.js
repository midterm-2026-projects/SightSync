import pool from "../../../database/db.js";

// GET Inventory
export async function getAllInventory() {

  const lenses = await pool.query("SELECT * FROM lenses ORDER BY id ASC");
  const frames = await pool.query("SELECT * FROM frames ORDER BY id ASC");

  return {
    lenses: lenses.rows,
    frames: frames.rows,
  };

}

// POST Inventory
export async function createInventory(data) {

  const { name, type, price, stock } = data;

  const table =
    type === "Lens" ? "lenses" : "frames";

  const result = await pool.query(
    `INSERT INTO ${table} (name, price, stock)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, price, stock]
  );

  return result.rows[0];

}

// PUT Inventory Price
export async function updateInventoryPrice(
  table,
  id,
  price
) {

  const allowedTables = {
    lenses: "lenses",
    frames: "frames",
  };

  const tableName = allowedTables[table];

  if (!tableName) {
    return null;
  }

  const result = await pool.query(
    `UPDATE ${tableName}
     SET price = $1
     WHERE id = $2
     RETURNING *`,
    [price, id]
  );

  return result.rows[0];

}

// NEW 

// GET Current Stock
export async function getCurrentStock(table,id) {

  const allowedTables = {
    lenses: "lenses",
    frames: "frames",
  };

  const tableName = allowedTables[table];

  if (!tableName) {
    return null;
  }

  const result = await pool.query(
    `SELECT id, name, stock
     FROM ${tableName}
     WHERE id = $1`,
    [id]
  );

  return result.rows[0];

}

// NEW

// PUT Stock
export async function updateStock(table,id,stock) {

  const allowedTables = {
    lenses: "lenses",
    frames: "frames",
  };

  const tableName = allowedTables[table];

  if (!tableName) {
    return null;
  }

  const result = await pool.query(
    `UPDATE ${tableName}
     SET stock = $1
     WHERE id = $2
     RETURNING *`,
    [stock, id]
  );

  return result.rows[0];

}

// GET Lens By Name
export async function findLensByName(name) {

  const result = await pool.query(
    `SELECT *
     FROM lenses
     WHERE name = $1`,
    [name]
  );

  return result.rows[0];

}

// GET Frame By Name
export async function findFrameByName(name) {

  const result = await pool.query(
    `SELECT *
     FROM frames
     WHERE name = $1`,
    [name]
  );

  return result.rows[0];

}