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