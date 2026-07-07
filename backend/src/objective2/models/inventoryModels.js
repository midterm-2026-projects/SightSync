import pool from "../../../database/db.js";

export async function getAllInventory() {
  const lenses = await pool.query("SELECT * FROM lenses");
  const frames = await pool.query("SELECT * FROM frames");

  return {
    lenses: lenses.rows,
    frames: frames.rows,
  };
}

export async function createInventory(data) {
  const { name, type, price, stock } = data;

  const table = type === "Lens" ? "lenses" : "frames";

  const result = await pool.query(
    `INSERT INTO ${table} (name, price, stock)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, price, stock]
  );

  return result.rows[0];
}