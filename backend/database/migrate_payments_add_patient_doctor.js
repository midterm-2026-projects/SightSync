/**
 * Migration: add patient_id and doctor_id to payments table
 * Run once:  node database/migrate_payments_add_patient_doctor.js
 */
import pool from './db.js';

async function migrate() {
  try {
    await pool.query(`
      ALTER TABLE payments
        ADD COLUMN IF NOT EXISTS patient_id INTEGER REFERENCES patients(id) ON DELETE SET NULL,
        ADD COLUMN IF NOT EXISTS doctor_id  INTEGER REFERENCES doctors(id)  ON DELETE SET NULL,
        ADD COLUMN IF NOT EXISTS patient_name TEXT,
        ADD COLUMN IF NOT EXISTS doctor_name  TEXT;
    `);
    console.log('✅ Migration SUCCESS: patient_id, doctor_id, patient_name, doctor_name columns added to payments table.');
  } catch (err) {
    console.error('❌ Migration FAILED:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
