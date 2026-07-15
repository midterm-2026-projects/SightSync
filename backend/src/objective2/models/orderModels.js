import pool from "../../../database/db.js";

// GET
export async function getAllOrders() {

  const result = await pool.query(
    "SELECT * FROM orders ORDER BY created_at DESC"
  );

  return result.rows;

}

// POST
export async function createOrder(data) {

  const { patientName, lensName, frameName } = data;

  const result = await pool.query(
    `INSERT INTO orders
      (patient_name, lens_name, frame_name)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [patientName, lensName, frameName]
  );

  return result.rows[0];

}

// PUT
export async function updateOrder(id, data) {

  const { patientName, lensName, frameName } = data;

  const result = await pool.query(
    `UPDATE orders
        SET patient_name = $1,
            lens_name = $2,
            frame_name = $3
      WHERE id = $4
      RETURNING *`,
    [patientName, lensName, frameName, id]
  );

  return result.rows[0];

}

// DELETE
export async function deleteOrder(id) {

  const result = await pool.query(
    `DELETE FROM orders
      WHERE id = $1
      RETURNING *`,
    [id]
  );

  return result.rows[0];

}