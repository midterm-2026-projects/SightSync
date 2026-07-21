import pool from "../../../config/db.js";

// Get Frequently Used Lenses
export async function getFrequentlyUsedLenses() {
  const result = await pool.query(`
    SELECT
        lens_name,
        COUNT(*) AS total_used
    FROM orders
    GROUP BY lens_name
    ORDER BY total_used DESC
    LIMIT 5;
  `);

  return result.rows;
}

// Get Frequently Used Frames
export async function getFrequentlyUsedFrames() {
  const result = await pool.query(`
    SELECT
        frame_name,
        COUNT(*) AS total_used
    FROM orders
    GROUP BY frame_name
    ORDER BY total_used DESC
    LIMIT 5;
  `);

  return result.rows;
}